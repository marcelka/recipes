
import React, {Component} from 'react';
import {imgurClientId} from '../../settings';

export class FileForm extends Component {

  // when a file is passed to the input field, retrieve the contents as a
  // base64-encoded data URI and save it to the component's state
  handleFile(e) {
    // if file was de-selected, do nothing
    if (e.target.files.length === 0) { return; }
    var file = e.target.files[0];
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image', true);
    var formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('description', 'such image!');
    xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientId}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const link = JSON.parse(xhr.response).data.link;
        this.props.onUpload(link);
        console.log('image sent, link:', link);
      }
    };
    xhr.send(formData);
  }

  // return the structure to display and bind the onChange, onSubmit handlers
  render() {
    // since JSX is case sensitive, be sure to use 'encType'
    return (
      <div>
          <input type="file" onChange={::this.handleFile} />
        <img id='output' width="200px" />
      </div>
    );
  }
}
