import { nanoid } from 'nanoid';
import { useContext, ReactElement } from 'react';
import { Dispatch, Prompt, Severity, State } from '~/context/reducer';
import { AppContext } from '~/context';

export const TestControls = (): ReactElement => {
  const [, dispatch]: [State, Dispatch] = useContext(AppContext);

  const dispatchWelcomeMessage = (): void => {
    const messageId = 'mid-' + nanoid(10);
    dispatch({
      type: 'SET_MESSAGE',
      payload: {
        severity: Severity.Info,
        text: 'Hello from console! :)',
        prompt: Prompt.Welcome,
        id: messageId,
      },
    });
  };

  const dispatchErrorMessage = (): void => {
    const messageId = 'mid-' + nanoid(10);
    dispatch({
      type: 'SET_MESSAGE',
      payload: {
        severity: Severity.Error,
        text: 'Something went wrong!',
        prompt: Prompt.Error,
        id: messageId,
      },
    });
  };

  const dispatchInfoMessage = (): void => {
    const messageId = 'mid-' + nanoid(10);
    dispatch({
      type: 'SET_MESSAGE',
      payload: {
        severity: Severity.Success,
        text: 'Systems are up and running.',
        prompt: Prompt.System,
        id: messageId,
      },
    });
  };

  return (
    <div className="dark:bg-gray-800 bg-gray-200 border">
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-3 border text-secondary rounded"
        onClick={() => dispatchWelcomeMessage()}
      >
        Dispatch Welcome Message
      </button>
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-1 border text-secondary rounded"
        onClick={() => dispatchErrorMessage()}
      >
        Dispatch Error Message
      </button>
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-1 border text-secondary rounded"
        onClick={() => dispatchInfoMessage()}
      >
        Dispatch Info Message
      </button>
    </div>
  );
};
