import { useContext, useEffect, useRef, ReactElement } from 'react';
import { AppContext } from '~/context';
import { Dispatch, State } from '~/context/reducer';
import { ConsoleMessage } from './ConsoleMessage';

export const ConsoleMessages = (): ReactElement => {
  const [state]: [State, Dispatch] = useContext(AppContext);

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => elementRef?.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const Messages = () => {
    return (
      <>
        {state.messages.map((message, index) => {
          return <ConsoleMessage key={index} message={message} />;
        })}
      </>
    );
  };

  return (
    <div>
      <Messages />
      <AlwaysScrollToBottom />
    </div>
  );
};
