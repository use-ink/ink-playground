import { Splitter, SplitterPanel } from '@paritytech/components/';
import { TestControls } from '../Console/TestControls';

type LayoutProps = {
  Header: React.FC;
  Editor: React.FC;
  Console: React.FC;
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
