import { GIST_LOAD_URL } from '~/env';
import * as Common from '@paritytech/commontypes';

// -------------------------------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------------------------------

export type GistLoadApiRequest = Common.GistLoadRequest;

export type GistLoadApiResponse =
  | {
      type: 'OK';
      payload: Common.GistLoadResponse;
    }
  | {
      type: 'NETWORK_ERROR';
    }
  | {
      type: 'SERVER_ERROR';
      payload: { status: number };
    };

// -------------------------------------------------------------------------------------------------
// Functions
// -------------------------------------------------------------------------------------------------

const mapResponse = async (response: Response): Promise<GistLoadApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

export const gistLoadRequest = (request: GistLoadApiRequest): Promise<GistLoadApiResponse> => {
  const opts: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  };

  return fetch(GIST_LOAD_URL || '', opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
