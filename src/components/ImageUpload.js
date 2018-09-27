import React, { Component } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            imagePreviewUrl: '',
            event : {
                name : '',
                crop : {
                    x : 0,
                    y : 0,
                    width : 0,
                    height : 0
                }
            },
        };
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext("2d");

        reader.onload = () => {
            var imageIO = new Image();
            imageIO.onload = () => {
                if (imageIO.width > 500) {
                    imageIO.height *= 500 / imageIO.width;
                    imageIO.width = 500;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = imageIO.width;
                canvas.height = imageIO.height;
                ctx.drawImage(imageIO, canvas.clientTop, canvas.clientLeft, imageIO.width, imageIO.height);
            };
            imageIO.src = reader.result;

            this.setState({
                file: file,
                imagePreviewUrl: reader.result,
            });
        }
        reader.readAsDataURL(file);
    }

    _handleEditorEvent(e) {
        e.preventDefault();
        this.setState({
            event : {
                name : e.target.textContent.toLowerCase()
            }
        });
    }

    onImageLoaded = image => {
        console.log('onCropComplete', image)
    }

    onCropComplete = crop => {
        console.log('onCropComplete', crop)
    }

    onCropChange = crop => {
        this.setState({ event : { crop : { x: 10, y:10, width: 80, height : 80} } });
    }

    render() {
        console.log(this.state.event.name);
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        let $imageEvent = this.state.event.name;
        let $cropBoxPosition = '';
        if (imagePreviewUrl) {

        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        if($imageEvent === '') {

        } else if($imageEvent === 'crop') {
            $cropBoxPosition = 
            <div className="cropComponent" >
                    {this.state.imagePreviewUrl && (
                        <ReactCrop
                            src={this.state.imagePreviewUrl}
                            crop={this.state.event.crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                        />
                    )}
                </div>;
        }

        console.log('eventName = '+ $imageEvent);

        return (
            <div className="imageComponent">
            <button onClick={(e) => this._handleEditorEvent(e)}>Crop</button>
                <div className="previewComponent">
                    <form onSubmit={(e) => this._handleSubmit(e)}>
                        <input className="fileInput"
                            type="file"
                            onChange={(e) => this._handleImageChange(e)} />
                        <button className="submitButton"
                            type="submit"
                            onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
                    </form>
                    <div className="imgPreview">
                        <canvas id="canvas" width="500" />
                        {$imagePreview}
                    </div>
                </div>

                {$cropBoxPosition}

                
            </div>
        )
    }
}

export default ImageUpload;