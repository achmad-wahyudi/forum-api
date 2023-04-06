const NewLikeComment = require('../NewLikeComment');

describe('a NewLikeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payloadLikeComment = {
      commentId: 'comment-1111111',
    };

    // Action & Assert
    expect(() => new NewLikeComment(payloadLikeComment)).toThrowError('NEW_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payloadLikeComment = {
      commentId: 111111111111111,
      owner: 2,
    };

    // Action & Assert
    expect(() => new NewLikeComment(payloadLikeComment)).toThrowError('NEW_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewLikeComment object correctly', () => {
    // Arrange
    const payloadLikeComment = {
      commentId: 'comment-1111111',
      owner: 'user-1111111111',
    };

    // Action
    const newLikeComment = new NewLikeComment(payloadLikeComment);

    // Assert
    expect(newLikeComment.commentId).toEqual(payloadLikeComment.commentId);
    expect(newLikeComment.owner).toEqual(payloadLikeComment.owner);
  });
});
