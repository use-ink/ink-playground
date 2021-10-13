import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import exampleCode from './example-code';

export const Editor = () => {
  const [code, setCode] = useState(exampleCode);
  const [isDark, setIsDark] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showNumbering, setShowNumbering] = useState(true);

  const handleChange = (newValue: string) => {
    setCode(newValue);
  };

  const editorDidMount = (editor: any) => {
    editor.focus();
  };

  type LineNumbers = 'on' | 'off';

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: { enabled: showMinimap },
    lineNumbers: (showNumbering ? 'on' : 'off') as LineNumbers,
  };

  return (
    <>
      <div style={{ padding: '1rem', background: 'grey' }}>
        <button onClick={() => setIsDark(!isDark)}>Darkmode</button>
        <button onClick={() => setShowMinimap(!showMinimap)}>Minimap</button>
        <button onClick={() => setShowNumbering(!showNumbering)}>
          Numbering
        </button>
      </div>
      <MonacoEditor
        width='100vw'
        height='80vh'
        language='rust'
        theme={isDark ? 'vs-dark' : 'vs'}
        value={code}
        options={options}
        onChange={handleChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};
