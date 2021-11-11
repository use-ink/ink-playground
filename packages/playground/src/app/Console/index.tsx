import { ReactElement } from 'react';
import { ConsoleMessages } from './ConsoleMessages';

export const Console = (): ReactElement => {
  return (
    <div className="h-full w-full relative">
      <div className="dark:text-primary dark:bg-primary text-light text-sm subpixel-antialiased leading-normal px-5 pt-4 pb-4 shadow-lg overflow-y-scroll h-full w-full absolute">
        <ConsoleMessages />
      </div>
    </div>
  );
};
