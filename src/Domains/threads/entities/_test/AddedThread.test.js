const AddedThread = require('../AddedThread');

describe('an AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-1234',
      title: 'thread title',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      id: 'thread-1234',
      title: 1222,
      owner: true,
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedThread object correctly', () => {
    const payload = {
      id: 'thread-1234',
      title: 'thread title',
      owner: 'John Doe',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
