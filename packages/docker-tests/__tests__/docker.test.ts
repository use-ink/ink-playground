import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';

describe('Given the server is up and running', () => {
  test('When a request to the correct URL is made', async () => {
    await expect(axios.get(`${BACKEND_URL}/status`)).resolves.toMatchObject({
      status: 200,
      data: 'ink-backend is live',
    });
  });
});

describe('Given the server provides the built frontend', () => {
  test('When a request is made', async () => {
    await expect(axios.get(`${BACKEND_URL}/`)).resolves.toHaveProperty('status', 200);
  });
});
