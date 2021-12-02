import { InkEditor } from '../../../ink-editor/src';
import { render } from '@testing-library/react';

jest.mock('monaco-editor/esm/vs/editor/editor.api.js');

test('should render the monaco-editor', async () => {
  const renderedEditor = render(<InkEditor code={''} />);
  expect(renderedEditor).toMatchSnapshot();
});
