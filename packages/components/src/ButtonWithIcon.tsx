import { ReactElement, MouseEvent } from 'react';

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
  testId?: string;
};

export const ButtonWithIcon = ({ label, Icon, onClick, testId }: ButtonProps): ReactElement => {
  return (
    <button
      className={
        'dark:hover:bg-elevation hover:bg-gray-200 bg-primary py-1 px-3 mr-1 rounded text-lg flex'
      }
      onClick={(e?) => onClick(e)}
    >
      <Icon className={'mt-1.5 mr-1.5'} data-testid={testId} />
      {label}
    </button>
  );
};
