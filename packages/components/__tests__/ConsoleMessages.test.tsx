import { ConsoleMessages, Message, Severity } from '../src';
import { render, screen } from '@testing-library/react';

// Mock scrollIntoView function, which is not included in "js-dom"
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Given the ConsoleMessages component is rendered', () => {
  describe('Given "SYSTEM" messages have been dispatched', () => {
    beforeEach(() => {
      const testMessages: Message[] = [
        {
          id: 0,
          prompt: 'SYSTEM',
          status: 'IN_PROGRESS',
          severity: Severity.WARNING,
          content: 'Message: IN_PROGRESS',
        },
        {
          id: 1,
          prompt: 'SYSTEM',
          status: 'DONE',
          severity: Severity.SUCCESS,
          content: 'Message: DONE',
        },
        {
          id: 2,
          prompt: 'SYSTEM',
          status: 'ERROR',
          severity: Severity.ERROR,
          content: 'Message: ERROR',
        },
        {
          id: 3,
          prompt: 'SYSTEM',
          status: 'INFO',
          severity: Severity.INFO,
          content: 'Message: INFO',
        },
      ];
      render(<ConsoleMessages messages={testMessages} />);
    });

    test('When prompt is displayed', async () => {
      const prompt = await screen.findAllByText('SYSTEM:');
      // Then ...
      expect(prompt[0]).toBeInTheDocument();
      expect(prompt.length).toBe(4);
    });

    describe('When "IN_PROGRESS" message is displayed', () => {
      test('When message icon is displayed', async () => {
        const icon = await screen.findByTestId('icon-0');
        // Then ...
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('pi', 'pi-spinner', 'animate-spin');
      });

      test('When prompt has severity color', async () => {
        const prompt = await screen.findAllByText('SYSTEM:');
        // Then ...
        expect(prompt[0]).toBeInTheDocument();
        expect(prompt[0]).toHaveClass('text-warn');
      });

      test('When message content is displayed', async () => {
        const message = await screen.findByText('Message: IN_PROGRESS');
        // Then ...
        expect(message).toBeInTheDocument();
      });
    });

    describe('When "DONE" message is displayed', () => {
      test('When message icon is displayed', async () => {
        const icon = await screen.findByTestId('icon-1');
        // Then ...
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('pi', 'pi-check');
      });

      test('When prompt has severity color', async () => {
        const prompt = await screen.findAllByText('SYSTEM:');
        // Then ...
        expect(prompt[1]).toBeInTheDocument();
        expect(prompt[1]).toHaveClass('text-success');
      });

      test('When message content is displayed', async () => {
        const message = await screen.findByText('Message: DONE');
        // Then ...
        expect(message).toBeInTheDocument();
      });
    });

    describe('When "ERROR" message is displayed', () => {
      test('When message icon is displayed', async () => {
        const icon = await screen.findByTestId('icon-2');
        // Then ...
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('pi', 'pi-times');
      });

      test('When prompt has severity color', async () => {
        const prompt = await screen.findAllByText('SYSTEM:');
        // Then ...
        expect(prompt[2]).toBeInTheDocument();
        expect(prompt[2]).toHaveClass('text-error');
      });

      test('When message content is displayed', async () => {
        const message = await screen.findByText('Message: ERROR');
        // Then ...
        expect(message).toBeInTheDocument();
      });
    });

    describe('When "INFO" message is displayed', () => {
      test('When message icon is displayed', async () => {
        const icon = await screen.findByTestId('icon-3');
        // Then ...
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('pi', 'pi-info-circle');
      });

      test('When prompt has severity color', async () => {
        const prompt = await screen.findAllByText('SYSTEM:');
        // Then ...
        expect(prompt[3]).toBeInTheDocument();
        expect(prompt[3]).toHaveClass('text-info');
      });

      test('When message content is displayed', async () => {
        const message = await screen.findByText('Message: INFO');
        // Then ...
        expect(message).toBeInTheDocument();
      });
    });
  });
});
