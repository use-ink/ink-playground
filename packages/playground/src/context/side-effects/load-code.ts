import { State, Dispatch as AppDispatch } from '../app/reducer';
import { MessageDispatch } from '../messages/reducer';
import { gistLoadRequest } from '@paritytech/ink-editor/api/gists';
import { GistCreateResponse } from '@paritytech/commontypes';
import qs from 'qs';
// See: https://github.com/webpack/webpack/issues/12900
import exampleCode from '../../../../../crates/contract/lib.txt!=!../../../../../crates/contract/lib.rs';
import { GIST_LOAD_URL } from '~/env';

type Params = { id?: string };

const parseParams = (input: string): Params => {
  const queryString = qs.parse(input);
  return queryString as Params;
};

type Dispatch = {
  app: AppDispatch;
  message: MessageDispatch;
};

const handleError = (content: string, dispatch: Dispatch): string => {
  dispatch.app({ type: 'SET_GIST_STATE', payload: { type: 'NOT_ASKED' } });
  dispatch.message({
    type: 'LOG_GIST',
    payload: {
      content,
      status: 'ERROR',
    },
  });
  dispatch.message({
    type: 'LOG_GIST',
    payload: {
      content: 'Something went wrong, please try again!',
      status: 'ERROR',
    },
  });
  return '';
};

const handleSuccess = (
  response: Extract<GistCreateResponse, { type: 'SUCCESS' }>,
  dispatch: Dispatch
): string => {
  dispatch.message({
    type: 'LOG_GIST',
    payload: {
      content: `GitHub Gist was successfully loaded from: ${response.payload.url}`,
      status: 'DONE',
    },
  });

  dispatch.app({
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

export async function loadCode(state: State, dispatch: Dispatch): Promise<string> {
  if (state.gist.type === 'IN_PROGRESS') return '';

  const params = parseParams(window.location.search.substring(1));
  if (!params.id) {
    console.log('!!!!!!', exampleCode);
    return exampleCode;
  }

  dispatch.app({ type: 'SET_GIST_STATE', payload: { type: 'IN_PROGRESS' } });

  dispatch.message({
    type: 'LOG_GIST',
    payload: {
      content: 'Loading GitHub Gist...',
      status: 'IN_PROGRESS',
    },
  });

  const result = await gistLoadRequest(
    {
      gistLoadUrl: GIST_LOAD_URL || '',
    },
    { id: params.id }
  );

  switch (result.type) {
    case 'NETWORK_ERROR':
      return handleError('Network error!', dispatch);
    case 'SERVER_ERROR':
      return handleError('Server error!', dispatch);
    case 'ERROR':
      return handleError('There was an error loading Gist.', dispatch);
    case 'SUCCESS':
      return handleSuccess(result, dispatch);
  }
}
