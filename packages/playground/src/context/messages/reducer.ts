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

export type MessageAction = SystemMessage | CompilationMessage | GistMessage;

export type SystemMessage = {
  type: 'LOG_SYSTEM';
  payload: {
    status: Status;
    content: string;
  };
};

export type CompilationMessage = {
  type: 'LOG_COMPILE';
  payload: {
    status: Status;
    content: string;
    result?: CompilationResult;
  };
};

export type GistMessage = {
  type: 'LOG_GIST';
  payload: {
    status: Status;
    content: string;
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

const reducerLogSystem = (state: MessageState, action: SystemMessage): MessageState => {
  if (action.payload.status === 'IN_PROGRESS' || action.payload.status === 'INFO') {
    const newMessage: Message = {
      id: state.nextId,
      prompt: 'SYSTEM',
      status: action.payload.status,
      content: action.payload.content,
      severity: Severity[action.payload.status],
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
      status: action.payload.status,
      content: action.payload.content,
      severity: Severity[action.payload.status],
    };
    return {
      ...state,
      messages: [...state.messages, updateMessage],
    };
  }
};

const reducerLogCompile = (state: MessageState, action: CompilationMessage): MessageState => {
  switch (action.payload.status) {
    case 'ERROR': {
      const id = lastId(state, 'COMPILE');
      // Server error message to attach, if present
      const serverErrorMsg = action.payload.result?.payload.stderr;
      const updateMessage: Message = {
        id,
        prompt: 'COMPILE',
        status: action.payload.status,
        // construct error message
        content: `${action.payload.content}${serverErrorMsg ? `: '${serverErrorMsg}'` : ''}`,
        severity: Severity[action.payload.status],
      };
      return {
        ...state,
        messages: [...state.messages, updateMessage],
        nextId: state.nextId + 1,
      };
    }
    case 'DONE': {
      const id = lastId(state, 'COMPILE');
      // Set "compilation in progress" message to "DONE"
      const updateMessage: Message = {
        id,
        prompt: 'COMPILE',
        status: action.payload.status,
        content: action.payload.content,
        severity: Severity[action.payload.status],
      };
      // Dispatch message with compilation details
      const newMessage: Message = {
        id: state.nextId,
        prompt: 'COMPILE',
        status: 'INFO',
        content: `This is your compile Result: ${
          action.payload.result ? action.payload.result.payload.stdout : '<Result>'
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
        status: action.payload.status,
        content: action.payload.content,
        severity: Severity[action.payload.status],
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
        nextId: state.nextId + 1,
      };
    }
  }
};

const reducerLogGist = (state: MessageState, action: GistMessage): MessageState => {
  const appendMessage = (state: MessageState, action: GistMessage): MessageState => {
    const newMessage: Message = {
      id: state.nextId,
      prompt: 'GIST',
      status: action.payload.status,
      content: action.payload.content,
      severity: Severity[action.payload.status],
    };
    return {
      ...state,
      messages: [...state.messages, newMessage],
      nextId: state.nextId + 1,
    };
  };

  const updateMessage = (state: MessageState, action: GistMessage): MessageState => {
    const id = lastId(state, 'GIST');
    const updateMessage: Message = {
      id,
      prompt: 'GIST',
      status: action.payload.status,
      content: action.payload.content,
      severity: Severity[action.payload.status],
    };
    return {
      ...state,
      messages: [...state.messages, updateMessage],
    };
  };

  switch (action.payload.status) {
    case 'IN_PROGRESS':
    case 'INFO':
      return appendMessage(state, action);
    case 'DONE':
    case 'ERROR':
      return updateMessage(state, action);
  }
};

export const reducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'LOG_SYSTEM':
      return reducerLogSystem(state, action);

    case 'LOG_COMPILE':
      return reducerLogCompile(state, action);

    case 'LOG_GIST':
      return reducerLogGist(state, action);
  }
};
