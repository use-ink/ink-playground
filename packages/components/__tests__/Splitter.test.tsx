import { Splitter, SplitterPanel } from '../src';
import { render, screen } from '@testing-library/react';

test('It renders Splitter and SplitterPanel', () => {
  // Given, When
  render(
    <Splitter>
      <SplitterPanel>Panel 1</SplitterPanel>
      <SplitterPanel>Panel 2</SplitterPanel>
    </Splitter>
  );
  // Then
  expect(screen.getByText('Panel 1')).toBeInTheDocument();
  expect(screen.getByText('Panel 2')).toBeInTheDocument();
});
