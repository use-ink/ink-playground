import { ReactElement, MouseEvent } from 'react';
import tailwindConfig from '../../playground/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';
import { TailwindConfig } from 'tailwindcss/tailwind-config';

// The types comming from Tailwind do not play along nicely with custom fonts
const fullConfig = resolveConfig(tailwindConfig as unknown as TailwindConfig);

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
}: ButtonProps): ReactElement => {
  const disabledClasses = disabled || loading ? 'cursor-not-allowed opacity-60' : '';

  const iconLeft = 'mt-1.5 mr-1.5 w-4';
  const iconRight = 'mt-px4 ml-2 w-5';

  // Get shades of gray from tailwind config
  type Colors = { gray: Record<string, string> };
  const colors = fullConfig.theme.colors as Colors;
  const gray600 = colors.gray['600'];
  const gray200 = colors.gray['200'];

  const IconOfState = ({ style }: { style: string }): ReactElement => {
    const spinnerIcon = `pi pi-spinner animate-spin ${style}`;
    const disabledIcon = `dark:text-gray-600 text-gray-400 ${style}`;

    if (loading) return <i className={spinnerIcon} data-testid={'icon-loading'} />;
    if (disabled) return <Icon color={gray600} className={disabledIcon} data-testid={testId} />;
    return <Icon color={gray200} className={style} data-testid={testId} />;
  };

  const menuOptionStyle =
    'dark:hover:bg-elevation-3 bg-gray-100 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg flex whitespace-nowrap';

  const buttonStyle =
    'dark:hover:bg-elevation hover:bg-gray-200 py-1 px-3 mr-1 rounded text-lg flex whitespace-nowrap';

  return (
    <button
      disabled={disabled || loading}
      className={`${disabledClasses} ${isMenuOption ? menuOptionStyle : buttonStyle}`}
      onClick={(e?) => onClick(e)}
    >
      {!placeIconRight && <IconOfState style={iconLeft} />}
      {label}
      {placeIconRight && <IconOfState style={iconRight} />}
    </button>
  );
};
