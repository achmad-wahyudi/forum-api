const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should create new thread and return added thread correctly', async () => {
      await UsersTableTestHelper.registerUser({
        id: 'user-1111111111',
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
      });

      const fakeThreadIdGenerator = (x = 10) => '222';

      const newThread = new NewThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-1111111111',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool, fakeThreadIdGenerator,
      );

      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: `thread-${fakeThreadIdGenerator()}`,
        title: 'thread title',
        owner: 'user-1111111111',
      }));
      expect(threads).toBeDefined();
    });
  });

  describe('getThreadById function', () => {
    const date = (new Date()).toISOString();
    it('should return NotFoundError when thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-11111111', owner: 'user-1111111111' });

      await expect(threadRepositoryPostgres.verifyThreadAvalaibility('thread-x'))
        .rejects
        .toThrowError(NotFoundError);
    });
    it('should return NotFoundError when thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-11111111', owner: 'user-1111111111' });

      await expect(threadRepositoryPostgres.getThreadById('thread-x'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread when thread is found', async () => {
      const newThread = {
        id: 'thread-11111111', title: 'thread title', body: 'thread body', owner: 'user-1111111111', date: '2023',
      };
      const expectedThread = {
        id: 'thread-11111111',
        title: 'thread title',
        date,
        username: 'John Doe',
        body: 'thread body',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111', username: expectedThread.username });
      await ThreadsTableTestHelper.addThread(newThread);

      const acquiredThread = await threadRepositoryPostgres.getThreadById('thread-11111111');

      expect(acquiredThread.id).toStrictEqual(expectedThread.id);
      expect(acquiredThread.title).toStrictEqual(expectedThread.title);
      expect(acquiredThread.body).toStrictEqual(expectedThread.body);
      expect(acquiredThread.username).toStrictEqual(expectedThread.username);
      expect(acquiredThread.date).toBeTruthy();
      expect(typeof acquiredThread.date).toStrictEqual('string');
    });
  });

  describe('getThreadById function', () => {
    const date = (new Date()).toISOString();
    it('should return NotFoundError when thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-11111111', owner: 'user-1111111111' });

      await expect(threadRepositoryPostgres.verifyThreadAvalaibility('thread-x'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread when thread is found', async () => {
      const newThread = {
        id: 'thread-11111111', title: 'thread title', body: 'thread body', owner: 'user-1111111111', date: '2023',
      };
      const expectedThread = {
        id: 'thread-11111111',
        title: 'thread title',
        date,
        username: 'John Doe',
        body: 'thread body',
      };
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111', username: expectedThread.username });
      await ThreadsTableTestHelper.addThread(newThread);

      expect(threadRepositoryPostgres.verifyThreadAvalaibility('thread-11111111'))
        .resolves.toBeUndefined();
    });
  });
});
