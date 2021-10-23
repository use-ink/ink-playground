import { CompileRequest, CompileResponse } from './commontypes';
import { COMPILE_URL } from './env';

type ApiResponse<Res> =
  | {
      type: 'API_RESPONSE_OK';
      payload: Res;
    }
  | {
      type: 'API_RESPONSE_ERR';
      payload: { message: string };
    };

const fetchApi =
  <Req, Res>(url: string) =>
  (data: Req): Promise<ApiResponse<Res>> =>
    fetch(COMPILE_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ source: 'rust source code' }),
    })
      .then(async response =>
        response.status === 200
          ? ({
              type: 'API_RESPONSE_OK',
              payload: await response.json(),
            } as ApiResponse<Res>)
          : ({
              type: 'API_RESPONSE_ERR',
              payload: { message: 'Server error' },
            } as ApiResponse<Res>)
      )
      .catch(
        () =>
          ({ type: 'API_RESPONSE_ERR', payload: { message: 'Network error' } } as ApiResponse<Res>)
      );

const compile = fetchApi<CompileRequest, CompileResponse>(COMPILE_URL);
