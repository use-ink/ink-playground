import { ReactElement, useContext, useMemo } from 'react';
import { ConsoleMessages } from '@paritytech/components';
import { MessageContext } from '~/context/messages';
import { Message } from '@paritytech/components';

export const Console = (): ReactElement => {
  const [state] = useContext(MessageContext);

  const filteredMessages = useMemo(() => filterMessages(state.messages), [state.messages]);

  return <ConsoleMessages messages={filteredMessages} />;
};

const filterMessages = (messages: Message[]): Message[] => {
  const messagesToRender: Message[] = [];
  messages.forEach((message, index) => {
    // Get the most recent message state from context
    const latestMessage = findLast(messages, message.id);
    // If there is content to update, replace message
    if (latestMessage) message = latestMessage;
    // Only push the first occurrence to the messagesToRender
    // To preserve original message order
    if (isFirst(messages, message.id, index)) messagesToRender.push(message);
  });
  return messagesToRender;
};

// Find and return the last message object in message state with a given ID
const findLast = (messages: Message[], id: number): Message | undefined => {
  const messagesOfConcern = messages.filter(message => message.id === id);
  if (messagesOfConcern.length > 1) return messagesOfConcern[messagesOfConcern.length - 1];
};

// Evaluate if message object with given id and index is the first occurrence in message state
const isFirst = (messages: Message[], id: number, index: number): boolean => {
  const indexFound = messages.map(m => m.id).indexOf(id);
  return indexFound === index ? true : false;
};
