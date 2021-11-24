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
        'dark:hover:bg-gray-600 hover:bg-gray-200 bg-primary dark:border-dark border-light border-t p-2 w-full text-lg flex'
      }
      onClick={(e?) => onClick(e)}
    >
      <Icon className={'mt-1.5 mr-1.5'} data-testid={testId} />
      {label}
    </button>
  );
};
