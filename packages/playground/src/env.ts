export const COMPILE_URL: string | undefined = process.env.COMPILE_URL;

export const TESTING_URL: string | undefined = process.env.TESTING_URL;

export const GIST_CREATE_URL: string | undefined = process.env.GIST_CREATE_URL;

export const GIST_LOAD_URL: string | undefined = process.env.GIST_LOAD_URL;

export const CONTRACTS_UI_URL: string =
  process.env.CONTRACTS_UI_URL || 'https://paritytech.github.io/contracts-ui/';

export const INK_DOCS_URL: string =
  process.env.INK_DOCS_URL || 'https://paritytech.github.io/ink-docs/';

export const REPO_URL: string =
  process.env.REPO_URL || 'https://github.com/paritytech/ink-playground';

export const NODE_ENV = process.env.NODE_ENV as 'production' | 'development';
