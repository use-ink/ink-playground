import { Editor } from '~/App/Editor';
import { render } from '@testing-library/react';

jest.mock('monaco-editor/esm/vs/editor/editor.api.js');

test('Given the monaco editor is imported and mocked', async () => {
  // When it is rendered
  const renderedEditor = render(<Editor />);
  // Then ...
  expect(renderedEditor).toMatchSnapshot();
});
