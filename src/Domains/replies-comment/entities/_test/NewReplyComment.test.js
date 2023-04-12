const NewReplyComment = require('../NewReplyComment');

describe('a NewReplyComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-1111111',
      owner: 'user-1111111111',
    };

    expect(() => new NewReplyComment(payload)).toThrowError('NEW_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      commentId: 222,
      content: {},
      owner: 1,
    };

    expect(() => new NewReplyComment(payload)).toThrowError('NEW_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReplyComment object properly', () => {
    const payload = {
      commentId: 'comment-1111111',
      content: 'content reply',
      owner: 'user-1111111111',
    };

    const newReplyComment = new NewReplyComment(payload);
    expect(newReplyComment.commentId).toEqual(payload.commentId);
    expect(newReplyComment.content).toEqual(payload.content);
    expect(newReplyComment.owner).toEqual(payload.owner);
  });
});
