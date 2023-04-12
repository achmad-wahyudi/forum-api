const NewLikeComment = require('../NewLikeComment');

describe('a NewLikeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payloadLikeComment = {
      commentId: 'comment-1111111',
    };

    expect(() => new NewLikeComment(payloadLikeComment)).toThrowError('NEW_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payloadLikeComment = {
      commentId: 111111111111111,
      owner: 222,
    };

    expect(() => new NewLikeComment(payloadLikeComment)).toThrowError('NEW_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLikeComment object correctly', () => {
    const payloadLikeComment = {
      commentId: 'comment-1111111',
      owner: 'user-1111111111',
    };

    const newLikeComment = new NewLikeComment(payloadLikeComment);

    expect(newLikeComment.commentId).toEqual(payloadLikeComment.commentId);
    expect(newLikeComment.owner).toEqual(payloadLikeComment.owner);
  });
});
