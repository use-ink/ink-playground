import { MouseEvent, ReactElement } from 'react';

export type ButtonProps = {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void | null;
  testId?: string;
};

export const ButtonWithIcon = ({ label, Icon, onClick, testId }: ButtonProps): ReactElement => {
  return (
    <button
      className="hover:bg-gray-800 py-1 px-3 rounded text-lg flex"
      onClick={(e?) => onClick(e)}
    >
      <Icon className="mt-1.5 mr-1.5" data-testid={testId} />
      {label}
    </button>
  );
};
