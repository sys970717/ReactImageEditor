import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { image64toCanvasRef, downloadBase64File, base64StringtoFile, extractImageFileExtensionFromBase64 } from './ResuableUtils'
import { _handleRotate } from './ImageRotate'

const imageMaxSize = 100000000 //bytes
const acceptedFileTypes = 'image/jpeg, image/jpg'
const acceptedFileTypesArray = acceptedFileTypes.split(',').map((item) => { return item.trim() })

class ImgDropZoneAndCrop extends Component {

    constructor(props) {
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.originImgSrc = ''
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            crop: {

            },
            condition: true,
            degrees: Number(0)
        }
    }

    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > imageMaxSize) {
                alert('This file is now allowed. ' + currentFileSize + 'bytes is too large')
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                alert('This file is not allowed. only images are allowed.')
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            console.log(rejectedFiles)
            this.verifyFile(rejectedFiles)
        }

        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                // imageBase64Data
                const currentFile = files[0]
                var tmpPixelCrop = { x: 0, y: 0, width: 500, height: 400 }
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener('load', () => {
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result

                    this.originImgSrc = myResult
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt: extractImageFileExtensionFromBase64(myResult),
                        condition: true
                    })

                    const image = new Image()
                    image.src = myResult
                    image.onload = () => {
                        console.log(image.width)

                        tmpPixelCrop.width = image.width
                        tmpPixelCrop.height = image.height

                        // Canvas
                        const canvas = this.imagePreviewCanvasRef.current
                        const { imgSrc } = this.state

                        image64toCanvasRef(canvas, imgSrc, tmpPixelCrop)
                    }
                }, false)
                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }
    handleImageLoaded = (image) => {
        
    }
    handleChangeCropCondition = (crop) => {
        if (this.state.condition === false) {
            this.setState({ crop: crop, condition: true, degrees: Number(0) })
        } else if (this.state.condition === true) {
            this.setState({ crop: '', condition: false, degrees: Number(0) })
        }
    }
    handleOnCropChange = (crop) => {
        this.setState({ crop: crop })
    }
    handleOnCropComplete = (crop, pixelCrop) => {
        console.log(crop, pixelCrop)

        const canvasRef = this.imagePreviewCanvasRef.current
        const { imgSrc } = this.state
        image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
    }
    // Crop Submit Button Event
    handleCropped = (event) => {
        const canvasRef = this.imagePreviewCanvasRef.current
        const ctx = canvasRef.getContext('2d')

        console.log(canvasRef.toDataURL())
        // var myResult = getBase64Image(canvasRef.toDataURL('image/jpg'))
        var myResult = canvasRef.toDataURL('image/', this.state.imgSrcExt)

        var tmpPixelCrop = { x: 0, y: 0, width: 500, height: 400 }

        const image = new Image()
        image.src = myResult
        image.onload = () => {
            ctx.clearRect(0, 0, 500, 500);
            tmpPixelCrop.width = image.width
            tmpPixelCrop.height = image.height

            image64toCanvasRef(canvasRef, this.state.imgSrc, tmpPixelCrop)
        }

        ctx.restore();

        this.setState({
            imgSrc: myResult,
            imgSrcExt: extractImageFileExtensionFromBase64(myResult),
            condition: true,
            crop : {

            }
        });

    }

    handleDownloadClick = (event) => {
        event.preventDefault()
        const { imgSrc } = this.state
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current

            const { imgSrcExt } = this.state
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)

            const myFilename = "previewFile." + imgSrcExt

            // file to be uploaded
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
            console.log(myNewCroppedFile)
            // download file
            downloadBase64File(imageData64, myFilename)
            this.handleClearToDefault()
        }
    }

    handleClearToDefault = event => {
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {

            },
            degrees: Number(0)

        })
    }

    handleRotate = (e) => {
        const canvasRef = this.imagePreviewCanvasRef.current
        const imgSrc = this.state
        const direction = e.target.textContent.toLowerCase()
        var degrees = imgSrc.degrees;

        console.log(degrees)

        if (direction === 'left') {
            if (imgSrc.degrees >= 360) {
                imgSrc.degrees = 90
            } else {
                imgSrc.degrees = degrees + 90
            }
        } else {
            if (imgSrc.degrees === 0) {
                imgSrc.degrees = 270
            } else {
                imgSrc.degrees = degrees - 90
            }
        }
        _handleRotate(canvasRef, imgSrc)
    }

    render() {
        const { imgSrc } = this.state

        return (
            <div>
                <h1>Drop and Crop</h1>
                <Dropzone onDrop={this.handleOnDrop} maxSize={imageMaxSize} multiple={false} accept={acceptedFileTypes}> Drop/Click here or to upload here </Dropzone>
                {imgSrc !== null ?
                    <div>
                        <ReactCrop
                            src={imgSrc}
                            crop={this.state.crop}
                            onChange={this.handleOnCropChange}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.handleOnCropComplete}
                            disabled={this.state.condition}
                        />
                        <br />
                        <p>Preview Canvas Crop</p>
                        <button onClick={this.handleChangeCropCondition}>Crop{this.state.condition}</button>
                        <button onClick={this.handleCropped}>Crop Submit</button>
                        <button onClick={this.handleRotate}>Right</button>
                        <button onClick={this.handleRotate}>Left</button>
                        <button onClick={this.handleDownloadClick}>Save</button>
                        <button onClick={this.handleClearToDefault}>Clear</button>
                    </div>
                    : ''}
                <canvas ref={this.imagePreviewCanvasRef} width={500} height={500} id="canvas"></canvas>
            </div>
        )
    }
}

export default ImgDropZoneAndCrop