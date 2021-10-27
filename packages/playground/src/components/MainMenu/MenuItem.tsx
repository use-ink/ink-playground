import { ReactElement, ReactNode } from 'react';
import type { MenuItem as MenuItem_, Id } from '.';

export type Props = MenuItem_ & {
  id: Id;
  openId?: Id;
};

export const MenuItem = (props: Props): ReactElement => {
  return (
    <div style={{ border: '1px solid red' }}>
      <button
        onClick={() => {
          props.onClick && props.onClick();
          props.sub && props.sub.trigger(props.id);
        }}
      >
        Text
      </button>
      <div>{props.sub && props.openId === props.id && props.sub.content}</div>
    </div>
  );
};
