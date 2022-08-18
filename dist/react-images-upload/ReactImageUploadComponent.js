"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.regexp.test.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.promise.js");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("./index.css");

var _reactFlipMove = _interopRequireDefault(require("react-flip-move"));

var _UploadIcon = _interopRequireDefault(require("./UploadIcon.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};
const ERROR = {
  NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
  FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
};

class ReactImageUploadComponent extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [...props.defaultImages],
      files: [],
      fileErrors: []
    };
    this.inputElement = '';
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({
      pictures: [...this.props.defaultImages],
      files: [],
      fileErrors: []
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.files !== this.state.files) {
      if (this.props.hasOwnProperty('onChange') && typeof this.props.onChange === 'function') this.props.onChange(this.state.files, this.state.pictures);
    }
  }
  /*
   Load image at the beggining if defaultImage prop exists
   */


  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.defaultImages !== this.props.defaultImages) {
      this.setState({
        pictures: nextProps.defaultImages
      });
    }
  }
  /*
   Check file extension (onDropFile)
   */


  hasExtension(fileName) {
    const pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }
  /*
   Handle file validation
   */


  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];
    const fileErrors = []; // Iterate over all uploaded files

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileError = {
        name: file.name
      }; // Check for file extension

      if (!this.hasExtension(file.name)) {
        fileError = Object.assign(fileError, {
          type: ERROR.NOT_SUPPORTED_EXTENSION
        });
        fileErrors.push(fileError);
        continue;
      } // Check for file size


      if (file.size > this.props.maxFileSize) {
        fileError = Object.assign(fileError, {
          type: ERROR.FILESIZE_TOO_LARGE
        });
        fileErrors.push(fileError);
        continue;
      }

      allFilePromises.push(this.readFile(file));
    }

    this.setState({
      fileErrors
    });
    const {
      singleImage
    } = this.props;
    Promise.all(allFilePromises).then(newFilesData => {
      const dataURLs = singleImage ? [] : this.state.pictures.slice();
      const files = singleImage ? [] : this.state.files.slice();
      newFilesData.forEach(newFileData => {
        dataURLs.push(newFileData.dataURL);
        files.push(newFileData.file);
      });
      this.setState({
        pictures: dataURLs,
        files: files
      });
    });
  }

  onUploadClick(e) {
    // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
    e.target.value = null;
  }
  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */


  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Read the image via FileReader API and save image result in state.

      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        dataURL = dataURL.replace(";base64", ";name=".concat(file.name, ";base64"));
        resolve({
          file,
          dataURL
        });
      };

      reader.readAsDataURL(file);
    });
  }
  /*
   Remove the image from state
   */


  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);
    if (this.props.hasOwnProperty('onDelete') && typeof this.props.onDelete === 'function') this.props.onDelete(this.state.files, this.state.pictures, removeIndex);
    this.setState({
      pictures: filteredPictures,
      files: filteredFiles
    }, () => {
      if (this.props.hasOwnProperty('onChange') && typeof this.props.onChange === 'function') this.props.onChange(this.state.files, this.state.pictures);
    });
  }
  /*
   Check if any errors && render
   */


  renderErrors() {
    const {
      fileErrors
    } = this.state;
    return fileErrors.map((fileError, index) => {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: 'errorMessage ' + this.props.errorClass,
        key: index,
        style: this.props.errorStyle
      }, "* ", fileError.name, " ", fileError.type === ERROR.FILESIZE_TOO_LARGE ? this.props.fileSizeError : this.props.fileTypeError);
    });
  }
  /*
   Render the upload icon
   */


  renderIcon() {
    if (this.props.withIcon && !this.props.hasOwnProperty('uploadIconURL')) {
      return /*#__PURE__*/_react.default.createElement("img", {
        src: _UploadIcon.default,
        className: "uploadIcon",
        alt: "Upload Icon"
      });
    } else if (this.props.withIcon && this.props.hasOwnProperty('uploadIconURL')) {
      return /*#__PURE__*/_react.default.createElement("img", {
        src: this.props.uploadIconURL,
        className: "uploadIcon",
        alt: "Upload Icon"
      });
    }
  }
  /*
   Render label
   */


  renderLabel() {
    if (this.props.withLabel) {
      return /*#__PURE__*/_react.default.createElement("p", {
        className: this.props.labelClass,
        style: this.props.labelStyles
      }, this.props.label);
    }
  }
  /*
   Render preview images
   */


  renderPreview() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "uploadPicturesWrapper"
    }, /*#__PURE__*/_react.default.createElement(_reactFlipMove.default, {
      enterAnimation: "fade",
      leaveAnimation: "fade",
      style: styles
    }, this.renderPreviewPictures()));
  }

  renderPreviewPictures() {
    return this.state.pictures.map((picture, index) => {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: index,
        className: "uploadPictureContainer"
      }, !this.props.isDisabled && /*#__PURE__*/_react.default.createElement("div", {
        className: "deleteImage",
        onClick: () => this.removeImage(picture)
      }, "X"), /*#__PURE__*/_react.default.createElement("img", {
        src: picture,
        className: "uploadPicture",
        alt: "preview"
      }));
    });
  }
  /*
   On button click, trigger input file to open
   */


  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({
      pictures: []
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "fileUploader " + this.props.className,
      style: this.props.style
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "fileContainer",
      style: this.props.fileContainerStyle
    }, !this.props.isDisabled && (this.state.pictures.length == 0 || !this.props.singleImage) && this.renderIcon(), !this.props.isDisabled && (this.state.pictures.length == 0 || !this.props.singleImage) && this.renderLabel(), /*#__PURE__*/_react.default.createElement("div", {
      className: "errorsContainer"
    }, this.renderErrors()), !this.props.isDisabled && (this.state.pictures.length == 0 || !this.props.singleImage) && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
      type: this.props.buttonType,
      className: "chooseFileButton " + this.props.buttonClassName,
      style: this.props.buttonStyles,
      onClick: this.triggerFileUpload
    }, this.props.buttonText), /*#__PURE__*/_react.default.createElement("input", {
      type: "file",
      ref: input => this.inputElement = input,
      name: this.props.name,
      multiple: !this.props.singleImage,
      onChange: this.onDropFile,
      onClick: this.onUploadClick,
      accept: this.props.accept,
      style: {
        width: '1px'
      }
    })), this.props.withPreview ? this.renderPreview() : null));
  }

}

