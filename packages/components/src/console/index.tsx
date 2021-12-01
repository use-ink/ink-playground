import { useEffect, useRef, ReactElement } from 'react';
import { ConsoleMessage } from './ConsoleMessage';
import { Message } from './ConsoleMessage';
import { Severity } from '@paritytech/components/';

export const ConsoleMessages = ({ messages }: { messages: Message[] }): ReactElement => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => elementRef?.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const messages_: Message[] = [
    {
      id: 0,
      prompt: 'SYSTEM',
      status: 'IN_PROGRESS',
      severity: Severity.IN_PROGRESS,
    },
    {
      id: 1,
      prompt: 'SYSTEM',
      status: 'DONE',
      severity: Severity.DONE,
      content: 'I am some short content..',
    },
    {
      id: 2,
      prompt: 'SYSTEM',
      status: 'IN_PROGRESS',
      severity: Severity.IN_PROGRESS,
      content:
        'I am some very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong long long long long long long long long long long long long long long long long long long long long long long long content..',
    },
  ];

  const Messages = () => {
    return (
      <>
        {messages_.map((message, index) => {
          return <ConsoleMessage key={message.id} mIndex={index} message={message} />;
        })}
      </>
    );
  };

  return (
    <div className="h-full w-full relative">
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
