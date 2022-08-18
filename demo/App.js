import logo from './logo.svg';
import './App.css';
import ReactArticleComposer from 'react-article-composer';
import React, {useState} from 'react';
import { ChakraProvider, VStack, HStack, Box, Center, Button, Modal, ModalOverlay, ModalHeader, ModalBody, ModalContent, Textarea, Divider } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

function App() {

  let editor = React.createRef();
  const [output, setOutput] = useState('');

  let defaultContent = {
    hasTitle: true,
    titlePlaceholder: "Please enter title",
    paragraphs:[
      {"type":1,"content":"", "placeholder":"Please enter texts"},
      {"type":2}
    ],
  };

  function onPressButton(e)
  {
    setOutput(JSON.stringify(editor.current.getComposition()));
  }

  return (
    <>
    <ChakraProvider resetCSS={true}>

    <div className="App">
      <header className="App-header">
        <Center>react-article-composer</Center>
      </header>
      <div>
        
        <VStack p='1em'>
          <Box w='100%'>
            <ReactArticleComposer 
              editor={editor} 
              defaultContent={defaultContent}
              isSingleFile={false}
              textParagraphPlaceHolder={'Please enter your texts here!'}
            />
          </Box>
          <Box w='100%'>
            <Divider />
          </Box>
          <Box w='100%'>
            <Button colorScheme='green' onClick={onPressButton} width='100%'>Get Composition</Button>
          </Box>
          <Box w='100%'>
            <Textarea
              value={output}
              isReadOnly={true}
              placeholder='Output shows here.'
              size='sm'
              rows='8'
            />
          </Box>
        </VStack>        
      </div>
    </div>    

    </ChakraProvider>
    </>
  );
}

export default App;
