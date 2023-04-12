const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');

describe('DeleteReplyCommentUseCase', () => {
  it('should orchestrate the delete reply use case properly', async () => {
    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
      replyId: 'reply-111111111',
    };

    const owner = 'user-1111111111';

    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockReplyCommentRepository.verifyReplyAvalaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    await deleteReplyCommentUseCase.execute(useCaseParam, owner);

    expect(mockReplyCommentRepository.verifyReplyAvalaibility).toBeCalledWith(useCaseParam);
    expect(mockReplyCommentRepository.verifyReplyAccess).toBeCalledWith({
      ownerId: owner, replyId: useCaseParam.replyId,
    });
    expect(mockReplyCommentRepository.deleteReplyById).toBeCalledWith(useCaseParam.replyId);
  });
});
