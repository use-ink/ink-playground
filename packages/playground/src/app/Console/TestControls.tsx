import { useContext, ReactElement } from 'react';
import { Dispatch, State } from '~/context/messages/reducer';
import { MessageContext } from '~/context/messages';

export const TestControls = (): ReactElement => {
  const [, dispatch]: [State, Dispatch] = useContext(MessageContext);

  const dispatchRaLoading = (): void => {
    dispatch({
      type: 'LOG_SYSTEM',
      payload: {
        content: 'loading rust analyzer...',
        status: 'IN_PROGRESS',
      },
    });
  };

  const dispatchRaDone = (): void => {
    dispatch({
      type: 'LOG_SYSTEM',
      payload: {
        content: 'rust analyzer ready',
        status: 'DONE',
      },
    });
  };

  const dispatchCompileLoading = (): void => {
    dispatch({
      type: 'LOG_COMPILE',
      payload: {
        content: 'compiling has started...',
        status: 'IN_PROGRESS',
      },
    });
  };

  const dispatchCompileDone = (): void => {
    dispatch({
      type: 'LOG_COMPILE',
      payload: {
        content: 'compiling finished',
        status: 'DONE',
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
    </div>
  );
};
