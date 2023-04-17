const NewCommentThread = require('../../../Domains/comments-thread/entities/NewCommentThread');
const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const AddCommentThreadUseCase = require('../AddCommentThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentThreadUseCase', () => {
  it('should orchestrate the add comment use case properly', async () => {
    const useCasePayload = {
      content: 'comment content',
    };

    const paramThread = {
      threadId: 'thread-11111111',
    };

    const owner = 'user-1111111111';

    const expectedAddedCommentThread = ({
      id: 'comment-1111111',
      content: useCasePayload.content,
      owner,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();

    mockThreadRepository.verifyThreadAvalaibility = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentThreadRepository.addCommentThread = jest.fn()
      .mockImplementation(() => ({
        id: 'comment-1111111',
        content: 'comment content',
        owner: 'user-1111111111',
      }));

    const addCommentThreadUseCase = new AddCommentThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
    });

    const addedCommentThread = await addCommentThreadUseCase.execute(
      useCasePayload, paramThread, owner,
    );

    expect(addedCommentThread).toStrictEqual(expectedAddedCommentThread);
    expect(mockThreadRepository.verifyThreadAvalaibility).toBeCalledWith(paramThread.threadId);
    expect(mockCommentThreadRepository.addCommentThread).toBeCalledWith(new NewCommentThread({
      content: useCasePayload.content,
      threadId: paramThread.threadId,
      owner,
    }));
  });
});
