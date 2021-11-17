import { CompilationResult } from '@paritytech/commontypes';
import { Message, Status, Severity, Prompt } from '@paritytech/components/';

export const defaultState: MessageState = {
  messages: [],
  nextId: 0,
};

export type MessageState = {
  messages: Array<Message>;
  nextId: number;
};

export type MessageAction = {
  type: 'LOG_COMPILE' | 'LOG_SYSTEM' | 'LOG_GIST';
  payload: {
    status: Status;
    content: string;
    result?: CompilationResult;
  };
};

export type MessageDispatch = (action: MessageAction) => void;

// Get the last id of a message dispatched before with with given Prompt as identifier
const lastId = (state: MessageState, prompt: Prompt): number => {
  const arr = state.messages.filter(message => message.prompt === prompt);
  const lastId = arr[arr.length - 1]?.id;
  if (lastId !== undefined) return lastId;
  // if no last id available, return nextId
  return state.nextId;
};

export const reducer = (state: MessageState, { type, payload }: MessageAction): MessageState => {
  switch (type) {
    case 'LOG_SYSTEM':
      // Logs with "SYSTEM" Prompt create new Message for "IN_PROGRESS" and "INFO" status
      // and update the last message for "ERROR" and "DONE" status
      if (payload.status === 'IN_PROGRESS' || payload.status === 'INFO') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'SYSTEM',
          status: payload.status,
          content: payload.content,
          severity: Severity[payload.status],
        };
        return {
          ...state,
          messages: [...state.messages, newMessage],
          nextId: state.nextId + 1,
        };
      } else {
        const id = lastId(state, 'SYSTEM');
        const updateMessage: Message = {
          id,
          prompt: 'SYSTEM',
          status: payload.status,
          content: payload.content,
          severity: Severity[payload.status],
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage],
        };
      }
    case 'LOG_COMPILE':
      // Logs with "COMPILE" Prompt create new Message for "IN_PROGRESS" and "INFO" status
      // update the last message for "ERROR" with returned compiler "Error" and
      // update the last message for "DONE" with returned compile Result as new Message
      switch (payload.status) {
        case 'ERROR': {
          const id = lastId(state, 'COMPILE');
          const updateMessage: Message = {
            id,
            prompt: 'COMPILE',
            status: payload.status,
            content: `There was an error compiling your contract: ${
              payload.result ? payload.result.payload.stderr : '<Error>'
            }`,
            severity: Severity[payload.status],
          };
          return {
            ...state,
            messages: [...state.messages, updateMessage],
            nextId: state.nextId + 1,
          };
        }
        case 'DONE': {
          const id = lastId(state, 'COMPILE');
          const updateMessage: Message = {
            id,
            prompt: 'COMPILE',
            status: payload.status,
            content: payload.content,
            severity: Severity[payload.status],
          };
          const newMessage: Message = {
            id: state.nextId,
            prompt: 'COMPILE',
            status: 'INFO',
            content: `This is your compile Result: ${
              payload.result ? payload.result.payload.stdout : '<Result>'
            }`,
            severity: Severity.INFO,
          };
          return {
            ...state,
            messages: [...state.messages, updateMessage, newMessage],
            nextId: state.nextId + 1,
          };
        }
        default: {
          const newMessage: Message = {
            id: state.nextId,
            prompt: 'COMPILE',
            status: payload.status,
            content: payload.content,
            severity: Severity[payload.status],
          };
          return {
            ...state,
            messages: [...state.messages, newMessage],
            nextId: state.nextId + 1,
          };
        }
      }
    case 'LOG_GIST':
      // Logs with "GIST" Prompt create new Message for "IN_PROGRESS" and "INFO" status
      // and update the last message for "ERROR" and "DONE" status
      if (payload.status === 'IN_PROGRESS' || payload.status === 'INFO') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'GIST',
          status: payload.status,
          content: payload.content,
          severity: Severity[payload.status],
        };
        return {
          ...state,
          messages: [...state.messages, newMessage],
          nextId: state.nextId + 1,
        };
      } else {
        const id = lastId(state, 'GIST');
        const updateMessage: Message = {
          id,
          prompt: 'GIST',
          status: payload.status,
          content: payload.content,
          severity: Severity[payload.status],
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage],
        };
      }
    default:
      return state;
  }
};
