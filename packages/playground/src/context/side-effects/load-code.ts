import { State, Dispatch } from '../app/reducer';
import { MessageDispatch } from '../messages/reducer';
import { gistLoadRequest } from '~/api/gists';
import { GistCreateResponse } from '@paritytech/commontypes';
import qs from 'qs';
import exampleCode from '~/app/Editor/example-code';

type Params = { id?: string };

const parseParams = (input: string): Params => {
  const queryString = qs.parse(input);
  return queryString as Params;
};

const handleError = (
  content: string,
  dispatch: Dispatch,
  dispatchMessage: MessageDispatch
): string => {
  dispatchMessage({
    type: 'LOG_GIST',
    payload: {
      content,
      status: 'ERROR',
    },
  });
  resetToNotAsked(dispatch, dispatchMessage);
  return '';
};

const handleSuccess = (
  response: Extract<GistCreateResponse, { type: 'SUCCESS' }>,
  dispatch: Dispatch,
  dispatchMessage: MessageDispatch
): string => {
  dispatchMessage({
    type: 'LOG_GIST',
    payload: {
      content: `GitHub Gist was successfully loaded from: ${response.payload.url}`,
      status: 'ERROR',
    },
  });

  dispatch({
    type: 'SET_GIST_STATE',
    payload: {
      type: 'RESULT',
      payload: {
        type: 'OK',
        payload: response,
      },
    },
  });
  return response.payload.code;
};

const resetToNotAsked = (dispatch: Dispatch, dispatchMessage: MessageDispatch): void => {
  dispatch({ type: 'SET_GIST_STATE', payload: { type: 'NOT_ASKED' } });
  dispatchMessage({
    type: 'LOG_GIST',
    payload: {
      content: 'Something went wrong, please try again!',
      status: 'ERROR',
    },
  });
};

export async function loadCode(
  state: State,
  dispatch: Dispatch,
  dispatchMessage: MessageDispatch
): Promise<string> {
  if (state.gist.type === 'IN_PROGRESS') return '';

  dispatch({ type: 'SET_GIST_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatchMessage({
    type: 'LOG_GIST',
    payload: {
      content: 'Loading GitHub Gist...',
      status: 'IN_PROGRESS',
    },
  });

  const params = parseParams(window.location.search.substring(1));
  if (!params.id) {
    return exampleCode;
  }
  const result = await gistLoadRequest({ id: params.id });

  switch (result.type) {
    case 'NETWORK_ERROR':
      return handleError('Network error!', dispatch, dispatchMessage);
    case 'SERVER_ERROR':
      return handleError('Server error!', dispatch, dispatchMessage);
    case 'ERROR':
      return handleError('There was an error loading Gist.', dispatch, dispatchMessage);
    case 'SUCCESS':
      return handleSuccess(result, dispatch, dispatchMessage);
  }
}
