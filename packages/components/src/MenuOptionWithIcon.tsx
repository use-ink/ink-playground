import { ReactElement, MouseEvent } from 'react';

export type MenuOptionProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void | Promise<void> | null;
  testId?: string;
};

export const MenuOptionWithIcon = ({
  label,
  Icon,
  onClick,
  testId,
}: MenuOptionProps): ReactElement => {
  return (
    <button
      className={
        'dark:hover:bg-elevation-3 hover:bg-gray-200 dark:bg-elevation-1 dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg flex '
      }
      onClick={(e?) => onClick(e)}
    >
      <Icon className={'mt-1.5 mr-3 w-4'} data-testid={testId} />
      {label}
    </button>
  );
};
