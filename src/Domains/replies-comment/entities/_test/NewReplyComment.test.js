const NewReplyComment = require('../NewReplyComment');

describe('a NewReplyComment entity', () => {
  it('should throw error if payload does not meeet criteria', () => {
    // arrange
    const payload = {
      commentId: 'comment-1111111',
      owner: 'user-1111111111',
    };

    // action & assert
    expect(() => new NewReplyComment(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      commentId: 234,
      content: {},
      owner: 123,
    };

    // action & assert
    expect(() => new NewReplyComment(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReplyComment object properly', () => {
    const payload = {
      commentId: 'comment-1111111',
      content: 'some reply',
      owner: 'user-1111111111',
    };

    const newReplyComment = new NewReplyComment(payload);
    expect(newReplyComment.commentId).toEqual(payload.commentId);
    expect(newReplyComment.content).toEqual(payload.content);
    expect(newReplyComment.owner).toEqual(payload.owner);
  });
});
