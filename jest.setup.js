global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ items: [{ name: "test-result" }] }]),
  })
);
