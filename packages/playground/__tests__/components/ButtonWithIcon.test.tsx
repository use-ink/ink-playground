import { ButtonWithIcon } from '../../../components/src/';
import { render, screen } from '@testing-library/react';
import { buttonIcon } from '~/ids';
import DemoSvg from '~/assets/DemoSvg';

describe('Given the ButtonWithIcon component is rendered', () => {
  let wasClicked: () => void;

  beforeEach(() => {
    wasClicked = jest.fn();
    render(
      <ButtonWithIcon
        label="testButton"
        Icon={DemoSvg}
        testId={buttonIcon}
        onClick={() => {
          wasClicked();
        }}
      />
    );
  });

  test('When Button appears on screen', async () => {
    const testButton = await screen.findByText('testButton');
    const buttonIconElement = await screen.findByTestId(buttonIcon);

    // Then ...
    expect(testButton).toBeInTheDocument();
    expect(buttonIconElement).toBeInTheDocument();
  });

  test('When Button is clicked', async () => {
    const testButton = await screen.findByText('testButton');
    testButton.click();

    // Then ...
    expect(wasClicked).toBeCalledTimes(1);
  });
});
