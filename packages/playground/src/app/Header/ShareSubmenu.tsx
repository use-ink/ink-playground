import { ButtonWithIcon, LabeledLink } from '@paritytech/components/';
import { ReactElement, useState } from 'react';
import { GithubIcon } from '~/symbols';

const playgroundLink = 'https://ink-playground.netlify.app/?id=375eb5406914a37d5009842811f4f426';
const gistLink = 'https://gist.github.com/375eb5406914a37d5009842811f4f426';

export const ShareSubmenu = (): ReactElement => {
  const [showDemoComponent, setShowDemoComponent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDemoAfterTimeout = (): void => {
    setIsLoading(true);
    setShowDemoComponent(false);
    setTimeout(() => {
      setShowDemoComponent(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <h2 className="px-4 pt-1 pb-2">Share Options</h2>
      <ButtonWithIcon
        // non-breaking space "\u00A0"
        label={'Create\u00A0GitHub\u00A0Gist'}
        Icon={GithubIcon}
        testId={'buttonIcon'}
        onClick={() => {
          showDemoAfterTimeout();
        }}
        isMenuOption={true}
        loading={isLoading}
      />
      {showDemoComponent && (
        <>
          <LabeledLink label="Link to Playground:" link={playgroundLink} />
          <LabeledLink label="Link to GitHub Gist:" link={gistLink} />
        </>
      )}
    </>
  );
};
