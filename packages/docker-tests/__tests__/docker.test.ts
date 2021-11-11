import axios from 'axios';
//import * as fs from 'fs';
//import * as path from 'path';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost';

describe('Given the server is up and running', () => {
  test('When a request to the status route is made', async () => {
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

// describe('Given the server provides a working compile endpoint', () => {
//   test('When a compile request is made', async () => {
//     const source = fs
//       .readFileSync(path.join(__dirname, '../../../crates/contract/lib.rs'))
//       .toString();

//     await expect(
//       axios.post(`${BACKEND_URL}/compile`, {
//         source,
//       })
//     ).resolves.toMatchObject({ status: 200, data: { type: 'SUCCESS' } });
//   });
// });
