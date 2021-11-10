import axios from 'axios';

describe('Given the docker image is built and running', () => {
  test('When a request to the wrong URL is made', async () => {
    await expect(axios.get('http://foo')).rejects.toThrow(/getaddrinfo/);
  });

  test('When a request to the correct URL is made', async () => {
    await expect(axios.get('http://localhost')).rejects.toThrow(/404/);
  });
});
