const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrate the delete reply use case properly', async () => {
    // arrange

    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
      replyId: 'reply-123',
    };

    const userIdFromAccessToken = 'user-1111111111';

    /** creating dependancies for use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed functions */
    mockReplyRepository.checkReplyIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // action
    await deleteReplyUseCase.execute(useCaseParam, userIdFromAccessToken);

    // assert
    expect(mockReplyRepository.checkReplyIsExist).toBeCalledWith(useCaseParam);
    expect(mockReplyRepository.verifyReplyAccess).toBeCalledWith({
      ownerId: userIdFromAccessToken, replyId: useCaseParam.replyId,
    });
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(useCaseParam.replyId);
  });
});
