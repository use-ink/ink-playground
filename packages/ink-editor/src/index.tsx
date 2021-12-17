import { useState, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps, monaco } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

const teal = '67c6b0';
const lightTeal = '67c6b0';
const white = 'ffffff';
const darkGray = '4e4e4e';
const green = '709950';
const orange = 'ce9178';
const blue = '6298d4';
const lightBlue = '95d9fc';
const yellow = 'dcdd9b';

const rules = [
  { token: 'comment', foreground: green },
  { token: 'builtin_attr', foreground: teal },
  { token: 'string_literal', foreground: orange },
  { token: 'keyword', foreground: blue },
  { token: 'module', foreground: teal },
  { token: 'struct', foreground: lightTeal },
  { token: 'field', foreground: lightBlue },
  { token: 'builtin_type', foreground: lightTeal },
  { token: 'function', foreground: yellow },
  { token: 'value_param', foreground: lightTeal },
  { token: 'self_type', foreground: teal },
  { token: 'trait', foreground: teal },
  { token: 'self_keyword', foreground: blue },
  { token: 'variable', foreground: lightBlue },
  { token: 'unresolved_reference', foreground: blue },
  { token: 'macro', foreground: blue },
  { token: 'bool_literal', foreground: lightBlue },
];

// Define an extra default theme to set the correct background colors
monaco.editor.defineTheme('default-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1A1D1F',
    'minimap.background': '#1e2124',
  },
});

monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'none', foreground: white },
    { token: 'attribute', foreground: white },
    { token: 'parenthesis', foreground: white },
    { token: 'operator', foreground: white },
    { token: 'comma', foreground: white },
    { token: 'semicolon', foreground: white },
    { token: 'brace', foreground: white },
    { token: 'colon', foreground: white },
    { token: 'logical', foreground: white },
    { token: 'punctuation', foreground: white },
    ...rules,
  ],
  colors: {
    'editor.background': '#1A1D1F',
    'minimap.background': '#1e2124',
  },
});

monaco.editor.defineTheme('custom-light', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'none', foreground: darkGray },
    { token: 'attribute', foreground: darkGray },
    { token: 'parenthesis', foreground: darkGray },
    { token: 'operator', foreground: darkGray },
    { token: 'comma', foreground: darkGray },
    { token: 'semicolon', foreground: darkGray },
    { token: 'brace', foreground: darkGray },
    { token: 'colon', foreground: darkGray },
    { token: 'logical', foreground: darkGray },
    { token: 'punctuation', foreground: darkGray },
    ...rules,
  ],
  colors: {
    'minimap.background': '#f2f2f2',
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
  rustAnalyzer?: boolean;
}

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

  const darkTheme = props.rustAnalyzer ? 'custom-dark' : 'default-dark';
  const lightTheme = props.rustAnalyzer ? 'custom-light' : 'vs';

  return (
    <MonacoEditor
      language="rust"
      theme={props.darkmode ? darkTheme : lightTheme}
      value={code}
      options={options}
      onChange={handleChange}
      editorDidMount={editorDidMount}
    />
  );
};
