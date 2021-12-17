import { CompileApiResponse, compileRequest } from '@paritytech/ink-editor/api/compile';
import { State, Dispatch } from '~/context/app/reducer';
import { MessageAction, MessageDispatch } from '~/context/messages/reducer';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { RUST_FORMAT_URL } from '~/env';


export async function rustFormat(state: State, dispatch: Dispatch, dispatchMessage: MessageDispatch) {
  if (state.compile.type === 'IN_PROGRESS') return;


}
