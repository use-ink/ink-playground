import { useState, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps, monaco } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

const teal = '67c6b0';
const lightTeal = '67c6b0';
const white = 'ffffff';
const green = '709950';
const orange = 'ce9178';
const blue = '6298d4';
const lightBlue = '95d9fc';
const yellow = 'dcdd9b';

monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
    // { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
    // { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
    { token: 'comment', foreground: green },
    { token: 'none', foreground: white },
    { token: 'attribute', foreground: white },
    { token: 'builtin_attr', foreground: teal },
    { token: 'parenthesis', foreground: white },
    { token: 'operator', foreground: white },
    { token: 'string_literal', foreground: orange },
    { token: 'comma', foreground: white },
    { token: 'keyword', foreground: blue },
    { token: 'module', foreground: teal },
    { token: 'semicolon', foreground: white },
    { token: 'brace', foreground: white },
    { token: 'struct', foreground: lightTeal },
    { token: 'field', foreground: lightBlue },
    { token: 'colon', foreground: white },
    { token: 'builtin_type', foreground: lightTeal },
    { token: 'function', foreground: yellow },
    { token: 'value_param', foreground: lightTeal },
    { token: 'self_type', foreground: teal },
    { token: 'trait', foreground: teal },
    { token: 'self_keyword', foreground: blue },
    { token: 'logical', foreground: white },
    { token: 'punctuation', foreground: white },
    { token: 'variable', foreground: lightBlue },
    { token: 'unresolved_reference', foreground: blue },
    { token: 'macro', foreground: blue },
    { token: 'bool_literal', foreground: lightBlue },
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
