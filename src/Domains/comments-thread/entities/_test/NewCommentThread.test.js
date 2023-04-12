const NewCommentThread = require('../NewCommentThread');

describe('a NewCommentThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'content comment',
      threadId: 'thread-11111111,',
      userId: 'user-1111111111',
    };

    expect(() => new NewCommentThread(payload)).toThrowError('NEW_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      content: {},
      threadId: 1234,
      owner: 1111,
      username: {},
    };

    expect(() => new NewCommentThread(payload)).toThrowError('NEW_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewCommentThread object properly', () => {
    const payload = {
      content: 'content comment',
      threadId: 'thread-11111111',
      owner: 'user-1111111111',
      username: 'username',
    };

    const newCommentThread = new NewCommentThread(payload);
    expect(newCommentThread.content).toEqual(payload.content);
    expect(newCommentThread.threadId).toEqual(payload.threadId);
    expect(newCommentThread.owner).toEqual(payload.owner);
  });
});
