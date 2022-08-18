# About react-article-composer

This is a very simple UI component for composing blog posts or articles like content for ReactJS app. It only supports simply texts and images at the moment but very easy to get started with. 

This module mainly reuses [Chakra UI](https://www.npmjs.com/package/@chakra-ui/react) for React and [ReactImageUploadComponent](https://jakehartnell.github.io/react-images-upload/).

![enter image description here](https://github.com/delanceronline/react-article-composer/blob/main/screenshot/sc.png?raw=true)

## Getting Started

*Install the module to to your React project:*

    npm i react-article-composer

*Import it to the module you are using it:*

    import ReactArticleComposer from 'react-article-composer'

## Usage

Place a `ReactArticleComposer` tag in the position which shows the component for the usage:

    <ReactArticleComposer 
      editor={this.editor} 
      defaultContent={
	      {hasTitle: false,
	      paragraphs:[
	        {"type":1,"content":"", "placeholder":"Please enter texts"},
	      ]}
	  }
      imageURL={'a URL for loading default images'} 
      onTitleUpdate={(originalValue, newValue)=>{}} 
      onTextParagraphUpdate={(previousParagraphs, newParagraphs, index)=>{}}
      onTextParagraphAdd={(previousParagraphs, newParagraphs, index)=>{}}
      onImageParagraphAdd={(previousParagraphs, newParagraphs, index)=>{}}
      onTextParagraphDelete={(previousParagraphs, newParagraphs, index)=>{}}
      onImageParagraphDelete={(previousParagraphs, newParagraphs, index)=>{}}
      onImageAdd={(previousParagraphs, newParagraphs, index)=>{}}
      onImageDelete={(previousParagraphs, newParagraphs, imageIndex, paragraphIndex)=>{}}
      isSingleFile={bool}
    />

> **Note:** There are `UNSAFE_componentWillReceiveProps` warnings showing in the browser's console which is about a soon-be unsupported functions in React being used in [FlipMove](https://www.npmjs.com/package/react-flip-move) and [ReactImageUploadComponent](https://jakehartnell.github.io/react-images-upload/) modules. Under the current React version, it has no impacts on functioning and will have to be solved within the upcoming version of React. We are looking for the updates from these two modules.

## Attributes

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:



|                |Description                          							   |
|----------------|-------------------------------------------------------------|
|`editor`	         |a reference to the component, initialized with `React.createRef()`          |       
|`defaultContent` |preset content object being loaded for initialization, for example,           `{hasTitle: true, paragraphs:[{"type":1,"content":"","placeholder":"Please enter texts"},{"type":2}]}`, it initializes the component with 2 paragraphs, `type` 1 representing a text paragraph with a specific placeholder text by setting `placeholder` property and `type` 2 representing an image paragraph, also with the title input available by setting `hasTitle` to `true`. For an image paragraph, you can preset an image resource by setting an `image` property like this: `{"type":2, image:"flower.png"}`, the base path can be set in `imageURL` attribute below.|
|`imageURL`          |a URL for loading pre-defined images as specified in `defaultConent` attribute.|
|`onTitleUpdate`|an event handler for the title was updated, with format: `(originalValue, newValue)=>{}`.|
|`onTextParagraphUpdate`|an event handler for a paragraph was updated, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where `index` is the paragraph index concerning the update. For example, you can get the previous and current values of the paragraph by accessing `previousParagraphs[index]` and `newParagraphs[index]` respectively.|
|`onTextParagraphAdd`|an event handler for a new text paragraph was added, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where the new text paragraph is `newParagraphs[index]`.|
|`onImageParagraphAdd`|similar to `onTextParagraphAdd`, an event handler for a new image paragraph was added, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where the new image paragraph is `newParagraphs[index]`.|
|`onTextParagraphDelete`|an event hander for a text paragraph was deleted, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where the deleted text paragraph is `previousParagraphs[index]`.|
|`onImageParagraphDelete`|similar to `onTextParagraphDelete`, an event handler for an image paragraph was deleted, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where the deleted image paragraph is `previousParagraphs[index]`.|
|`onImageAdd`|an event handler for an image was added in a file upload widget in a specific image paragraph, with format: `(previousParagraphs, newParagraphs, index)=>{}`, where the related paragraph containing the file upload widget is either `newParagraphs[index]`.|
|`onImageDelete`|an event handler for an image was removed from a file upload widget in a specific image paragraph, with format: `(previousParagraphs, newParagraphs, imageIndex, paragraphIndex)=>{}`, where the deleted image is the `imageIndex` th image of `previousParagraphs[paragraphIndex]`.|
|`isSingleFile`|Represents whether the file upload widget only supports single file selection.|

