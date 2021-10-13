import { Editor } from '../src/components/Editor';
import { render } from '@testing-library/react';

test('Monaco editor component renders', () => {
  const editor = render(<Editor />);
  console.log(editor);
  expect(editor).toBeDefined();
});
