export var _handleRotate = (canvasRef, imgSrc) => {
    //console.log(direction)
    canvasRef.getContext('2d')

    const canvas = canvasRef // document.createElement('canvas');
    canvas.width = imgSrc.width
    canvas.height = canvas.height
    const ctx = canvas.getContext('2d')

    const image = new Image()
    
    image.onload = function () {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.save();
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(imgSrc.degrees*Math.PI/180);
        ctx.drawImage(image,-image.width/2,-image.width/2);
        ctx.restore();
    }
    
    image.src = imgSrc.imgSrc

}