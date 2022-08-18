"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.assign.js");

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@chakra-ui/react");

var _icons = require("@chakra-ui/icons");

var _fa = require("react-icons/fa");

var _ReactImageUploadComponent = _interopRequireDefault(require("./../react-images-upload/ReactImageUploadComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function injectTodos(Component) {
  const InjectedTodos = function InjectedTodos(props) {
    const blockDeletionAlert = (0, _react2.useDisclosure)();
    return /*#__PURE__*/_react.default.createElement(Component, _extends({}, props, {
      blockDeletionAlert: blockDeletionAlert,
      ref: props.editor
    }));
  };

  return InjectedTodos;
}

class ReactArticleComposer extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      paragraphs: [
        /*
          {type: 1, content: 'Paragraph 1'},
          {type: 1, content: 'Paragraph 2'},
          {type: 2, uploaderIndex: 0, file: null, base64: null}
        */
      ],
      selectedDeletionIndex: -1,
      isEnabled: true
    };
    this.hasTitle = true;
    this.titlePlaceholder = 'Enter title here';
    this.isSingleFile = true;
    this.onTitleUpdate = this.onTitleUpdate.bind(this);
    this.onParagraphUpdate = this.onParagraphUpdate.bind(this);
    this.onUpArrowPress = this.onUpArrowPress.bind(this);
    this.onDownArrowPress = this.onDownArrowPress.bind(this);
    this.onDeleteInput = this.onDeleteInput.bind(this);
    this.onAddTextBlock = this.onAddTextBlock.bind(this);
    this.onAddImageBlock = this.onAddImageBlock.bind(this);
    this.onDropImage = this.onDropImage.bind(this);
    this.onDeleteImage = this.onDeleteImage.bind(this);
    this.getComposition = this.getComposition.bind(this);
    this.setEnabled = this.setEnabled.bind(this);
    this.setDisabled = this.setDisabled.bind(this);
    this.reset = this.reset.bind(this);
    this.initializeDefault = this.initializeDefault.bind(this);
  }

  componentDidMount() {
    this.initializeDefault();
  }

  reset() {
    this.setState({
      title: '',
      paragraphs: [],
      selectedDeletionIndex: -1,
      isEnabled: true
    });
    this.initializeDefault();
  }

  initializeDefault() {
    if (this.props.hasOwnProperty('isSingleFile')) this.isSingleFile = this.props.isSingleFile;

    if (this.props.defaultContent) {
      let content = this.props.defaultContent;
      if (content.hasOwnProperty('title')) this.setState({
        title: content.title
      });
      if (content.hasOwnProperty('hasTitle')) this.hasTitle = content.hasTitle;
      if (content.hasOwnProperty('titlePlaceholder')) this.titlePlaceholder = content.titlePlaceholder;

      if (content.hasOwnProperty('paragraphs') && content.paragraphs.hasOwnProperty('length') && content.paragraphs.length > 0) {
        let paragraphs = [];

        for (let i = 0; i < content.paragraphs.length; i++) {
          let paragraph = content.paragraphs[i];

          if (paragraph.type == 1) {
            if (paragraph.hasOwnProperty('placeholder')) paragraphs.push({
              type: 1,
              content: paragraph.content,
              placeholder: paragraph.placeholder
            });else paragraphs.push({
              type: 1,
              content: paragraph.content,
              placeholder: 'Enter texts here'
            });
          } else if (paragraph.type == 2) {
            if (paragraph.image) paragraphs.push({
              type: 2,
              image: paragraph.image,
              file: null,
              base64: null
            });else paragraphs.push({
              type: 2,
              file: null,
              base64: null,
              defaultImages: []
            });
          }
        }

        this.setState({
          paragraphs: paragraphs
        });
      }
    }
  }

  getComposition() {
    return {
      title: this.state.title,
      paragraphs: this.state.paragraphs
    };
  }

  setEnabled() {
    this.setState({
      isEnabled: true
    });
  }

  setDisabled() {
    this.setState({
      isEnabled: false
    });
  }

  onTitleUpdate(textValue) {
    if (this.props.onTitleUpdate) this.props.onTitleUpdate(this.state.title, textValue);
    this.setState({
      title: textValue
    });
  }

  onParagraphUpdate(index, textValue) {
    let paragraphs = [...this.state.paragraphs];

    let paragraph = _objectSpread({}, paragraphs[index]);

    paragraph.content = textValue;
    paragraphs[index] = paragraph;
    if (this.props.hasOwnProperty('onTextParagraphUpdate') && typeof this.props.onTextParagraphUpdate === 'function') this.props.onTextParagraphUpdate(this.state.paragraphs, paragraphs, index);
    this.setState({
      paragraphs: paragraphs
    });
  }

  onAddTextBlock(index) {
    let paragraphs = [...this.state.paragraphs];
    let newItem = {
      type: 1,
      content: ''
    };
    paragraphs.splice(index + 1, 0, newItem);
    if (this.props.hasOwnProperty('onTextParagraphAdd') && typeof this.props.onTextParagraphAdd === 'function') this.props.onTextParagraphAdd(this.state.paragraphs, paragraphs, index + 1);
    this.setState({
      paragraphs: paragraphs
    });
  }

  onAddImageBlock(index) {
    let paragraphs = [...this.state.paragraphs];
    let newItem = {
      type: 2,
      file: null,
      base64: null,
      defaultImages: []
    };
    paragraphs.splice(index + 1, 0, newItem);
    if (this.props.hasOwnProperty('onImageParagraphAdd') && typeof this.props.onImageParagraphAdd === 'function') this.props.onImageParagraphAdd(this.state.paragraphs, paragraphs, index + 1);
    this.setState({
      paragraphs: paragraphs
    });
  }

  onUpArrowPress(index) {
    if (index > 0) {
      let paragraphs = [...this.state.paragraphs];

      let current = _objectSpread({}, paragraphs[index]);

      let upperOne = _objectSpread({}, paragraphs[index - 1]);

      paragraphs[index] = upperOne;
      paragraphs[index - 1] = current;
      this.setState({
        paragraphs: paragraphs
      });
    }
  }

  onDownArrowPress(index) {
    if (index < this.state.paragraphs.length - 1) {
      let paragraphs = [...this.state.paragraphs];

      let current = _objectSpread({}, paragraphs[index]);

      let lowerOne = _objectSpread({}, paragraphs[index + 1]);

      paragraphs[index] = lowerOne;
      paragraphs[index + 1] = current;
      this.setState({
        paragraphs: paragraphs
      });
    }
  }

  onOpenDeletionAlert(index) {
    this.setState({
      selectedDeletionIndex: index
    });
    this.props.blockDeletionAlert.onOpen();
  }

  onDeleteInput() {
    let paragraphs = [...this.state.paragraphs];
    paragraphs.splice(this.state.selectedDeletionIndex, 1);
    let paragraph = this.state.paragraphs[this.state.selectedDeletionIndex];

    if (paragraph.type == 1) {
      if (this.props.hasOwnProperty('onTextParagraphDelete') && typeof this.props.onTextParagraphDelete === 'function') this.props.onTextParagraphDelete(this.state.paragraphs, paragraphs, this.state.selectedDeletionIndex);
    } else if (paragraph.type == 2) {
      if (this.props.hasOwnProperty('onImageParagraphDelete') && typeof this.props.onImageParagraphDelete === 'function') this.props.onImageParagraphDelete(this.state.paragraphs, paragraphs, this.state.selectedDeletionIndex);
    }

    this.setState({
      paragraphs: paragraphs
    });
    this.setState({
      selectedDeletionIndex: -1
    });
    this.props.blockDeletionAlert.onClose();
  }

  onDropImage(index, pictureFiles, pictureDataURLs) {
    let fileData = null;
    let base64Data = null;
    let defaultImages = [];
    let fileDataSet = [];
    let base64DataSet = [];

    if (pictureFiles.length > 0) {
      if (pictureFiles.length == 1) fileData = pictureFiles[0];else {
        for (let i = 0; i < pictureFiles.length; i++) fileDataSet.push(pictureFiles[i]);
      }
    }

    if (pictureDataURLs.length > 0) {
      if (pictureDataURLs.length == 1) {
        base64Data = pictureDataURLs[0];
        defaultImages.push(base64Data);
      } else {
        for (let i = 0; i < pictureFiles.length; i++) {
          base64DataSet.push(pictureDataURLs[i]);
          defaultImages.push(pictureDataURLs[i]);
        }
      }
    }

    let paragraphs = [...this.state.paragraphs];

    let current = _objectSpread({}, paragraphs[index]);

    current.file = fileData;
    current.base64 = base64Data;
    current.defaultImages = defaultImages;
    if (fileDataSet.length > 0) current.fileDataSet = fileDataSet;
    if (base64DataSet.length > 0) current.base64DataSet = base64DataSet;
    paragraphs[index] = current;
    if (this.props.hasOwnProperty('onImageAdd') && typeof this.props.onImageAdd === 'function') this.props.onImageAdd(this.state.paragraphs, paragraphs, index);
    this.setState({
      paragraphs: paragraphs
    });
  }

  onDeleteImage(paragraphIndex, imageIndex) {
    let paragraphs = [...this.state.paragraphs];

    let current = _objectSpread({}, paragraphs[paragraphIndex]);

    current.defaultImages.splice(imageIndex, 1);
    current.fileDataSet.splice(imageIndex, 1);
    current.base64DataSet.splice(imageIndex, 1);
    this.setState({
      paragraphs: paragraphs
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_react2.ChakraProvider, {
      resetCSS: true
    }, this.hasTitle && /*#__PURE__*/_react.default.createElement(_react2.Box, {
      borderWidth: "1px",
      borderRadius: "lg",
      style: {
        marginBottom: '1rem'
      }
    }, /*#__PURE__*/_react.default.createElement(_react2.VStack, {
      divider: /*#__PURE__*/_react.default.createElement(_react2.StackDivider, {
        borderColor: "gray.200"
      }),
      spacing: 1,
      align: "stretch"
    }, /*#__PURE__*/_react.default.createElement(_react2.Box, {
      p: "4"
    }, /*#__PURE__*/_react.default.createElement(_react2.Editable, {
      defaultValue: "",
      placeholder: this.titlePlaceholder,
      value: this.state.title,
      onChange: this.onTitleUpdate
    }, /*#__PURE__*/_react.default.createElement(_react2.EditablePreview, null), /*#__PURE__*/_react.default.createElement(_react2.EditableInput, null))))), /*#__PURE__*/_react.default.createElement(_react2.Box, {
      style: {
        marginBottom: '1rem'
      }
    }, /*#__PURE__*/_react.default.createElement(_react2.Text, {
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_react2.Button, {
      colorScheme: "gray",
      style: {
        marginRight: '1em'
      },
      onClick: () => {
        this.onAddImageBlock(-1);
      },
      isDisabled: !this.state.isEnabled
    }, /*#__PURE__*/_react.default.createElement(_fa.FaRegPlusSquare, {
      style: {
        marginRight: '0.4em'
      }
    }), /*#__PURE__*/_react.default.createElement(_fa.FaImage, null)), /*#__PURE__*/_react.default.createElement(_react2.Button, {
      colorScheme: "gray",
      onClick: () => {
        this.onAddTextBlock(-1);
      },
      isDisabled: !this.state.isEnabled
    }, /*#__PURE__*/_react.default.createElement(_fa.FaRegPlusSquare, {
      style: {
        marginRight: '0.4em'
      }
    }), /*#__PURE__*/_react.default.createElement(_fa.FaFont, null)))), this.state.paragraphs.map((paragraph, index) => /*#__PURE__*/_react.default.createElement("div", {
      key: index
    }, /*#__PURE__*/_react.default.createElement(_react2.Box, {
      borderWidth: "1px",
      borderRadius: "lg",
      style: {
        marginBottom: '1rem'
      }
    }, /*#__PURE__*/_react.default.createElement(_react2.VStack, {
      divider: /*#__PURE__*/_react.default.createElement(_react2.StackDivider, {
        borderColor: "gray.200"
      }),
      spacing: 1,
      align: "stretch"
    }, /*#__PURE__*/_react.default.createElement(_react2.Box, {
      p: "4"
    }, /*#__PURE__*/_react.default.createElement(_react2.Flex, null, /*#__PURE__*/_react.default.createElement(_react2.Text, {
      align: "left",
      w: "50%"
    }, /*#__PURE__*/_react.default.createElement(_react2.IconButton, {
      icon: /*#__PURE__*/_react.default.createElement(_fa.FaChevronUp, null),
      colorScheme: "blue",
      style: {
        marginRight: '1em'
      },
      isDisabled: index == 0 || !this.state.isEnabled,
      onClick: e => {
        this.onUpArrowPress(index);
      }
    }), /*#__PURE__*/_react.default.createElement(_react2.IconButton, {
      icon: /*#__PURE__*/_react.default.createElement(_fa.FaChevronDown, null),
      colorScheme: "blue",
      isDisabled: index == this.state.paragraphs.length - 1 || !this.state.isEnabled,
      onClick: e => {
        this.onDownArrowPress(index);
      }
    })), /*#__PURE__*/_react.default.createElement(_react2.Text, {
      align: "right",
      w: "50%"
    }, /*#__PURE__*/_react.default.createElement(_react2.IconButton, {
      icon: /*#__PURE__*/_react.default.createElement(_icons.DeleteIcon, null),
      colorScheme: "red",
      variant: "outline",
      onClick: () => {
        this.onOpenDeletionAlert(index);
      },
      isDisabled: !this.state.isEnabled
    })))), /*#__PURE__*/_react.default.createElement(_react2.Box, {
      p: "4"
    }, paragraph.type == 1 && /*#__PURE__*/_react.default.createElement(_react2.Editable, {
      defaultValue: "",
      placeholder: paragraph.placeholder,
      value: paragraph.content,
      onChange: textValue => {
        this.onParagraphUpdate(index, textValue);
      },
      isDisabled: !this.state.isEnabled
    }, /*#__PURE__*/_react.default.createElement(_react2.EditablePreview, {
      style: {
        whiteSpace: 'pre-line'
      }
    }), /*#__PURE__*/_react.default.createElement(_react2.EditableTextarea, {
      rows: "8"
    })), paragraph.type == 2 && paragraph.defaultImages && /*#__PURE__*/_react.default.createElement(_ReactImageUploadComponent.default, {
      withIcon: true,
      buttonText: "Choose images",
      onChange: (pictureFiles, pictureDataURLs) => {
        this.onDropImage(index, pictureFiles, pictureDataURLs);
      },
      onDelete: (files, pictures, removeIndex) => {
        this.onDeleteImage(index, removeIndex);
        if (this.props.hasOwnProperty('onImageDelete') && typeof this.props.onImageDelete === 'function') this.props.onImageDelete(files, pictures, removeIndex);
      },
      imgExtension: ['.jpeg', '.jpg', '.png'],
      maxFileSize: 10485760,
      withPreview: true,
      singleImage: this.isSingleFile,
      buttonText: 'Choose your image(s)',
      defaultImages: paragraph.defaultImages,
      isDisabled: !this.state.isEnabled
    }), paragraph.type == 2 && paragraph.image && /*#__PURE__*/_react.default.createElement(_react2.Center, null, /*#__PURE__*/_react.default.createElement(_react2.Text, null, /*#__PURE__*/_react.default.createElement("img", {
      src: this.props.imageURL + paragraph.image
    })))))), /*#__PURE__*/_react.default.createElement(_react2.Box, {
      style: {
        marginBottom: '1rem'
      }
    }, /*#__PURE__*/_react.default.createElement(_react2.Text, {
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_react2.Button, {
      colorScheme: "gray",
      style: {
        marginRight: '1em'
      },
      onClick: () => {
        this.onAddImageBlock(index);
      },
      isDisabled: !this.state.isEnabled
    }, /*#__PURE__*/_react.default.createElement(_fa.FaRegPlusSquare, {
      style: {
        marginRight: '0.4em'
      }
    }), /*#__PURE__*/_react.default.createElement(_fa.FaImage, null)), /*#__PURE__*/_react.default.createElement(_react2.Button, {
      colorScheme: "gray",
      onClick: () => {
        this.onAddTextBlock(index);
      },
      isDisabled: !this.state.isEnabled
    }, /*#__PURE__*/_react.default.createElement(_fa.FaRegPlusSquare, {
      style: {
        marginRight: '0.4em'
      }
    }), /*#__PURE__*/_react.default.createElement(_fa.FaFont, null)))))), /*#__PURE__*/_react.default.createElement(_react2.AlertDialog, {
      isOpen: this.props.blockDeletionAlert.isOpen,
      onClose: this.props.blockDeletionAlert.onClose
    }, /*#__PURE__*/_react.default.createElement(_react2.AlertDialogOverlay, null, /*#__PURE__*/_react.default.createElement(_react2.AlertDialogContent, null, /*#__PURE__*/_react.default.createElement(_react2.AlertDialogHeader, {
      fontSize: "lg",
      fontWeight: "bold"
    }, "Deletion Confirmation"), /*#__PURE__*/_react.default.createElement(_react2.AlertDialogBody, null, "Confirm Deletion\uFF1F"), /*#__PURE__*/_react.default.createElement(_react2.AlertDialogFooter, null, /*#__PURE__*/_react.default.createElement(_react2.Button, {
      onClick: this.props.blockDeletionAlert.onClose
    }, "Cancel"), /*#__PURE__*/_react.default.createElement(_react2.Button, {
      colorScheme: "red",
      onClick: this.onDeleteInput,
      ml: 3
    }, "Confirm")))))));
  }

}

var _default = injectTodos(ReactArticleComposer);

exports.default = _default;