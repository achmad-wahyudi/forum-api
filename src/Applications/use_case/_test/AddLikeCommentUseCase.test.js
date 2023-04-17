const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const LikeCommentRepository = require('../../../Domains/likes-comment/LikeCommentRepository');
const NewLikeComment = require('../../../Domains/likes-comment/entities/NewLikeComment');
const AddLikeCommentUseCase = require('../AddLikeCommentUseCase');

describe('AddLikeCommentUseCase', () => {
  it('should orchestrate the add like comment use case properly', async () => {
    const useCasePayload = {
      content: 'comment content',
    };

    const owner = 'user-1111111111';

    const paramCommentLike = ({
      commentId: 'comment-1111111',
      threadId: 'thread-11111111',
    });

    const paramNewLikeComment = new NewLikeComment({
      commentId: paramCommentLike.commentId,
      owner,
    });

    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockCommentThreadRepository.verifyCommentAvalaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikeAvalaibility = jest.fn()
      .mockImplementation(() => false);
    mockLikeCommentRepository.deleteLikeByCommentIdAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.addLikeComment = jest.fn()
      .mockImplementation(() => ({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      }));

    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      commentThreadRepository: mockCommentThreadRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    await addLikeCommentUseCase.execute(
      paramCommentLike, owner,
    );

    expect(mockCommentThreadRepository.verifyCommentAvalaibility)
      .toBeCalledWith(paramCommentLike);
    expect(mockLikeCommentRepository.verifyLikeAvalaibility).toBeCalledWith(paramNewLikeComment);
    expect(mockLikeCommentRepository.addLikeComment)
      .toBeCalledWith(paramNewLikeComment);
  });

  it('should orchestrate the delete like comment use case properly', async () => {
    const useCasePayload = {
      content: 'comment content',
    };

    const owner = 'user-1111111111';

    const paramCommentLike = ({
      commentId: 'comment-1111111',
      threadId: 'thread-11111111',
    });

    const paramNewLikeComment = new NewLikeComment({
      commentId: paramCommentLike.commentId,
      owner,
    });

    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockCommentThreadRepository.verifyCommentAvalaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikeAvalaibility = jest.fn()
      .mockImplementation(() => true);
    mockLikeCommentRepository.deleteLikeByCommentIdAndOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.addLikeComment = jest.fn()
      .mockImplementation(() => ({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      }));

    const addLikeCommentUseCase = new AddLikeCommentUseCase({
      commentThreadRepository: mockCommentThreadRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    await addLikeCommentUseCase.execute(
      paramCommentLike, owner,
    );

    expect(mockCommentThreadRepository.verifyCommentAvalaibility)
      .toBeCalledWith(paramCommentLike);
    expect(mockLikeCommentRepository.verifyLikeAvalaibility).toBeCalledWith(paramNewLikeComment);
    expect(mockLikeCommentRepository.deleteLikeByCommentIdAndOwner)
      .toBeCalledWith(paramNewLikeComment);
  });
});
