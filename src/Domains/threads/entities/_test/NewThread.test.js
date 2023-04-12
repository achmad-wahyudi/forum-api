const NewThread = require('../NewThread');

describe('a NewThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'thread title',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      title: 11112,
      body: true,
      owner: {},
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'thread title',
      body: 'thread body',
      owner: 'user-1234',
    };

    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
