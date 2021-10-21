import { ReactElement } from 'react';
import CompileIcon from '~/assets/compile.svg';

export const Compile = (): ReactElement => {
  return (
    <>
      <button className="navbarButton">
        <CompileIcon className="mt-1.5 mr-1.5" />
        Compile
      </button>
    </>
  );
};
