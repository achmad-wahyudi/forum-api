const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // arrange
    const useCasePayload = {
      title: 'lorem ipsum',
      body: 'dolor sit amet',
    };

    const owner = 'user-1111111111';

    const expectedAddedThread = new AddedThread({
      id: 'thread-11111111',
      title: 'lorem ipsum',
      owner,
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => new AddedThread({
        id: 'thread-11111111',
        title: 'lorem ipsum',
        owner: 'user-1111111111',
      }));

    /* creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);

    // assert
    expect(addedThread).toStrictEqual(new AddedThread({
      id: expectedAddedThread.id,
      title: expectedAddedThread.title,
      owner: expectedAddedThread.owner,
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: expectedAddedThread.owner,
    }));
  });
});
