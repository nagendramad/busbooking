const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server');

test('GET / serves the frontend entry page', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /<!DOCTYPE html>|<html/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
