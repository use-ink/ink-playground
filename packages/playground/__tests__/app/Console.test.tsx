import { render, screen } from '@testing-library/react';
import { Console } from '~/app/Console';
import { MessageContext, MessageProvider } from '~/context/messages';
import { MessageAction, MessageDispatch, MessageState } from '~/context/messages/reducer';
import { ReactElement, useContext, useEffect } from 'react';

// Mock scrollIntoView function, which is not included in "js-dom"
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('Given Console component is rendered', () => {
  test('Renders empty message container', () => {
    // Given, When
    render(<Console />);
    const consoleContainer = screen.getByTestId('console-container');

    // Then
    expect(consoleContainer).toBeInTheDocument();
  });
});

/* HELPER COMPONENT: DISPATCH ACTIONS TO CONTEXT AND RENDER CONSOLE */
const DispatchActions = ({ actions }: { actions: MessageAction[] }): ReactElement => {
  const [, dispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);

  useEffect(() => {
    actions.forEach(action => dispatch(action));
  }, []);

  return <Console />;
};

describe('Given Console component is rendered in context', () => {
  test('When a single "LOG_SYSTEM" action is dispatched', () => {
    // Given, When
    const action: MessageAction = {
      type: 'LOG_SYSTEM',
      payload: {
        content: 'I am loading...',
        status: 'IN_PROGRESS',
      },
    };
    render(
      <MessageProvider>
        <DispatchActions actions={[action]} />
      </MessageProvider>
    );
    const loadingMsg = screen.getByText('I am loading...');

    // Then
    expect(loadingMsg).toBeInTheDocument();
  });

  test('When a second "LOG_SYSTEM" action is dispatched', () => {
    // Given, When
    const actionOne: MessageAction = {
      type: 'LOG_SYSTEM',
      payload: {
        content: 'I am loading...',
        status: 'IN_PROGRESS',
      },
    };
    const actionTwo: MessageAction = {
      type: 'LOG_SYSTEM',
      payload: {
        content: 'I should update the first!',
        status: 'DONE',
      },
    };
    render(
      <MessageProvider>
        <DispatchActions actions={[actionOne, actionTwo]} />
      </MessageProvider>
    );
    const loadingMsg = screen.queryByText('I am loading...');
    const updatedMsg = screen.getByText('I should update the first!');

    // Then
    expect(loadingMsg).not.toBeInTheDocument();
    expect(updatedMsg).toBeInTheDocument();
  });
});
