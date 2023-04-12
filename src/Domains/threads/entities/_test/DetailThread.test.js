const DetailThread = require('../DetailThread');

describe('an AddedThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-1234',
      title: 'thread title',
      body: 'thread body',
      date: '2023',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has invalid data type', () => {
    const payload = {
      id: 111,
      title: 666,
      body: {},
      date: 2023,
      username: {},
      comments: 'comments',
    };

    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    const payload = {
      id: 'thread-1234',
      title: 'thread title',
      body: 'thread body',
      date: '2023',
      username: 'username',
      comments: [],
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toEqual(payload.comments);
  });
});
