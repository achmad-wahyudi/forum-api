const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');

describe('DeleteCommentThreadUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    // arrange
    const userIdFromAccessToken = 'user-1111111111';
    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
    };

    const expectedDeletedComment = {
      id: 'comment-1111111',
    };

    /** creating dependancies for use case */
    const mockCommentThreadRepository = new CommentThreadRepository();

    mockCommentThreadRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentThreadRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentThreadRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      commentThreadRepository: mockCommentThreadRepository,
    });

    // action
    await deleteCommentThreadUseCase.execute(useCaseParam, userIdFromAccessToken);

    expect(mockCommentThreadRepository.checkCommentIsExist).toBeCalledWith({
      threadId: useCaseParam.threadId, commentId: useCaseParam.commentId,
    });
    expect(mockCommentThreadRepository.verifyCommentAccess).toBeCalledWith({
      commentId: useCaseParam.commentId, ownerId: userIdFromAccessToken,
    });
    expect(mockCommentThreadRepository.deleteCommentById).toBeCalledWith(expectedDeletedComment.id);
  });
});
