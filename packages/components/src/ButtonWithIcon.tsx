import { ReactElement, MouseEvent } from 'react';
import { classnames } from 'tailwindcss-classnames';

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void | null;
  testId?: string;
};

export const ButtonWithIcon = ({ label, Icon, onClick, testId }: ButtonProps): ReactElement => {
  return (
    <button
      className={classnames(
        // 'dark:hover:bg-elevation',
        'hover:bg-gray-200',
        'py-1',
        'px-3',
        'mr-1',
        'rounded',
        'text-lg',
        'flex'
      )}
      onClick={(e?) => onClick(e)}
    >
      <Icon className={classnames('mt-1.5', 'mr-1.5')} data-testid={testId} />
      {label}
    </button>
  );
};
