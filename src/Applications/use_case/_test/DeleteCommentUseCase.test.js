const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
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
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.checkCommentIsExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const addCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // action
    await addCommentUseCase.execute(useCaseParam, userIdFromAccessToken);

    expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith({
      threadId: useCaseParam.threadId, commentId: useCaseParam.commentId,
    });
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
      commentId: useCaseParam.commentId, ownerId: userIdFromAccessToken,
    });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(expectedDeletedComment.id);
  });
});
