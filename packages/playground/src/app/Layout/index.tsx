import { Splitter, SplitterPanel } from '@paritytech/components/';
import { TestControls } from '../Console/TestControls';
import { ReactElement } from 'react';

type LayoutProps = {
  Header: () => ReactElement;
  Editor: () => ReactElement;
  Console: () => ReactElement;
};

export const Layout = ({ Header, Editor, Console }: LayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Splitter className="h-full" layout="vertical" gutterSize={6}>
          <SplitterPanel size={80} className="overflow-hidden min-h-0">
            <Editor />
          </SplitterPanel>
          <SplitterPanel size={20} className="overflow-hidden">
            <Console />
          </SplitterPanel>
        </Splitter>
      </div>
      <TestControls />
    </div>
  );
};
