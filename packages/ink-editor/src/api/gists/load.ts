import * as Common from '@paritytech/commontypes';

// -------------------------------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------------------------------

export type GistLoadApiRequest = Common.GistLoadRequest;

export type GistLoadApiResponse =
  | {
      type: 'NETWORK_ERROR';
    }
  | {
      type: 'SERVER_ERROR';
      payload: { status: number };
    }
  | Common.GistLoadResponse;

// -------------------------------------------------------------------------------------------------
// Functions
// -------------------------------------------------------------------------------------------------

const mapResponse = async (response: Response): Promise<GistLoadApiResponse> =>
  response.status === 200
    ? await response.json()
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

type Config = {
  gistCreateUrl: string;
};

export const gistLoadRequest = (
  config: Config,
  request: GistLoadApiRequest
): Promise<GistLoadApiResponse> => {
  const opts: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  };

  return fetch(config.gistCreateUrl, opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
