import { TClasses } from '@paritytech/tailwindcss-classnames';

type Prefix = 'dark';

type TArg = TClasses | `${Prefix}:${TClasses}`;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const defStyles = <S extends Record<string, TArg[] | ((x: any) => TArg[])>>(styles: S): S =>
  styles;

export const classnames = (...args: TArg[][]): string => args.map(arg => arg.join(' ')).join(' ');
