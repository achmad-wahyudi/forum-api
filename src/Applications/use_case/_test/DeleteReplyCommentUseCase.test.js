const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');

describe('DeleteReplyCommentUseCase', () => {
  it('should orchestrate the delete reply use case properly', async () => {
    // arrange

    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
      replyId: 'reply-111111111',
    };

    const userIdFromAccessToken = 'user-1111111111';

    /** creating dependancies for use case */
    const mockReplyCommentRepository = new ReplyCommentRepository();

    /** mocking needed functions */
    mockReplyCommentRepository.checkReplyIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      replyCommentRepository: mockReplyCommentRepository,
    });

    // action
    await deleteReplyCommentUseCase.execute(useCaseParam, userIdFromAccessToken);

    // assert
    expect(mockReplyCommentRepository.checkReplyIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyCommentRepository.verifyReplyAccess).toBeCalledWith({
      ownerId: userIdFromAccessToken, replyId: useCaseParam.replyId,
    });
    expect(mockReplyCommentRepository.deleteReplyById).toBeCalledWith(useCaseParam.replyId);
  });
});
