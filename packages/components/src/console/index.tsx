import { useEffect, useRef, ReactElement } from 'react';
import { ConsoleMessage } from './ConsoleMessage';
import { Message } from './ConsoleMessage';

export const ConsoleMessages = ({ messages }: { messages: Message[] }): ReactElement => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
      elementRef.current && elementRef.current.scrollIntoView();
    });
    return <div ref={elementRef} />;
  };

  const Messages = () => {
    return (
      <>
        {messages.map((message, index) => {
          return <ConsoleMessage key={message.id} mIndex={index} message={message} />;
        })}
      </>
    );
  };

  return (
    <div className="h-full w-full relative" data-testid="console-container">
      <div
        className={`
          dark:text-primary dark:bg-primary text-light text-sm subpixel-antialiased  
          leading-normal px-5 pt-4 pb-4 shadow-lg overflow-y-scroll h-full w-full absolute
        `}
      >
        <Messages />
        <AlwaysScrollToBottom />
      </div>
    </div>
  );
};
