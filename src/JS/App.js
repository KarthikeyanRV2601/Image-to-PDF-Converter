
var ImagesTemp = [];
const ImageHolder = document.querySelector('.Workspace .Gallery .Images');


const changeDisplay=()=>{
    const Gallery=document.querySelector('.Workspace .Gallery');
    const iframe=document.querySelector('.Workspace .PDF');
    const ConvertButton=document.querySelector('.Workspace .Convert');
    const Sidepanel=document.querySelector('.Workspace .sidePanel');
    const TopPanel=document.querySelector('.Workspace .TopPanel');
    iframe.style.display="inherit";
    Gallery.style.display="none";
    ConvertButton.style.display="none";
    Sidepanel.style.display="none";
    TopPanel.style.display="none";
    
}

const showPDF=(openPDF=false)=>
{
    openPDF?changeDisplay():null;
}

const createPDF = async (openPDF=false) => {

    const images = document.querySelectorAll('.Image');
    const Progress=document.querySelector('.Workspace .sidePanel .ProgressBar .Progress');
    const ProgressBar=document.querySelector('.Workspace .sidePanel .ProgressBar');
    const ConvertInfo=document.querySelector('.Workspace .sidePanel .Convert-Info');
    const ConvertButton=document.querySelector('.Workspace .sidePanel .Convert');

    const pdfDoc = await PDFLib.PDFDocument.create();
    var i = 0;
    const ratio=200/images.length;
    ProgressBar.style.opacity=1;
    ConvertInfo.style.opacity=0;
    ConvertButton.style.opacity=0;
    while (i < images.length) {
        
        const page = pdfDoc.addPage();
        var Url,ImageBytes,Image,Dims;
        if(images[i].dataset.type==="jpeg")
        {
        Url = images[i].src;
        ImageBytes = await fetch(Url).then((res) => res.arrayBuffer())
        Image=await pdfDoc.embedJpg(ImageBytes);
        Dims = Image.scale(0.25)
        }
        else{
        Url = images[i].src;
        ImageBytes = await fetch(Url).then((res) => res.arrayBuffer())
        Image=await pdfDoc.embedPng(ImageBytes);
        Dims = Image.scale(0.25)

        }
        
        page.drawImage(Image,{
            x: page.getWidth() / 2 - Dims.width / 2,
            y: page.getHeight() / 2 - Dims.height / 2,
            width: Dims.width,
            height: Dims.height,
        });
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        Progress.style.width=(i+1)*ratio+'px';
        document.getElementById('pdf').src = pdfDataUri;
        i++;
        
    }
    showPDF(openPDF);
}


const startConverting=(openPDF=false)=>{

    openPDF?createPDF(openPDF):null;
    
}


const readURL = (input) => {

    if (input.files && input.files[0]) {
        if(ImagesTemp.length)
        {
        ImagesTemp = [...ImagesTemp, input.files];
        addNewImages(ImagesTemp[0]);
        }
        else{
            addNewImages(input.files);
        }
    }
    window.scrollTo({
        
        top:document.getElementById('workspace').offsetTop,
        behavior: 'smooth',
        }
        );
}



var checkDelete = false;



const deleteImage = (src,e) => {

   
    const imageWraps=document.querySelectorAll('.ImageWrap');
    imageWraps.forEach(imageWrap=>imageWrap.childNodes[0].dataset.index===e.target.attributes[1].nodeValue?imageWrap.remove():null);
    


}

{/* <div class="img-wrap">
    <span class="close">&times;</span>
    <img src="http://lorempixel.com/100/80">
</div> */}
var index=0;
const addImageElement = (src,type) => {
    const imageWrap = document.createElement('div');
    const deleteButton = document.createElement('span');
    const image = document.createElement('img');
    deleteButton.addEventListener('click', (e) => { checkDelete = true; deleteImage(src,e); });

    imageWrap.appendChild(image);
    imageWrap.appendChild(deleteButton);
    deleteButton.className = "DeleteButton";
    deleteButton.dataset.index=index;
    imageWrap.className = "ImageWrap";
    image.src = src;
    image.className = "Image";
    image.dataset.index=index;
    image.dataset.type=type;
    index++;
    // console.log(src);
    ImageHolder.appendChild(imageWrap);
}

const addNewImages = (Images) => {
    var length = Images.length;
    const Workspace=document.querySelector('.Workspace');
    var i = 0;
    while (i < length) {
        
        var reader = new FileReader();
        reader.readAsDataURL(Images[i])
        reader.onload = (e) => {
            var str=e.target.result;
            var type=str.slice(11,str.indexOf(';'));
            addImageElement(e.target.result,type);
        }

        i++;
    }

    Workspace.style.display="inherit";
    
    
}





const dropContainer = document.querySelector('.Container');

dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
    evt.preventDefault();
};

dropContainer.ondrop = function (evt) {

    readURL(evt.dataTransfer);
    evt.preventDefault();

};
//to make the images sortable
$( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  } );
