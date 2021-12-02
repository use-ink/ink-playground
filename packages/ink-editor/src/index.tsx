import { useState, ReactElement } from 'react';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import exampleCode from './example-code';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';

export { exampleCode };

export interface InkEditorProps {
  code: string;
  onCodeChange?: (code: string) => void;
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
        await import('./utils/startRustAnalyzer').then(code => code.startRustAnalyzer(model.uri));
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
      theme={props.darkmode ? 'vs-dark' : 'vs'}
      value={code}
      options={options}
      onChange={handleChange}
      editorDidMount={editorDidMount}
    />
  );
};
