import { CompileApiResponse, compileRequest } from '~/api/compile';
import { State, Dispatch } from '../../reducer';
import { MessageAction, MessageDispatch } from '../../../messages/reducer';

export async function gistCreate(
  state: State,
  dispatch: Dispatch,
  dispatchMessage: MessageDispatch
) {
  console.log('hello');
}
