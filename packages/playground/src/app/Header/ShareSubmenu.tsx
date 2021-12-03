import { ButtonWithIcon, LabeledLink } from '@paritytech/components/';
import { ReactElement, useContext } from 'react';
import { GithubIcon } from '~/symbols';
import { Dispatch, GistState, State } from '~/context/app/reducer';
import { gistCreate } from '~/context/side-effects/create-gist';
import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { MessageState, MessageDispatch } from '~/context/messages/reducer';
import { Gist, GistCreateResponse } from '@paritytech/commontypes';
import { GistCreateApiResponse } from '@paritytech/ink-editor/api/gists';
import qs from 'qs';

const ViewError = ({ message }: { message: string }) => <div>{message}</div>;

const ViewGist = ({ gist }: { gist: Gist }) => (
  <>
    <LabeledLink label="Link to Playground:" link={gitPlaygroundUrl(gist.id)} />
    <LabeledLink label="Link to GitHub Gist:" link={gist.url} />
  </>
);

const gitPlaygroundUrl = (id: string): string => {
  return `${window.location.origin}/?${qs.stringify({ id })}`;
};

const GistCreateResponse = ({ response }: { response: GistCreateResponse }): ReactElement => {
  switch (response.type) {
    case 'SUCCESS':
      return <ViewGist gist={response.payload} />;
    case 'ERROR':
      return <ViewError message={`Gist creation error: ${response.payload}`} />;
  }
};

const ApiResponse = ({ response }: { response: GistCreateApiResponse }): ReactElement => {
  switch (response.type) {
    case 'OK':
      return <GistCreateResponse response={response.payload} />;
    case 'NETWORK_ERROR':
      return <ViewError message="Network Error" />;
    case 'SERVER_ERROR':
      return <ViewError message="Server Error" />;
  }
};

const GistState = ({ gistState }: { gistState: GistState }): ReactElement | null => {
  switch (gistState.type) {
    case 'NOT_ASKED':
      return null;
    case 'IN_PROGRESS':
      return null;
    case 'RESULT':
      return <ApiResponse response={gistState.payload} />;
  }
};

export const ShareSubmenu = (): ReactElement => {
  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

  const isLoading = state.gist.type === 'IN_PROGRESS';

  return (
    <>
      <h2 className="px-4 pt-1 pb-2">Share Options</h2>
      <ButtonWithIcon
        label={'Create GitHub Gist'}
        Icon={GithubIcon}
        testId={'buttonIcon'}
        onClick={() => {
          gistCreate(state, dispatch, dispatchMessage);
        }}
        isMenuOption={true}
        loading={isLoading}
      />
      <GistState gistState={state.gist} />
    </>
  );
};
