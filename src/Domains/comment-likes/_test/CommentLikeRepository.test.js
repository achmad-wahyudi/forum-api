const LikeCommentRepository = require('../CommentLikeRepository');

describe('LikeCommentRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeCommentRepository = new LikeCommentRepository();

    // Action and Assert
    await expect(likeCommentRepository.addCommentLike({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.verifyLikeAvalaibility({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.getLikeCountByCommentId('')).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.deleteLikeByCommentIdAndOwner({})).rejects.toThrowError('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
