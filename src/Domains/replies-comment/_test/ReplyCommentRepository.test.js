const ReplyCommentRepository = require('../ReplyCommentRepository');

describe('ReplyCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const replyCommentRepository = new ReplyCommentRepository();

    await expect(replyCommentRepository.addReplyComment({})).rejects.toThrowError('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyCommentRepository.getRepliesByThreadId('')).rejects.toThrowError('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyCommentRepository.verifyReplyAvalaibility({})).rejects.toThrowError('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyCommentRepository.verifyReplyAccess({})).rejects.toThrowError('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyCommentRepository.deleteReplyById('')).rejects.toThrowError('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
