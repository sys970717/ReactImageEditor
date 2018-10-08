export var _handleRotate = (canvasRef, imgSrc) => {
    canvasRef.getContext('2d')

    const canvas = canvasRef // document.createElement('canvas');
    const ctx = canvas.getContext('2d')

    const image = new Image()
    image.onload = function () {
        var width = image.width, height = image.height
        
        if (width > 500) {
            height *= 500 / width
            width = 500
        }

        var ox = (canvas.width / 2),
            oy = (canvas.height / 2)

        ctx.save()

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.translate(ox, oy)
        ctx.rotate((Math.PI / 180) * imgSrc.degrees)
        ctx.translate(-ox, -oy)
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
        ctx.restore();
    }

    image.src = imgSrc.imgSrc
}