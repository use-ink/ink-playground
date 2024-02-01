import Common from '@paritytech/commontypes';

export type versionListApiResponse =
  | {
      type: 'OK';
      payload: Common.VersionListResult;
    }
  | {
      type: 'NETWORK_ERROR';
    }
  | {
      type: 'SERVER_ERROR';
      payload: { status: number };
    };

export type Config = {
  versionListUrl: string;
};

const mapResponse = async (response: Response): Promise<versionListApiResponse> =>
  response.status === 200
    ? {
        type: 'OK',
        payload: await response.json(),
      }
    : {
        type: 'SERVER_ERROR',
        payload: { status: response.status },
      };

export const versionListRequest = (config: Config): Promise<versionListApiResponse> => {
  const opts: RequestInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  };

  return fetch(config.versionListUrl || '', opts)
    .then(mapResponse)
    .catch(() => ({ type: 'NETWORK_ERROR' }));
};
