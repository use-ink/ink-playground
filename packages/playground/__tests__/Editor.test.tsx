import { Editor } from '../src/components/Editor';
import { render } from '@testing-library/react';

jest.mock('monaco-editor/esm/vs/editor/editor.api.js');

test('should render the monaco-editor', async () => {
  const renderedEditor = render(<Editor />);
  expect(renderedEditor).toMatchSnapshot();
});
