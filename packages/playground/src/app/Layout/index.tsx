import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="overflow-hidden">{children}</div>;
};
