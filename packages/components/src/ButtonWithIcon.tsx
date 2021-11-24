import { ReactElement, MouseEvent } from 'react';

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
};

export const ButtonWithIcon = ({
  label,
  Icon,
  onClick,
  testId,
  disabled,
  loading,
  isMenuOption = false,
}: ButtonProps): ReactElement => {
  const disabledClasses =
    disabled || loading
      ? 'cursor-not-allowed dark:text-gray-600 text-gray-400 dark:bg-elevation bg-gray-200'
      : '';

  const IconOfState = (): ReactElement => {
    const iconStyle = 'mt-1.5 mr-1.5 w-4';
    const spinnerIcon = `pi pi-spinner animate-spin ${iconStyle}`;
    const disabledIcon = `pi pi-ban ${iconStyle}`;

    if (loading) return <i className={spinnerIcon} data-testid={'icon-loading'} />;
    if (disabled) return <i className={disabledIcon} data-testid={'icon-disabled'} />;
    return <Icon className={iconStyle} data-testid={testId} />;
  };

  const menuOptionStyle =
    'dark:hover:bg-elevation-3 bg-gray-100 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg flex';

  const buttonStyle =
    'dark:hover:bg-elevation hover:bg-gray-200 py-1 px-3 mr-1 rounded text-lg flex';

  return (
    <button
      disabled={disabled || loading}
      className={`${disabledClasses} ${isMenuOption ? menuOptionStyle : buttonStyle}`}
      onClick={(e?) => onClick(e)}
    >
      <IconOfState />
      {label}
    </button>
  );
};