_defineProperty(ReactImageUploadComponent, "defaultProps", {
  isDisabled: false
});

ReactImageUploadComponent.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  withPreview: false,
  accept: "image/*",
  name: "",
  withIcon: true,
  buttonText: "Choose images",
  buttonType: "button",
  withLabel: true,
  label: "Maximum file size: 10mb, accepted: jpg|png",
  labelStyles: {},
  labelClass: "",
  imgExtension: ['.jpg', '.jpeg', '.png'],
  maxFileSize: 10485760,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: []
};
ReactImageUploadComponent.propTypes = {
  style: _propTypes.default.object,
  fileContainerStyle: _propTypes.default.object,
  className: _propTypes.default.string,
  onChange: _propTypes.default.func,
  onDelete: _propTypes.default.func,
  buttonClassName: _propTypes.default.string,
  buttonStyles: _propTypes.default.object,
  buttonType: _propTypes.default.string,
  withPreview: _propTypes.default.bool,
  accept: _propTypes.default.string,
  name: _propTypes.default.string,
  withIcon: _propTypes.default.bool,
  buttonText: _propTypes.default.string,
  withLabel: _propTypes.default.bool,
  label: _propTypes.default.string,
  labelStyles: _propTypes.default.object,
  labelClass: _propTypes.default.string,
  imgExtension: _propTypes.default.array,
  maxFileSize: _propTypes.default.number,
  fileSizeError: _propTypes.default.string,
  fileTypeError: _propTypes.default.string,
  errorClass: _propTypes.default.string,
  errorStyle: _propTypes.default.object,
  singleImage: _propTypes.default.bool,
  defaultImages: _propTypes.default.array
};
var _default = ReactImageUploadComponent;
exports.default = _default;