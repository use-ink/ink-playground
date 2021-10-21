import { ReactElement } from 'react';
import DownloadIcon from '~/assets/download.svg';

export const Download = (): ReactElement => {
  return (
    <>
      <button className="navbarButton">
        <DownloadIcon className="mt-1.5 mr-1.5" />
        Download
      </button>
    </>
  );
};
