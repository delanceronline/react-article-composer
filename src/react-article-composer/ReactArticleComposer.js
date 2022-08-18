import React from 'react';

import {
  Button,
  Grid, 
  GridItem,
  Flex,
  Box,
  Center,
  Text,
  Input,
  Stack,
  HStack,
  VStack,
  StackDivider,
  Textarea,
  InputGroup,
  InputLeftElement,
  Heading,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  IconButton,
  CloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  useDisclosure,
  ChakraProvider
} from '@chakra-ui/react';

import {
  AddIcon,
  HamburgerIcon,
  DeleteIcon
} from '@chakra-ui/icons';

import { FaFont, FaImage, FaRegPlusSquare, FaTimesCircle, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import ReactImageUploadComponent from './../react-images-upload/ReactImageUploadComponent';

function injectTodos(Component) {
  const InjectedTodos = function (props) {
    
    const blockDeletionAlert = useDisclosure();

    return <Component {...props} blockDeletionAlert={blockDeletionAlert} ref={props.editor} />;
  };
  return InjectedTodos;
}

class ReactArticleComposer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      paragraphs:[
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

  componentDidMount()
  {
    this.initializeDefault();
  }

  reset()
  {
    this.setState({
      title: '',
      paragraphs:[],
      selectedDeletionIndex: -1,
      isEnabled: true      
    });

    this.initializeDefault();
  }

  initializeDefault()
  {
    if(this.props.hasOwnProperty('isSingleFile'))
      this.isSingleFile = this.props.isSingleFile;

    if(this.props.defaultContent)
    {
      let content = this.props.defaultContent;

      if(content.hasOwnProperty('title'))
        this.setState({title: content.title});

      if(content.hasOwnProperty('hasTitle'))
        this.hasTitle = content.hasTitle;      

      if(content.hasOwnProperty('titlePlaceholder'))
        this.titlePlaceholder = content.titlePlaceholder;

      if(content.hasOwnProperty('paragraphs') && content.paragraphs.hasOwnProperty('length') && content.paragraphs.length > 0)
      {
        let paragraphs = [];      
        for(let i = 0; i < content.paragraphs.length; i++)
        {
          let paragraph = content.paragraphs[i];
          if(paragraph.type == 1)
          {
            if(paragraph.hasOwnProperty('placeholder'))
              paragraphs.push({type: 1, content: paragraph.content, placeholder: paragraph.placeholder});  
            else
              paragraphs.push({type: 1, content: paragraph.content, placeholder: 'Enter texts here'});
          }
          else if(paragraph.type == 2)
          {
            if(paragraph.image)
              paragraphs.push({type: 2, image: paragraph.image, file: null, base64: null, defaultImages: []});
            else
              paragraphs.push({type: 2, file: null, base64: null, defaultImages: []});
          }
        }
        this.setState({paragraphs: paragraphs});        
      }
    }
  }

  getComposition()
  {
    return {title: this.state.title, paragraphs: this.state.paragraphs};
  }

  setEnabled()
  {
    this.setState({isEnabled: true});
  }

  setDisabled()
  {
    this.setState({isEnabled: false});
  }

  onTitleUpdate(textValue)
  {
    if(this.props.hasOwnProperty('onTitleUpdate') && typeof this.props.onTitleUpdate === 'function')
      this.props.onTitleUpdate(this.state.title, textValue);

    this.setState({title: textValue});    
  }

  onParagraphUpdate(index, textValue)
  {
    let paragraphs = [...this.state.paragraphs];
    let paragraph = {...paragraphs[index]};
    paragraph.content = textValue;
    paragraphs[index] = paragraph;

    if(this.props.hasOwnProperty('onTextParagraphUpdate') && typeof this.props.onTextParagraphUpdate === 'function')
      this.props.onTextParagraphUpdate(this.state.paragraphs, paragraphs, index);

    this.setState({paragraphs: paragraphs});
  }

  onAddTextBlock(index)
  {
    let paragraphs = [...this.state.paragraphs];
    let newItem = {
      type: 1, 
      content: ''
    };
    paragraphs.splice(index + 1, 0, newItem);

    if(this.props.hasOwnProperty('onTextParagraphAdd') && typeof this.props.onTextParagraphAdd === 'function')
        this.props.onTextParagraphAdd(this.state.paragraphs, paragraphs, index + 1);

    this.setState({paragraphs: paragraphs}); 
  }

  onAddImageBlock(index)
  {
    let paragraphs = [...this.state.paragraphs];
    let newItem = {
      type: 2, 
      file: null, 
      base64: null,
      defaultImages: [],
      fileDataSet: [],
      base64DataSet: []
    };
    paragraphs.splice(index + 1, 0, newItem);

    if(this.props.hasOwnProperty('onImageParagraphAdd') && typeof this.props.onImageParagraphAdd === 'function')
        this.props.onImageParagraphAdd(this.state.paragraphs, paragraphs, index + 1);

    this.setState({paragraphs: paragraphs}); 
  }

  onUpArrowPress(index)
  {
    if(index > 0)
    {
      let paragraphs = [...this.state.paragraphs];
      let current = {...paragraphs[index]};
      let upperOne = {...paragraphs[index - 1]}
      paragraphs[index] = upperOne;
      paragraphs[index - 1] = current;
      this.setState({paragraphs: paragraphs});
    }
  }

  onDownArrowPress(index)
  {
    if(index < this.state.paragraphs.length - 1)
    {
      let paragraphs = [...this.state.paragraphs];
      let current = {...paragraphs[index]};
      let lowerOne = {...paragraphs[index + 1]}
      paragraphs[index] = lowerOne;
      paragraphs[index + 1] = current;
      this.setState({paragraphs: paragraphs});
    }
  }

  onOpenDeletionAlert(index)
  {
    this.setState({selectedDeletionIndex: index});
    this.props.blockDeletionAlert.onOpen();
  }

  onDeleteInput()
  {
    let paragraphs = [...this.state.paragraphs];
    paragraphs.splice(this.state.selectedDeletionIndex, 1);

    let paragraph = this.state.paragraphs[this.state.selectedDeletionIndex];
    if(paragraph.type == 1)
    {
      if(this.props.hasOwnProperty('onTextParagraphDelete') && typeof this.props.onTextParagraphDelete === 'function')
        this.props.onTextParagraphDelete(this.state.paragraphs, paragraphs, this.state.selectedDeletionIndex);
    }
    else if(paragraph.type == 2)
    {
      if(this.props.hasOwnProperty('onImageParagraphDelete') && typeof this.props.onImageParagraphDelete === 'function')
        this.props.onImageParagraphDelete(this.state.paragraphs, paragraphs, this.state.selectedDeletionIndex);      
    }

    this.setState({paragraphs: paragraphs});

    this.setState({selectedDeletionIndex: -1});
    this.props.blockDeletionAlert.onClose();
  }

  onDropImage(index, pictureFiles, pictureDataURLs) {
    
    let fileData = null;
    let base64Data = null;
    let defaultImages = [];
    let fileDataSet = [];
    let base64DataSet = [];

    if(pictureFiles.length > 0)
    {
      if(pictureFiles.length == 1)
        fileData = pictureFiles[0];
      else
      {
        for(let i = 0; i < pictureFiles.length; i++)
          fileDataSet.push(pictureFiles[i]);
      }
    }

    if(pictureDataURLs.length > 0)
    {
      if(pictureDataURLs.length == 1)
      {
        base64Data = pictureDataURLs[0];
        defaultImages.push(base64Data);         
      }
      else
      {
        for(let i = 0; i < pictureFiles.length; i++)
        {
          base64DataSet.push(pictureDataURLs[i]);
          defaultImages.push(pictureDataURLs[i]); 
        }
      }
    }

    let paragraphs = [...this.state.paragraphs];
    let current = {...paragraphs[index]};
    current.file = fileData;
    current.base64 = base64Data;    
    current.defaultImages = defaultImages;

    if(fileDataSet.length > 0)
      current.fileDataSet = fileDataSet;

    if(base64DataSet.length > 0)
      current.base64DataSet = base64DataSet;

    paragraphs[index] = current;

    if(this.props.hasOwnProperty('onImageAdd') && typeof this.props.onImageAdd === 'function')
        this.props.onImageAdd(this.state.paragraphs, paragraphs, index);

    this.setState({paragraphs: paragraphs});
  }

  onDeleteImage(paragraphIndex, imageIndex)
  {
    let paragraphs = [...this.state.paragraphs];
    let current = {...paragraphs[paragraphIndex]};

    if(current.defaultImages.length > 0)
      current.defaultImages.splice(imageIndex, 1);

    if(current.fileDataSet.length > 0)
      current.fileDataSet.splice(imageIndex, 1);

    if(current.base64DataSet.length > 0)
      current.base64DataSet.splice(imageIndex, 1);

    if(this.props.hasOwnProperty('onImageDelete') && typeof this.props.onImageDelete === 'function')
      this.props.onImageDelete(this.state.paragraphs, paragraphs, imageIndex, paragraphIndex);

    this.setState({paragraphs: paragraphs});
  }

  render() {
    return (
      <React.Fragment>
        <ChakraProvider resetCSS={true}>

        {this.hasTitle &&
        <Box borderWidth='1px' borderRadius='lg' style={{marginBottom: '1rem'}}>

          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={1}
            align='stretch'
          >

            <Box p='4'>

              <Editable defaultValue='' placeholder={this.titlePlaceholder} value={this.state.title} onChange={this.onTitleUpdate}>
                <EditablePreview />
                <EditableInput />
              </Editable>

            </Box>  
            
          </VStack>

        </Box>
        }

        <Box style={{marginBottom: '1rem'}}>

          <Text align='center'>
            <Button colorScheme='gray' style={{marginRight: '1em'}} onClick={()=>{this.onAddImageBlock(-1)}} isDisabled={!this.state.isEnabled}><FaRegPlusSquare style={{marginRight: '0.4em'}} /><FaImage /></Button>
            <Button colorScheme='gray' onClick={()=>{this.onAddTextBlock(-1)}} isDisabled={!this.state.isEnabled}><FaRegPlusSquare style={{marginRight: '0.4em'}} /><FaFont /></Button>
          </Text>

        </Box>

        {
          this.state.paragraphs.map( (paragraph, index) =>

            <div key={index}>

            <Box borderWidth='1px' borderRadius='lg' style={{marginBottom: '1rem'}}>

              <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={1}
                align='stretch'
              >

                <Box p='4'>
                  <Flex>

                    <Text align='left' w='50%'>
                      <IconButton icon={<FaChevronUp />} colorScheme='blue' style={{marginRight: '1em'}} isDisabled={index == 0 || !this.state.isEnabled} onClick={(e)=>{this.onUpArrowPress(index)}} />
                      <IconButton icon={<FaChevronDown />} colorScheme='blue' isDisabled={index == this.state.paragraphs.length - 1 || !this.state.isEnabled} onClick={(e)=>{this.onDownArrowPress(index)}} />
                    </Text>

                    <Text align='right' w='50%'>
                      <IconButton icon={<DeleteIcon />} colorScheme='red' variant='outline' onClick={()=>{this.onOpenDeletionAlert(index)}} isDisabled={!this.state.isEnabled} />
                    </Text>

                  </Flex>
                </Box>

                
                <Box p='4'>

                  {paragraph.type == 1 &&
                  <Editable defaultValue='' placeholder={paragraph.placeholder} value={paragraph.content} onChange={(textValue)=>{this.onParagraphUpdate(index, textValue)}} isDisabled={!this.state.isEnabled}>
                    <EditablePreview style={{whiteSpace: 'pre-line'}} />
                    <EditableTextarea rows='8' />
                  </Editable>
                  }

                  {paragraph.type == 2 && paragraph.defaultImages &&
                  <ReactImageUploadComponent
                    withIcon={true}
                    buttonText='Choose images'
                    onChange={(pictureFiles, pictureDataURLs)=>{
                      this.onDropImage(index, pictureFiles, pictureDataURLs)
                    }}
                    onDelete={(files, pictures, removeIndex)=>{

                      this.onDeleteImage(index, removeIndex);

                    }}
                    imgExtension={['.jpeg', '.jpg', '.png']}
                    maxFileSize={10485760}
                    withPreview={true}
                    singleImage={this.isSingleFile}                    
                    buttonText={'Choose your image(s)'}
                    defaultImages={paragraph.defaultImages}
                    isDisabled={!this.state.isEnabled}
                  />
                  }

                  {paragraph.type == 2 && paragraph.image &&
                    <Center><Text><img src={this.props.imageURL + paragraph.image} /></Text></Center>
                  }

                </Box>                                

              </VStack>

            </Box>

            <Box style={{marginBottom: '1rem'}}>

              <Text align='center'>
                <Button colorScheme='gray' style={{marginRight: '1em'}} onClick={()=>{this.onAddImageBlock(index)}} isDisabled={!this.state.isEnabled}><FaRegPlusSquare style={{marginRight: '0.4em'}} /><FaImage /></Button>
                <Button colorScheme='gray' onClick={()=>{this.onAddTextBlock(index)}} isDisabled={!this.state.isEnabled}><FaRegPlusSquare style={{marginRight: '0.4em'}} /><FaFont /></Button>
              </Text>

            </Box>

            </div>

          )
        }

        <AlertDialog
          isOpen={this.props.blockDeletionAlert.isOpen}
          onClose={this.props.blockDeletionAlert.onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Deletion Confirmation
              </AlertDialogHeader>

              <AlertDialogBody>
                Confirm Deletion？
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button 
                onClick={this.props.blockDeletionAlert.onClose}
                >
                  Cancel
                </Button>
                <Button colorScheme='red' 
                onClick={this.onDeleteInput} 
                ml={3}>
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        </ChakraProvider>
      </React.Fragment>
    )
  }
}

export default injectTodos(ReactArticleComposer);