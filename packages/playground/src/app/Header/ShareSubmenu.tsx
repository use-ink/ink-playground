import { ButtonWithIcon, LabeledLink } from '@paritytech/components/';
import { ReactElement, ReactNode, useContext, useState } from 'react';
import { GithubIcon } from '~/symbols';
import { Dispatch, GistState, State } from '~/context/app/reducer';
import { gistCreate } from '~/context/app/side-effects/gists/create';
import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { MessageState, MessageDispatch } from '~/context/messages/reducer';
import { Gist, GistCreateResponse } from '@paritytech/commontypes';
import { GistCreateApiResponse } from '~/api/gists';

const playgroundLink = 'https://ink-playground.netlify.app/?id=375eb5406914a37d5009842811f4f426';
const gistLink = 'https://gist.github.com/375eb5406914a37d5009842811f4f426';

const ViewError = ({ message }: { message: string }) => <div>Opps!</div>;

const ViewGist = ({ gist }: { gist: Gist }) => (
  <>
    <LabeledLink label="Link to Playground:" link={playgroundLink} />
    <LabeledLink label="Link to GitHub Gist:" link={gistLink} />
  </>
);

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
