import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RedP from './components/RedP'
import App from './App';
import ImageUpload from './components/ImageUpload';
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<RedP>Hello World</RedP>, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('header'));
ReactDOM.render(<ImageUpload/>, document.getElementById("text_editor"));


registerServiceWorker();
