import { useContext, ReactElement } from 'react';
import { MessageDispatch, MessageState } from '~/context/messages/reducer';
import { MessageContext } from '~/context/messages';

export const TestControls = (): ReactElement => {
  const [, dispatch]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const dispatchRaLoading = (): void => {
    dispatch({
      type: 'LOG_SYSTEM',
      payload: {
        content: 'Loading rust analyzer...',
        status: 'IN_PROGRESS',
      },
    });
  };

  const dispatchRaDone = (): void => {
    dispatch({
      type: 'LOG_SYSTEM',
      payload: {
        content: 'Rust analyzer ready',
        status: 'DONE',
      },
    });
  };

  const dispatchCompileLoading = (): void => {
    dispatch({
      type: 'LOG_COMPILE',
      payload: {
        content: 'Compiling has started...',
        status: 'IN_PROGRESS',
      },
    });
  };

  const dispatchCompileDone = (): void => {
    dispatch({
      type: 'LOG_COMPILE',
      payload: {
        content: 'Compiling finished',
        status: 'DONE',
      },
    });
  };

  const dispatchGistLoading = (): void => {
    dispatch({
      type: 'LOG_GIST',
      payload: {
        content: 'Publishing to GitHub Gist...',
        status: 'IN_PROGRESS',
      },
    });
  };

  const dispatchGistError = (): void => {
    dispatch({
      type: 'LOG_GIST',
      payload: {
        content: 'Something went wrong :(',
        status: 'ERROR',
      },
    });
  };

  return (
    <div className="dark:bg-primary bg-gray-200 dark:border-dark border-light border-t">
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-3 border text-info rounded"
        onClick={() => dispatchRaLoading()}
      >
        RA Loading
      </button>
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-1 border text-info rounded"
        onClick={() => dispatchRaDone()}
      >
        RA Done
      </button>

      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-3 border text-info rounded"
        onClick={() => dispatchCompileLoading()}
      >
        Compile Loading
      </button>
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-1 border text-info rounded"
        onClick={() => dispatchCompileDone()}
      >
        Compile Done
      </button>

      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-3 border text-info rounded"
        onClick={() => dispatchGistLoading()}
      >
        Gist Loading
      </button>
      <button
        className="dark:bg-elevation bg-gray-200 py-1 px-3 mx-2 my-1 border text-info rounded"
        onClick={() => dispatchGistError()}
      >
        Gist Error
      </button>
    </div>
  );
};
