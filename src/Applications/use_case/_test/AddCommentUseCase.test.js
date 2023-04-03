const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment use case properly', async () => {
    // arrange
    const useCasePayload = {
      content: 'comment content',
    };

    const useCaseParam = {
      threadId: 'thread-123',
    };

    const userIdFromAccessToken = 'user-123';

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependancies for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed functions */
    mockThreadRepository.verifyThreadAvalaibility = jest.fn()
      .mockImplementation(() => ({
        id: 'comment-123',
        title: 'title-123',
        body: 'body-123',
        date: '2020',
        username: 'John Doe',
      }));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => new AddedComment({
        id: 'comment-123',
        content: 'comment content',
        owner: 'user-123',
      }));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload, useCaseParam, userIdFromAccessToken,
    );

    // assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyThreadAvalaibility).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      content: useCasePayload.content,
      threadId: useCaseParam.threadId,
      owner: userIdFromAccessToken,
    }));
  });
});
