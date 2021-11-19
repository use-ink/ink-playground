import { OverlayPanel } from '../src';
import { render, screen } from '@testing-library/react';
import { ReactElement, useRef } from 'react';

const RenderedOverlayPanel = (): ReactElement => {
  const panel = useRef<OverlayPanel>(null);
  return (
    <>
      <button onClick={e => panel.current && panel.current.toggle(e)}>Toggle Panel</button>
      <OverlayPanel ref={panel}>Panel Content</OverlayPanel>
    </>
  );
};

test('It renders OverlayPanel', () => {
  // Given
  render(<RenderedOverlayPanel />);
  const togglePanel = screen.getByText('Toggle Panel');
  // When
  togglePanel.click();
  // Then
  expect(screen.getByText('Panel Content')).toBeInTheDocument();
});
