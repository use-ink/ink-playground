import { CompilationResult, TestingResult, FormatingResult } from '@paritytech/commontypes';
import { Message, Status, Severity, Prompt } from '@paritytech/components/';
import * as sizeLimit from '~/constants';
import { extractContractSize } from '../side-effects/compile';

export const defaultState: MessageState = {
  messages: [],
  nextId: 0,
};

export type MessageState = {
  messages: Array<Message>;
  nextId: number;
};

export type MessageAction =
  | SystemMessage
  | CompilationMessage
  | GistMessage
  | TestingMessage
  | FormattingMessage;

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

export type TestingMessage = {
  type: 'LOG_TESTING';
  payload: {
    status: Status;
    content: string;
    result?: TestingResult;
  };
};

export type FormattingMessage = {
  type: 'LOG_FORMATTING';
  payload: {
    status: Status;
    content: string;
    result?: FormatingResult;
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

export const mapSizeInfo = (size: number | null): string => {
  if (!size) return '';
  if (size <= sizeLimit.OPTIMAL_SIZE) {
    return `Your contract has an optimal size of ${size} KB.`;
  } else if (size <= sizeLimit.ACCEPTABLE_SIZE) {
    return `Your contract has an acceptable size of ${size} KB.`;
  } else if (size <= sizeLimit.PROBLEMATIC_SIZE) {
    return `Your contract has a problematic size of ${size} KB.`;
  }
  return `Your contract has an incompatible size of ${size} KB.`;
};

const mapContentColor = (size: number): string => {
  if (size <= sizeLimit.OPTIMAL_SIZE) {
    return 'text-green-400';
  } else if (size <= sizeLimit.ACCEPTABLE_SIZE) {
    return 'text-blue-400';
  } else if (size <= sizeLimit.PROBLEMATIC_SIZE) {
    return 'text-yellow-400';
  }
  return 'text-red-400';
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
      const contractSize = extractContractSize(action.payload.result?.payload.stdout || '');
      const newMessage: Message = {
        id: state.nextId,
        prompt: 'COMPILE',
        status: 'INFO',
        content: `\nThis is your compile Result:\n${
          action.payload.result ? action.payload.result.payload.stdout : '<Result>'
        }`,
        preContent: mapSizeInfo(contractSize),
        preContentColor: mapContentColor(contractSize),
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
const reducerLogFormatting = (state: MessageState, action: FormattingMessage) => {
  switch (action.payload.status) {
    case 'ERROR': {
      const id = lastId(state, 'FORMAT');
      // Server error message to attach, if present
      const serverErrorMsg = action.payload.result?.payload.stderr;
      const updateMessage: Message = {
        id,
        prompt: 'FORMAT',
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
      const id = lastId(state, 'FORMAT');
      const updateMessage: Message = {
        id,
        prompt: 'FORMAT',
        status: action.payload.status,
        content: action.payload.content,
        severity: Severity[action.payload.status],
      };
      // Dispatch message with formatting details
      const status = (action.payload.result?.type || 'INFO') as Status;
      const newMessage: Message = {
        id: state.nextId,
        prompt: 'FORMAT',
        status,
        content: `Code was successfully formatted! `,
        severity: Severity[status],
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
        prompt: 'FORMAT',
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
const reducerLogTesting = (state: MessageState, action: TestingMessage): MessageState => {
  switch (action.payload.status) {
    case 'ERROR': {
      const id = lastId(state, 'TEST');
      // Server error message to attach, if present
      const serverErrorMsg = action.payload.result?.payload.stderr;
      const updateMessage: Message = {
        id,
        prompt: 'TEST',
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
      const id = lastId(state, 'TEST');
      // Set "running tests..." message to "DONE"
      const updateMessage: Message = {
        id,
        prompt: 'TEST',
        status: action.payload.status,
        content: action.payload.content,
        severity: Severity[action.payload.status],
      };
      // Dispatch message with testing details
      const status = (action.payload.result?.type || 'INFO') as Status;
      const newMessage: Message = {
        id: state.nextId,
        prompt: 'TEST',
        status,
        content: `This is your test Result:\n${
          action.payload.result ? action.payload.result.payload.stdout : '<Result>'
        }`,
        severity: Severity[status],
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
        prompt: 'TEST',
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
    case 'SUCCESS':
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

    case 'LOG_TESTING':
      return reducerLogTesting(state, action);

    case 'LOG_FORMATTING':
      return reducerLogFormatting(state, action);

    default:
      return state;
  }
};
