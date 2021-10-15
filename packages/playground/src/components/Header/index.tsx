import { ReactElement } from 'react';

export const Header = (): ReactElement => {
  return (
    <div className="bg-primary text-primary flex">
      <h2>Header</h2>
      <button>Settings</button>
    </div>
  );
};
