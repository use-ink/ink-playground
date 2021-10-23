export const COMPILE_URL = (() => {
  if (!process.env.COMPILE_URL) throw new Error('Compile URL not available!');
  return process.env.COMPILE_URL;
})();
