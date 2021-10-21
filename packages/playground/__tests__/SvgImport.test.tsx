import Logo from '~/assets/ink-logo-on-dark.svg';

test('should import svg as React component', () => {
  expect(Logo).toEqual('ink-logo-on-dark.svg');
});
