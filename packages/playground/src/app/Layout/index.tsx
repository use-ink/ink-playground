import { Splitter, SplitterPanel } from '@paritytech/components/';

type LayoutProps = {
  Header: React.FunctionComponent;
  Editor: React.FunctionComponent;
  Console: React.FunctionComponent;
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
    </div>
  );
};
