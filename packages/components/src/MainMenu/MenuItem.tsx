import { ReactElement, MouseEvent } from 'react';
import * as MainMenu from '.';
import { ButtonWithIcon } from '@paritytech/components/ButtonWithIcon';

export interface Props extends MainMenu.Props, MainMenu.MenuItem {
  id: MainMenu.Id;
}

const isOpen = (props: Props): boolean => props.state.openId === props.id;

const buttonClick =
  (props: Props) =>
  (e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
    if (props.onClick) props.onClick(e);

    if (!props.subContent) return;

    const action: MainMenu.Action = isOpen(props)
      ? { type: 'CLOSE_SUBMENU' }
      : { type: 'OPEN_SUBMENU', payload: { id: props.id } };

    props.dispatch(action);
  };

export const MenuItem = (props: Props): ReactElement => {
  return (
    <div>
      <ButtonWithIcon label={props.label} Icon={props.icon} onClick={buttonClick(props)} />
      <div>{props.subContent && isOpen(props) && props.subContent()}</div>
    </div>
  );
};
