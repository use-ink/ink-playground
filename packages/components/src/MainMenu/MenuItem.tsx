import { ReactElement } from 'react';
import * as MainMenu from '.';

export interface Props extends MainMenu.Props, MainMenu.MenuItem {
  id: MainMenu.Id;
}

const isOpen = (props: Props): boolean => props.state.openId === props.id;

const buttonClick = (props: Props) => (): void => {
  if (props.onClick) props.onClick();

  if (!props.subContent) return;

  const action: MainMenu.Action = isOpen(props)
    ? { type: 'CLOSE_SUBMENU' }
    : { type: 'OPEN_SUBMENU', payload: { id: props.id } };

  props.dispatch(action);
};

export const MenuItem = (props: Props): ReactElement => {
  return (
    <div style={{ border: '1px solid red' }}>
      <button onClick={buttonClick(props)}>
        {props.label} {isOpen(props) ? 'X' : ''}
      </button>
      <div>{props.subContent && isOpen(props) && props.subContent()}</div>
    </div>
  );
};
