import { Splitter, SplitterPanel } from '@paritytech/components/';

type LayoutProps = {
  Header: React.FunctionComponent;
  Editor: React.FunctionComponent;
  Console: React.FunctionComponent;
};

export const Layout = ({ Header, Editor, Console }: LayoutProps) => {
  return (
    <div className="overflow-hidden">
      <Header />
      <Splitter className="content" layout="vertical" gutterSize={6}>
        <SplitterPanel size={80} minSize={0}>
          <Editor />
        </SplitterPanel>
        <SplitterPanel size={20} minSize={0}>
          <Console />
        </SplitterPanel>
      </Splitter>
    </div>
  );
};
