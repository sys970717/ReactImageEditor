import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { image64toCanvasRef, downloadBase64File, base64StringtoFile, extractImageFileExtensionFromBase64 } from './ResuableUtils'
import { _handleRotate } from './ImageRotate'

const imageMaxSize = 100000 //bytes
const acceptedFileTypes = 'image/jpeg, image/jpg'
const acceptedFileTypesArray = acceptedFileTypes.split(',').map((item) => { return item.trim() })

class ImgDropZoneAndCrop extends Component {

    constructor(props) {
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.originImgSrc = ''
        this.state = {
            imgSrc: null,
            imgSrcExt:null,
            crop: {
               
            },
            condition : true,
            degrees : 0
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
                const myFileItemReader = new FileReader()
                myFileItemReader.addEventListener('load', () => {
                    // console.log(myFileItemReader.result)
                    const myResult = myFileItemReader.result

                    this.originImgSrc = myResult
                    this.setState({
                        imgSrc: myResult,
                        imgSrcExt : extractImageFileExtensionFromBase64(myResult),
                        disabled: true
                    })
                }, false)

                myFileItemReader.readAsDataURL(currentFile)
            }
        }
    }
    handleImageLoaded = (image) => {
        console.log(image)
    }
    handleChangeCropCondition = (crop) => {
        if(this.state.condition === false) {
            this.setState({ crop: crop, condition : true } )
        } else if(this.state.condition === true) {
            this.setState({crop : '', condition : false})
        }
    }
    handleOnCropChange = (crop) => {
        console.log(crop)
        console.log(this.state)
        this.setState({ crop: crop} )
    }
    handleOnCropComplete = (crop, pixelCrop) => {
        //console.log(crop, pixelCrop)

        const canvasRef = this.imagePreviewCanvasRef.current
        const {imgSrc} = this.state
        image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
    }
    handleDownloadClick = (event) => {
        event.preventDefault()
        const {imgSrc}  = this.state
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current
        
            const {imgSrcExt} =  this.state
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

    handleClearToDefault = event =>{
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                x: 10,
                y: 10,
                width: 80,
                height: 80,
            },
            condition : false

        })
        this.fileInputRef.current.value = null
    }

    handleFileSelect = event => {
        // console.log(event)
        const files = event.target.files
        if (files && files.length > 0){
              const isVerified = this.verifyFile(files)
             if (isVerified){
                 // imageBase64Data 
                 const currentFile = files[0]
                 const myFileItemReader = new FileReader()
                 myFileItemReader.addEventListener("load", ()=>{
                     // console.log(myFileItemReader.result)
                     const myResult = myFileItemReader.result
                     this.setState({
                         imgSrc: myResult,
                         imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                     })
                 }, false)

                 myFileItemReader.readAsDataURL(currentFile)

             }
        }
    }

    handleRotate = (e) => {
        const canvasRef = this.imagePreviewCanvasRef.current
        console.log(canvasRef)
        const {imgSrc} = this.state
        console.log(imgSrc)
        const direction = e.target.textContent.toLowerCase();

        if(direction === 'left') {
            if(imgSrc.degrees <= 360) {
                this.setState({degrees : 90})
            } else {
                this.setState({degrees : imgSrc.degrees+90})
            }
        } else {
            if(imgSrc.degrees === 0) {
                this.setState({degrees : 270})
            } else {
                this.setState({degrees : imgSrc.degrees-90})
            }
        }

        _handleRotate(canvasRef, imgSrc)
    }

    render() {
        const { imgSrc } = this.state

        return (
            <div>
                <h1>Drop and Crop</h1>
                <input ref={this.fileInputRef} type='file' accept={acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} />
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
                        <br/>
                        <p>Preview Canvas Crop</p>
                        <canvas ref={this.imagePreviewCanvasRef}></canvas>
                        <button onClick={this.handleChangeCropCondition}>Crop{this.state.condition}</button>
                        <button onClick={this.handleRotate}>Right</button>
                        <button onClick={this.handleRotate}>Left</button>
                        <button onClick={this.handleDownloadClick}>Download</button>
                        <button onClick={this.handleClearToDefault}>Clear</button>
                    </div>
                    : ''}
                <Dropzone onDrop={this.handleOnDrop} maxSize={imageMaxSize} multiple={false} accept={acceptedFileTypes}> Drop/Click here or to upload here </Dropzone>
            </div>
        )
    }
}

export default ImgDropZoneAndCrop