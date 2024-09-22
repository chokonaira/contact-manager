const mockAsyncStorage = {
  getItem: jest.fn(() => {
    return Promise.resolve(null);
  }),
  setItem: jest.fn(() => {
    return Promise.resolve();
  }),
  removeItem: jest.fn(() => {
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => {
    return Promise.resolve([]);
  }),
  multiGet: jest.fn(() => {
    return Promise.resolve([]);
  }),
};

export default mockAsyncStorage;
