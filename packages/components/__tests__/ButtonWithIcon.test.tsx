import { ButtonWithIcon } from '../src';
import { render, screen } from '@testing-library/react';
import DemoSvg from '~/assets/DemoSvg';

describe('Given the ButtonWithIcon component is rendered', () => {
  let wasClicked: () => void;

  beforeEach(() => {
    wasClicked = jest.fn();
    render(
      <ButtonWithIcon
        label="testButton"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        onClick={() => {
          wasClicked();
        }}
      />
    );
  });

  test('When Button appears on screen', async () => {
    // Given, When
    const testButton = await screen.findByText('testButton');
    const buttonIconElement = await screen.findByTestId('buttonIcon');

    // Then ...
    expect(testButton).toBeInTheDocument();
    expect(buttonIconElement).toBeInTheDocument();
  });

  test('When Button is clicked', async () => {
    // Given
    const testButton = await screen.findByText('testButton');
    // When
    testButton.click();
    // Then ...
    expect(wasClicked).toBeCalledTimes(1);
  });
});

describe('Given Button states were changed', () => {
  test('Given Button is rendered in disabled state', async () => {
    // Given, When
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonDisabled"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        disabled={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonDisabled');

    // Then ...
    expect(testButton).toBeInTheDocument();
    expect(testButton).toHaveClass('cursor-not-allowed');
  });

  test('Given disabled Button is clicked', async () => {
    // Given
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonDisabled"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        disabled={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonDisabled');

    // When
    testButton.click();

    // Then ...
    expect(wasClicked).toBeCalledTimes(0);
  });

  test('Given Button is rendered in loading state', async () => {
    // Given, When
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonLoading"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        loading={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonLoading');
    const loadingIcon = await screen.findByTestId('icon-loading');

    // Then ...
    expect(testButton).toBeInTheDocument();
    expect(testButton).toHaveClass('cursor-not-allowed');
    expect(loadingIcon).toBeInTheDocument();
  });

  test('Given loading Button is clicked', async () => {
    // Given
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonLoading"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        loading={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonLoading');

    // When
    testButton.click();

    // Then ...
    expect(wasClicked).toBeCalledTimes(0);
  });

  test('Given Button is rendered in loading AND disabled state', async () => {
    // Given, When
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonLoadingDisabled"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        loading={true}
        disabled={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonLoadingDisabled');
    const loadingIcon = await screen.findByTestId('icon-loading');

    // Then ...
    expect(testButton).toBeInTheDocument();
    expect(testButton).toHaveClass('cursor-not-allowed');
    expect(loadingIcon).toBeInTheDocument();
  });

  test('Given loading AND disabled Button is clicked', async () => {
    // Given
    const wasClicked: () => void = jest.fn();
    render(
      <ButtonWithIcon
        label="testButtonLoadingDisabled"
        Icon={DemoSvg}
        darkmode={true}
        testId={'buttonIcon'}
        loading={true}
        disabled={true}
        onClick={() => {
          wasClicked();
        }}
      />
    );
    const testButton = await screen.findByText('testButtonLoadingDisabled');

    // When
    testButton.click();

    // Then ...
    expect(wasClicked).toBeCalledTimes(0);
  });
});
