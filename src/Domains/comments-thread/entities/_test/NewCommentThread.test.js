const NewCommentThread = require('../NewCommentThread');

describe('a NewCommentThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      content: 'some comment',
      threadId: 'thread-11111111,',
      userId: 'user-1111111111',
    };

    // action & assert
    expect(() => new NewCommentThread(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      content: {},
      threadId: 123,
      owner: 456,
      username: {},
    };

    // action & assert
    expect(() => new NewCommentThread(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewCommentThread object properly', () => {
    const payload = {
      content: 'some kind of body',
      threadId: 'thread-11111111',
      owner: 'user-1111111111',
      username: 'John Doe',
    };

    const newCommentThread = new NewCommentThread(payload);
    expect(newCommentThread.content).toEqual(payload.content);
    expect(newCommentThread.threadId).toEqual(payload.threadId);
    expect(newCommentThread.owner).toEqual(payload.owner);
  });
});
