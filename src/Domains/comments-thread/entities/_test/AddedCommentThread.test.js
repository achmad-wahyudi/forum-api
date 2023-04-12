const AddedCommentThread = require('../AddedCommentThread');

describe('a AddedCommentThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1111111',
      content: 'content comment',
    };

    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      content: 145,
      owner: {},
    };

    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedCommentThread object properly', () => {
    const payload = {
      id: 'comment-1111111',
      content: 'content comment',
      owner: 'user-1111111111',
    };

    const addedCommentThread = new AddedCommentThread(payload);
    expect(addedCommentThread.id).toEqual(payload.id);
    expect(addedCommentThread.content).toEqual(payload.content);
    expect(addedCommentThread.owner).toEqual(payload.owner);
  });
});
