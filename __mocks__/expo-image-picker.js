export const launchImageLibraryAsync = jest.fn(async () => ({
  canceled: false,
  assets: [{ uri: 'mock-image-uri' }],
}));

export const MediaTypeOptions = {
  Images: 'Images',
};
