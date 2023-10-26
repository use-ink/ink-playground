import { versionListRequest } from '@paritytech/ink-editor/api/version';
import { State, Dispatch as AppDispatch } from '~/context/app/reducer';
import { VERSION_LIST_URL } from '~/env';

type Dispatch = {
  app: AppDispatch;
};

export async function loadVersionList(state: State, dispatch: Dispatch) {
  // const { versionList: versions } = state;
  const result = await versionListRequest({ versionListUrl: VERSION_LIST_URL || '' });

  if (result.type === 'OK' && result.payload.type === 'SUCCESS') {
    dispatch.app({
      type: 'SET_VERSIONS_STATE',
      payload: result.payload.payload.versions,
    });
  } else {
    dispatch.app({
      type: 'SET_VERSIONS_STATE',
      payload: [],
    });
  }
}

export async function setVersion(version: string, state: State, dispatch: Dispatch) {
  const { versionList: versions } = state;
  if (!version) {
    version = versions.length > 0 && versions[0] ? versions[0] : '';
  }

  dispatch.app({
    type: 'SET_VERSION_STATE',
    payload: version,
  });
}