const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const DeleteCommentThreadUseCase = require('../DeleteCommentThreadUseCase');

describe('DeleteCommentThreadUseCase', () => {
  it('should orchestrate the delete comment use case properly', async () => {
    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
    };

    const owner = 'user-1111111111';

    const expectedDeletedComment = {
      id: 'comment-1111111',
    };

    const mockCommentThreadRepository = new CommentThreadRepository();

    mockCommentThreadRepository.verifyCommentAvalaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentThreadRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentThreadRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentThreadUseCase = new DeleteCommentThreadUseCase({
      commentThreadRepository: mockCommentThreadRepository,
    });

    await deleteCommentThreadUseCase.execute(useCaseParam, owner);

    expect(mockCommentThreadRepository.verifyCommentAvalaibility).toBeCalledWith({
      threadId: useCaseParam.threadId, commentId: useCaseParam.commentId,
    });
    expect(mockCommentThreadRepository.verifyCommentAccess).toBeCalledWith({
      commentId: useCaseParam.commentId, ownerId: owner,
    });
    expect(mockCommentThreadRepository.deleteCommentById).toBeCalledWith(expectedDeletedComment.id);
  });
});
