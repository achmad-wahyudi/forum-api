const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrate the add reply use case properly', async () => {
    // arrange
    const useCasePayload = {
      content: 'reply content',
    };

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userIdFromAccessToken = 'user-123';

    const expectedAddedReply = new AddedReply({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependancies for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed functions */
    mockCommentRepository.checkCommentBelongsToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => new AddedReply({
        id: 'comment-123',
        content: 'reply content',
        owner: 'user-123',
      }));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // action
    const addedReply = await addReplyUseCase.execute(
      useCasePayload, useCaseParam, userIdFromAccessToken,
    );

    // assert
    expect(addedReply).toStrictEqual(expectedAddedReply);

    expect(mockCommentRepository.checkCommentBelongsToThread).toBeCalledWith({
      threadId: useCaseParam.threadId,
      commentId: useCaseParam.commentId,
    });
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      threadId: useCaseParam.threadId,
      commentId: useCaseParam.commentId,
      owner: userIdFromAccessToken,
      content: useCasePayload.content,
    }));
  });
});
