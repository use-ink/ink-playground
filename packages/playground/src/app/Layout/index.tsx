import React, { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div style={{ overflow: 'hidden' }}>{children}</div>;
};
