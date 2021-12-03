import * as Common from '@paritytech/commontypes';

// -------------------------------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------------------------------

export type GistCreateApiRequest = Common.GistCreateRequest;

export type GistCreateApiResponse =
  | {
      type: 'OK';
      payload: Common.GistCreateResponse;
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

const mapResponse = async (response: Response): Promise<GistCreateApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

type Config = {
  gistCreateUrl: string;
};

export const gistCreateRequest = (
  config: Config,
  request: GistCreateApiRequest
): Promise<GistCreateApiResponse> => {
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
