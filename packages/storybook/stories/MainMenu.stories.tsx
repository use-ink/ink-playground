import { MainMenu } from 'playground/src/components/MainMenu';
import { ReactElement, useState } from 'react';

const MainMenuWithState = (props: {}) => {
  const [dropdownOpen, setDropdownOpen] = useState<undefined | number>();

  return (
    <MainMenu
      openId={dropdownOpen}
      items={[
        { label: 'Compile', icon: '', onClick: () => {} },
        { label: 'Share', icon: '', onClick: () => {} },
        {
          label: 'Settings',
          icon: '',
          sub: {
            content: '',
            trigger: () => setDropdownOpen(1),
          },
        },
      ]}
    />
  );
};

export default {
  title: 'Example/MainMenu',
  component: MainMenuWithState,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = args => <MainMenuWithState {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
