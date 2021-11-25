import { ButtonWithIcon, LabeledLink } from '@paritytech/components/';
import { ReactElement, useContext, useState } from 'react';
import { GithubIcon } from '~/symbols';
import { Dispatch, State } from '~/context/app/reducer';
import { gistCreate } from '~/context/app/side-effects/gists/create';
import { AppContext } from '~/context/app/';
import { MessageContext } from '~/context/messages/';
import { MessageState, MessageDispatch } from '~/context/messages/reducer';

const playgroundLink = 'https://ink-playground.netlify.app/?id=375eb5406914a37d5009842811f4f426';
const gistLink = 'https://gist.github.com/375eb5406914a37d5009842811f4f426';

export const ShareSubmenu = (): ReactElement => {
  const [isLoading] = useState(false);

  const [state, dispatch]: [State, Dispatch] = useContext(AppContext);
  const [, dispatchMessage]: [MessageState, MessageDispatch] = useContext(MessageContext);

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
      {true && (
        <>
          <LabeledLink label="Link to Playground:" link={playgroundLink} />
          <LabeledLink label="Link to GitHub Gist:" link={gistLink} />
        </>
      )}
    </>
  );
};
