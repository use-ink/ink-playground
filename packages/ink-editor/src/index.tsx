import { useState, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps, monaco } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
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
