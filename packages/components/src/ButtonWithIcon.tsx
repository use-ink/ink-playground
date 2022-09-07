import { ReactElement, MouseEvent } from 'react';
import { Tooltip } from 'primereact/tooltip';

import tailwindConfig from '../../playground/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';

// The types from Tailwind do not play along nicely with custom fonts
const fullConfig = resolveConfig(tailwindConfig as any) as TailwindConfig;

// Get colors from tailwind config
export type Colors = {
  gray: Record<string, string>;
  green: Record<string, string>;
  blue: Record<string, string>;
  yellow: Record<string, string>;
  red: Record<string, string>;
};

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
  isMenuOption?: boolean;
  placeIconRight?: boolean;
  tooltipContent?: string;
  iconColor?: { color: keyof Colors; shade: string };
  darkmode?: boolean;
};

export const ButtonWithIcon = ({
  label,
  Icon,
  onClick,
  testId,
  disabled,
  loading,
  isMenuOption = false,
  placeIconRight = false,
  tooltipContent = '',
  iconColor,
  darkmode = true,
}: ButtonProps): ReactElement => {
  const disabledClasses = disabled || loading ? 'cursor-not-allowed opacity-60' : '';

  const iconLeft = 'mr-1.5 w-4';
  const iconRight = 'mt-px4 ml-2 w-5';

  const IconOfState = ({ style }: { style: string }): ReactElement => {
    const spinnerIcon = `pi pi-spinner animate-spin ${style}`;
    const disabledIcon = `${style}`;

    const colors = fullConfig.theme.colors as Colors;
    // Icon colors
    const grayDark = colors.gray['200'];
    const grayLight = colors.gray['600'];
    const grayIcon = darkmode ? grayDark : grayLight;
    // Icon colors contract size
    const sizeColor = iconColor ? colors[iconColor.color][iconColor.shade] : grayIcon;

    if (loading) return <i className={spinnerIcon} data-testid={'icon-loading'} />;
    if (disabled) return <Icon color={sizeColor} className={disabledIcon} data-testid={testId} />;
    return <Icon color={sizeColor} className={style} data-testid={testId} />;
  };

  const menuOptionStyle =
    'dark:hover:bg-elevation-3 bg-gray-100 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full flex whitespace-nowrap';

  const buttonStyle =
    'dark:hover:bg-elevation hover:bg-gray-200 p-1.5 px-3 mr-1 rounded flex justify-center items-center whitespace-nowrap m-auto';

  // create an identifier, because otherwise tooltip would render
  // multiple times, for all button occurrences in the app
  const tooltipTargetIdentifier = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

  // Build a unique class name as target for the tooltip
  const tooltipTarget = 'tooltip-button-' + tooltipTargetIdentifier;

  const mergedButtonClasses = `${tooltipTarget} ${disabledClasses} ${
    isMenuOption ? menuOptionStyle : buttonStyle
  }`;

  return (
    <>
      {tooltipContent && (
        <Tooltip
          target={`.${tooltipTarget}`}
          position="bottom"
          autoHide={false}
          className="custom-tooltip"
        >
          {tooltipContent}
        </Tooltip>
      )}
      <button
        disabled={disabled || loading}
        className={mergedButtonClasses}
        onClick={(e?) => onClick(e)}
      >
        {!placeIconRight && <IconOfState style={iconLeft} />}
        {label}
        {placeIconRight && <IconOfState style={iconRight} />}
      </button>
    </>
  );
};
