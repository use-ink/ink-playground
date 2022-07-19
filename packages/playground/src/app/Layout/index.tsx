import { Splitter, SplitterPanel } from '@paritytech/components/';
import { ReactElement } from 'react';

type LayoutProps = {
  header: ReactElement;
  editor: ReactElement;
  console: ReactElement;
};

export const Layout = ({ header, editor, console }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      {header}
      <div className="flex-grow">
        <Splitter className="h-full" layout="vertical" gutterSize={6}>
          <SplitterPanel size={80} className="overflow-hidden min-h-0">
            {editor}
          </SplitterPanel>
          <SplitterPanel size={20} className="overflow-hidden">
            {console}
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  );
};
