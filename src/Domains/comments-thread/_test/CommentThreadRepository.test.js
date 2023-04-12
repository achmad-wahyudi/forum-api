const CommentThreadRepository = require('../CommentThreadRepository');

describe('CommentThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentThreadRepository = new CommentThreadRepository();

    await expect(commentThreadRepository.addCommentThread({})).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentThreadRepository.getCommentsByThreadId('')).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentThreadRepository.deleteCommentById('')).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentThreadRepository.verifyCommentAvalaibility({})).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentThreadRepository.verifyCommentAccess({})).rejects.toThrowError('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
