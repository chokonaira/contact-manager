const mockContacts = {
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getContactsAsync: jest.fn(() => Promise.resolve({
    data: [
      {
        id: '1',
        name: 'John Doe',
        phoneNumbers: [{ number: '123456789' }],
        emails: [{ email: 'john@example.com' }],
      },
    ],
  })),
};

export default mockContacts;
