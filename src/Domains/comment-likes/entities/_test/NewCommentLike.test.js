const NewCommentLike = require('../NewCommentLike');

describe('a NewCommentLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payloadCommentLike = {
      commentId: 'comment-1111111',
    };

    // Action & Assert
    expect(() => new NewCommentLike(payloadCommentLike)).toThrowError('NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payloadCommentLike = {
      commentId: 111111111111111,
      owner: 2,
    };

    // Action & Assert
    expect(() => new NewCommentLike(payloadCommentLike)).toThrowError('NEW_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewCommentLike object correctly', () => {
    // Arrange
    const payloadCommentLike = {
      commentId: 'comment-1111111',
      owner: 'user-1111111111',
    };

    // Action
    const newCommentLike = new NewCommentLike(payloadCommentLike);

    // Assert
    expect(newCommentLike.commentId).toEqual(payloadCommentLike.commentId);
    expect(newCommentLike.owner).toEqual(payloadCommentLike.owner);
  });
});
