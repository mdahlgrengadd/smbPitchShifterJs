'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactFileDrop = require('react-file-drop');

var _reactFileDrop2 = _interopRequireDefault(_reactFileDrop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var containerId = '#controls-container';

var loadData = function loadData(input, callback) {

  if (input instanceof File) {
    var reader = new FileReader();
    reader.onload = function () {
      return callback(reader.result); // no error
    }.bind(this);
    reader.readAsArrayBuffer(input);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', input, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
      if (xhr.status === 200) {
        return callback(xhr.response); // no error
      } else {}
    }.bind(this);
    xhr.onerror = function () {};
    xhr.onabort = function () {};
    xhr.send();
  }
};

Module.onRuntimeInitialized = function () {

  var _handleFileDrop = function _handleFileDrop(files, event) {
    console.log(files, event);
    loadData(files[0], function (data) {
      console.log(data);
      var dataView = new Uint8Array(data);
      FS.writeFile("/in.wav", dataView);
      Module.ccall('mainf', null, null);
      var contents = FS.readFile('/out.wav', { encoding: 'binary' });
      var blob = new Blob([contents], { type: "audio/wav" });
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "output.wav";
      a.click();
    });
  };

  var styles = {
    border: "1px solid black",
    color: "black",
    padding: 0
  };

  var myUploader = _react2.default.createElement("div", {
    className: "my-uploader",
    style: styles
  }, _react2.default.createElement("a", { href: "#" }, _react2.default.createElement("img", { src: "http://placehold.it/360x240", alt: "" }), _react2.default.createElement("input", { type: "file", id: "files", name: "files" })), _react2.default.createElement(_reactFileDrop2.default, {
    onDrop: _handleFileDrop,
    frame: document,
    dropEffect: "copy"
  }, "Drop some files here!"));

  _react2.default.render(myUploader, document.getElementById("demo-contents1"));
};