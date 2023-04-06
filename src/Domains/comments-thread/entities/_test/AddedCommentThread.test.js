const AddedCommentThread = require('../AddedCommentThread');

describe('a AddedCommentThread entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'comment-1111111',
      content: 'some comment',
    };

    // action & assert
    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      content: 145,
      owner: {},
    };

    // action & assert
    expect(() => new AddedCommentThread(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedCommentThread object properly', () => {
    const payload = {
      id: 'comment-1111111',
      content: 'somekind content',
      owner: 'user-1111111111',
    };

    const addedCommentThread = new AddedCommentThread(payload);
    expect(addedCommentThread.id).toEqual(payload.id);
    expect(addedCommentThread.content).toEqual(payload.content);
    expect(addedCommentThread.owner).toEqual(payload.owner);
  });
});
