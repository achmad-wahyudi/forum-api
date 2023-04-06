const NewReplyComment = require('../../../Domains/replies-comment/entities/NewReplyComment');
const AddedReplyComment = require('../../../Domains/replies-comment/entities/AddedReplyComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrate the add reply use case properly', async () => {
    // arrange
    const useCasePayload = {
      content: 'reply content',
    };

    const useCaseParam = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
    };

    const userIdFromAccessToken = 'user-1111111111';

    const expectedAddedReplyComment = new AddedReplyComment({
      id: 'comment-1111111',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependancies for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    /** mocking needed functions */
    mockCommentThreadRepository.checkCommentBelongsToThread = jest.fn(() => Promise.resolve());
    mockReplyCommentRepository.addReplyComment = jest.fn(() => new AddedReplyComment({
      id: 'comment-1111111',
      content: 'reply content',
      owner: 'user-1111111111',
    }));

    /** creating use case instance */
    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
      replyCommentRepository: mockReplyCommentRepository,
    });

    // action
    const addedReplyComment = await addReplyCommentUseCase.execute(
      useCasePayload, useCaseParam, userIdFromAccessToken,
    );

    // assert
    expect(addedReplyComment).toStrictEqual(expectedAddedReplyComment);

    expect(mockCommentThreadRepository.checkCommentBelongsToThread).toBeCalledWith({
      threadId: useCaseParam.threadId,
      commentId: useCaseParam.commentId,
    });
    expect(mockReplyCommentRepository.addReplyComment).toBeCalledWith(new NewReplyComment({
      threadId: useCaseParam.threadId,
      commentId: useCaseParam.commentId,
      owner: userIdFromAccessToken,
      content: useCasePayload.content,
    }));
  });
});
