export const setDarkmode = (payload: boolean): void => {
  const root = window.document.documentElement;
  if (payload) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}