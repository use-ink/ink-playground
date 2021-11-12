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

export type Action = {
  type: 'LOG_COMPILE' | 'LOG_SYSTEM' | 'LOG_GIST';
  payload: {
    status: Status;
    content: string;
    result?: CompilationResult;
  };
};

export type MessageDispatch = (action: Action) => void;

const lastId = (state: MessageState, prompt: Prompt): number => {
  const arr = state.messages.filter(message => message.prompt === prompt);
  return arr[arr.length - 1].id;
};

export const reducer = (state: MessageState, { type, payload }: Action): MessageState => {
  switch (type) {
    case 'LOG_SYSTEM':
      if (payload.status === 'IN_PROGRESS') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'SYSTEM',
          status: 'IN_PROGRESS',
          content: payload.content,
          severity: Severity.Warning,
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
          severity: Severity.Success,
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage],
        };
      }
    case 'LOG_COMPILE':
      if (payload.status === 'IN_PROGRESS') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'COMPILE',
          status: 'IN_PROGRESS',
          content: payload.content,
          severity: Severity.Warning,
        };
        return {
          ...state,
          messages: [...state.messages, newMessage],
          nextId: state.nextId + 1,
        };
      } else if (payload.status === 'ERROR') {
        const id = lastId(state, 'COMPILE');
        const updateMessage: Message = {
          id,
          prompt: 'COMPILE',
          status: payload.status,
          content: payload.content,
          severity: Severity.Error,
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage],
          nextId: state.nextId + 1,
        };
      } else {
        const id = lastId(state, 'COMPILE');
        const updateMessage: Message = {
          id,
          prompt: 'COMPILE',
          status: payload.status,
          content: payload.content,
          severity: Severity.Success,
        };
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'COMPILE',
          status: 'INFO',
          content: `This is your compile Result: ${
            payload.result ? payload.result.payload.stdout : '<Result>'
          }`,
          severity: Severity.Info,
        };
        return {
          ...state,
          messages: [...state.messages, updateMessage, newMessage],
          nextId: state.nextId + 1,
        };
      }
    case 'LOG_GIST':
      if (payload.status === 'IN_PROGRESS') {
        const newMessage: Message = {
          id: state.nextId,
          prompt: 'GIST',
          status: 'IN_PROGRESS',
          content: payload.content,
          severity: Severity.Warning,
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
          severity: Severity.Error,
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
