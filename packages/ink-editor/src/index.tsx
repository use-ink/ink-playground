import { useState, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps, monaco } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
    // { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
    // { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
    { token: 'builtin_type', foreground: '54b0b0' },
  ],
  colors: {
    'editor.background': '#1A1D1F',
    'minimap.background': '#1e2124',
  },
});

export { exampleCode };

export interface InkEditorProps {
  code: string;
  onCodeChange?: (code: string) => void;
  onRustAnalyzerStartLoad?: () => void;
  onRustAnalyzerFinishLoad?: () => void;
  setURI?: (uri: Uri) => void;
  numbering?: boolean;
  minimap?: boolean;
  darkmode?: boolean;
}

/*
comment
none
attribute
builtin_attr
parenthesis
operator
string_literal
comma
keyword
module
semicolon
brace
struct
field
colon
builtin_type
function
value_param
self_type
trait
self_keyword
logical
punctuation
variable
unresolved_reference
macro
bool_literal
*/

export const InkEditor = (props: InkEditorProps): ReactElement => {
  const [code, setCode] = useState(exampleCode);

  const handleChange = (newValue: string): void => {
    setCode(newValue);
  };

  const editorDidMount = async (editor: MonacoEditor['editor']): Promise<void> => {
    if (editor) {
      editor.focus();
      const model = editor.getModel();
      if (model) {
        props.setURI && props.setURI(model.uri);
        await import('./utils/startRustAnalyzer').then(async code => {
          props.onRustAnalyzerStartLoad && props.onRustAnalyzerStartLoad();
          await code.startRustAnalyzer(model.uri);
          props.onRustAnalyzerFinishLoad && props.onRustAnalyzerFinishLoad();
        });
      }
    }
  };

  const options: MonacoEditorProps['options'] = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: props.minimap },
    lineNumbers: props.numbering ? 'on' : 'off',
  };

  return (
    <MonacoEditor
      language="rust"
      theme={props.darkmode ? 'custom-dark' : 'vs'}
      value={code}
      options={options}
      onChange={handleChange}
      editorDidMount={editorDidMount}
    />
  );
};
