import { render, screen } from '@testing-library/react';
import App from '~/app';

// Mock monaco editor api
jest.mock('monaco-editor/esm/vs/editor/editor.api.js');

// Mock scrollIntoView function, which is not included in "js-dom"
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Render the App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('Components are present', () => {
    // Given, When, Then
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
    expect(screen.getByTestId('header-logo')).toBeInTheDocument();
    expect(screen.getByTestId('console-component')).toBeInTheDocument();
  });

  test('Compile source code', () => {
    // Given
    const compileButton = screen.getByText('Compile');
    // When
    compileButton.click();
    const compilePrompt = screen.getByText('COMPILE:');
    const compileMessage = screen.getByText('Compiling has started...');
    // Then
    expect(compilePrompt).toBeInTheDocument();
    expect(compileMessage).toBeInTheDocument();
  });
});
