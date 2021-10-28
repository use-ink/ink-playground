import { TArg } from '@paritytech/tailwindcss-classnames';

export const defStyle = <S extends Record<string, TArg[] | ((x: any) => TArg[])>>(styles: S): S =>
  styles;
