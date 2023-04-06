const NewCommentThread = require('../../../Domains/comments-thread/entities/NewCommentThread');
const AddedCommentThread = require('../../../Domains/comments-thread/entities/AddedCommentThread');
const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentThreadUseCase', () => {
  it('should orchestrate the add comment use case properly', async () => {
    // arrange
    const useCasePayload = {
      content: 'comment content',
    };

    const useCaseParam = {
      threadId: 'thread-11111111',
    };

    const userIdFromAccessToken = 'user-1111111111';

    const expectedAddedCommentThread = new AddedCommentThread({
      id: 'comment-1111111',
      content: useCasePayload.content,
      owner: userIdFromAccessToken,
    });

    /** creating dependancies for use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    /** mocking needed functions */
    mockThreadRepository.verifyThreadAvalaibility = jest.fn()
      .mockImplementation(() => ({
        id: 'comment-1111111',
        title: 'title-123',
        body: 'body-123',
        date: '2020',
        username: 'John Doe',
      }));
    mockCommentThreadRepository.addCommentThread = jest.fn()
      .mockImplementation(() => new AddedCommentThread({
        id: 'comment-1111111',
        content: 'comment content',
        owner: 'user-1111111111',
      }));

    /** creating use case instance */
    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
    });

    // action
    const addedCommentThread = await addCommentThreadUseCase.execute(
      useCasePayload, useCaseParam, userIdFromAccessToken,
    );

    // assert
    expect(addedCommentThread).toStrictEqual(expectedAddedCommentThread);
    expect(mockThreadRepository.verifyThreadAvalaibility).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentThreadRepository.addCommentThread).toBeCalledWith(new NewCommentThread({
      content: useCasePayload.content,
      threadId: useCaseParam.threadId,
      owner: userIdFromAccessToken,
    }));
  });
});
