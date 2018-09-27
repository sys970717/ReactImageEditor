import React, { Component } from 'react';

class App2 extends Component {
    render() {
        return (
            <div className="imageEditor">
                <header className = 'imageEditor_header'>
                    <h1>Image Editor dev</h1>
                </header>
                <div>
                    <input type="file" name="file_upload" id="file_upload" />
                    <canvas className="canvas" id="canvas"></canvas>
                    <div id="mainApp"></div>
                </div>
            </div>
        );
    }
}

export default App2;