const NewReplyComment = require('../../../Domains/replies-comment/entities/NewReplyComment');
const AddedReplyComment = require('../../../Domains/replies-comment/entities/AddedReplyComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrate the add reply use case properly', async () => {
    const useCasePayload = {
      content: 'reply content',
    };

    const paramReplyComment = {
      threadId: 'thread-11111111',
      commentId: 'comment-1111111',
    };

    const owner = 'user-1111111111';

    const expectedAddedReplyComment = new AddedReplyComment({
      id: 'comment-1111111',
      content: useCasePayload.content,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockCommentThreadRepository.checkCommentInThread = jest.fn(() => Promise.resolve());
    mockReplyCommentRepository.addReplyComment = jest.fn(() => new AddedReplyComment({
      id: 'comment-1111111',
      content: 'reply content',
      owner: 'user-1111111111',
    }));

    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
      replyCommentRepository: mockReplyCommentRepository,
    });

    const addedReplyComment = await addReplyCommentUseCase.execute(
      useCasePayload, paramReplyComment, owner,
    );

    expect(addedReplyComment).toStrictEqual(expectedAddedReplyComment);

    expect(mockCommentThreadRepository.checkCommentInThread).toBeCalledWith({
      threadId: paramReplyComment.threadId,
      commentId: paramReplyComment.commentId,
    });
    expect(mockReplyCommentRepository.addReplyComment).toBeCalledWith(new NewReplyComment({
      threadId: paramReplyComment.threadId,
      commentId: paramReplyComment.commentId,
      owner,
      content: useCasePayload.content,
    }));
  });
});
