import { ReactElement, useState } from 'react';
import { MenuItem } from './MenuItem';
export type { MenuItem } from './MenuItem';

export type Props = {
  items: MenuItem[];
};

export const MainMenu = (props: Props): ReactElement => {
  const [dropdownOpen, setDropdownOpen] = useState<null | string>(null);

  return (
    <div>
      {props.items.map((item, index) => (
        <MenuItem
          key={index}
          isOpen={item.id === dropdownOpen}
          triggerSub={() =>
            typeof item.sub === 'function' ? item.sub() : setDropdownOpen(item.id)
          }
          {...item}
        />
      ))}
    </div>
  );
};
