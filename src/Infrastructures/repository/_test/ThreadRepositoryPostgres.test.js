const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  it('should be an instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should create new thread and return added thread correctly', async () => {
        // arrange

        /* arranging for add pe-existing */
        await UsersTableTestHelper.registerUser({
          id: 'user-123',
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        });

        /* arranging for mocks and stubs for thread repository */
        const fakeThreadIdGenerator = (x = 10) => '123';

        /* arranging for thread repository */
        const newThread = new NewThread({
          title: 'lorem ipsum',
          body: 'dolor sit amet',
          owner: 'user-123',
        });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool, fakeThreadIdGenerator,
        );

        // action
        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        // assert
        const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);
        expect(addedThread).toStrictEqual(new AddedThread({
          id: `thread-${fakeThreadIdGenerator()}`,
          title: 'lorem ipsum',
          owner: 'user-123',
        }));
        expect(threads).toBeDefined();
      });
    });

    describe('getThreadById function', () => {
      const date = (new Date()).toISOString();
      it('should return NotFoundError when thread is not found', async () => {
        // arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.registerUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

        // action & assert
        await expect(threadRepositoryPostgres.verifyThreadAvalaibility('thread-x'))
          .rejects
          .toThrowError(NotFoundError);
      });
      it('should return NotFoundError when thread is not found', async () => {
        // arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.registerUser({ id: 'user-123' });
        await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

        // action & assert
        await expect(threadRepositoryPostgres.getThreadById('thread-x'))
          .rejects
          .toThrowError(NotFoundError);
      });

      it('should return thread when thread is found', async () => {
        // arrange
        const newThread = {
          id: 'thread-123', title: 'lorem ipsum', body: 'dolor sit amet', owner: 'user-123', date: '2021',
        };
        const expectedThread = {
          id: 'thread-123',
          title: 'lorem ipsum',
          date,
          username: 'John Doe',
          body: 'dolor sit amet',
        };
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
        await UsersTableTestHelper.registerUser({ id: 'user-123', username: expectedThread.username });
        await ThreadsTableTestHelper.addThread(newThread);

        // action
        const acquiredThread = await threadRepositoryPostgres.getThreadById('thread-123');

        // assert
        expect(acquiredThread.id).toStrictEqual(expectedThread.id);
        expect(acquiredThread.title).toStrictEqual(expectedThread.title);
        expect(acquiredThread.body).toStrictEqual(expectedThread.body);
        expect(acquiredThread.username).toStrictEqual(expectedThread.username);
        expect(acquiredThread.date).toBeTruthy();
        expect(typeof acquiredThread.date).toStrictEqual('string');
      });
    });
  });
});
