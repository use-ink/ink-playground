import { TArg } from '@paritytech/tailwindcss-classnames';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const defStyle = <S extends Record<string, TArg[] | ((x: any) => TArg[])>>(styles: S): S =>
  styles;
