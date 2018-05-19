import React from 'react';
import ReactDOM from 'react-dom';
import FileDrop from 'react-file-drop';

var containerId = '#controls-container';

var loadData = function(input, callback) {

  if (input instanceof File) {
    var reader = new FileReader();
    reader.onload = function() {
      return callback(reader.result); // no error
    }.bind(this);
    reader.readAsArrayBuffer(input);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', input, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (xhr.status === 200) {
        return callback(xhr.response); // no error
      } else {
 
      }
    }.bind(this);
    xhr.onerror = function() {
 
    };
    xhr.onabort = function() {
 
    };
    xhr.send();
  }
}



Module.onRuntimeInitialized = function() {

    var _handleFileDrop = function(files, event) {
        console.log(files, event);
        loadData(files[0], function(data){
          console.log(data);
          var dataView = new Uint8Array(data)
          FS.writeFile("/in.wav", dataView);
          Module.ccall('mainf',null,null);
          var contents = FS.readFile('/out.wav', { encoding: 'binary' });
          var blob = new Blob([contents], {type: "audio/wav"});
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          var  url = window.URL.createObjectURL(blob);
          a.href = url
          a.download = "output.wav"
          a.click()
          
        });
      };
    

    var styles = {
        border: "1px solid black",
        color: "black",
        padding: 0
    };

    var myUploader = React.createElement(
        "div", {
            className: "my-uploader",
            style: styles
        },
          React.createElement(
    "a",
    { href: "#" },
    React.createElement("img", { src: "http://placehold.it/360x240", alt: "" }),
    React.createElement("input", { type: "file", id: "files", name: "files" })
  ),
        React.createElement(
            FileDrop, {
                onDrop: _handleFileDrop,
                frame: document,
                dropEffect: "copy"
            },
            "Drop some files here!"
        )
    );

    ReactDOM.render(myUploader, document.getElementById("demo-contents1"))

};