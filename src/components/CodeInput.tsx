import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ code, setCode }) => {
  return (
    <Editor
      height="300px"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value || '')}
    />
  );
};

export default CodeInput;
