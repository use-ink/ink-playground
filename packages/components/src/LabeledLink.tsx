import { ReactElement } from 'react';

export type LabeledLinkProps = {
  label: string;
  link: string;
};

export const LabeledLink = ({ label, link }: LabeledLinkProps): ReactElement => {
  return (
    <div className="dark:bg-elevation dark:border-dark border-light border-t last:rounded-b py-2 px-4 w-full text-lg">
      <p className="text-sm mt-1 mb-2 whitespace-nowrap">{label}</p>
      <div className="dark:bg-primary dark:border-dark bg-gray-200 border-light last:rounded-b py-2 px-4 w-full text-lg flex justify-between items-center rounded">
        <a href={link} target="_blank" className="text-sm">
          {link}
        </a>
        <button
          onClick={() => {
            // Maybe we could use an extra lib for that
            navigator.clipboard.writeText(link);
          }}
        >
          <i className="pi pi-copy ml-4" />
        </button>
      </div>
    </div>
  );
};
