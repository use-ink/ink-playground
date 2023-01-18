import Common from '@paritytech/commontypes';

export type TestingApiRequest = Common.TestingRequest;

export type TestingApiResponse =
  | {
      type: 'OK';
      payload: Common.CompilationResult;
    }
  | {
      type: 'NETWORK_ERROR';
    }
  | {
      type: 'SERVER_ERROR';
      payload: { status: number };
    };

export type Config = {
  compileUrl: string;
};

const mapResponse = async (response: Response): Promise<TestingApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

export const testingRequest = (
  config: Config,
  request: TestingApiRequest
): Promise<TestingApiResponse> => {
  const opts: RequestInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  };

  return fetch(config.compileUrl || '', opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
