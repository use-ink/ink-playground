import { COMPILE_URL } from '~/env';

// -------------------------------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------------------------------

export type CompileApiRequest = { source: string };

export type CompileApiResponse =
  | {
      type: 'OK';
      payload: { result: string };
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

const mapResponse = async (response: Response): Promise<CompileApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

export const compileRequest = (request: CompileApiRequest): Promise<CompileApiResponse> => {
  const opts: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };

  return fetch(COMPILE_URL, opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
