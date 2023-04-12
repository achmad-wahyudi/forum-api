const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const NewCommentThread = require('../../../Domains/comments-thread/entities/NewCommentThread');
const pool = require('../../database/postgres/pool');
const CommentThreadRepositoryPostgres = require('../CommentThreadRepositoryPostgres');
const DetailCommentThread = require('../../../Domains/comments-thread/entities/DetailCommentThread');

describe('CommentThreadRepositoryPostgres', () => {
  const fakeIdGenerator = () => '1111111';

  beforeAll(async () => {
    const userId = 'user-1111111111';
    const threadId = 'thread-11111111';
    await UsersTableTestHelper.registerUser({ id: userId, username: 'SomeUser' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });
  afterEach(async () => {
    await CommentsThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsThreadTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addCommentThread function', () => {
    it('addCommentThread function should add database entry for said comment', async () => {
      const newCommentThread = new NewCommentThread({
        content: 'content comment',
        threadId: 'thread-11111111',
        owner: 'user-1111111111',
      });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      const addedCommentThread = await commentThreadRepositoryPostgres
        .addCommentThread(newCommentThread);
      const comments = await CommentsThreadTableTestHelper.findCommentById(addedCommentThread.id);

      expect(addedCommentThread).toStrictEqual({
        id: 'comment-1111111',
        content: newCommentThread.content,
        owner: newCommentThread.owner,
      });
      expect(comments).toBeDefined();
    });
  });

  describe('deleteCommentById', () => {
    it('should be able to delete added comment by id', async () => {
      const addedCommentThread = {
        id: 'comment-1111111',
        threadId: 'thread-11111111',
      };

      await CommentsThreadTableTestHelper.addCommentThread({
        id: addedCommentThread.id, threadId: addedCommentThread.threadId,
      });

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});
      await commentThreadRepositoryPostgres.deleteCommentById(addedCommentThread.id);
      const comment = await CommentsThreadTableTestHelper.findCommentById('comment-1111111');

      expect(comment.is_deleted).toEqual(true);
    });

    it('should throw error when comment that wants to be deleted does not exist', async () => {
      const addedCommentId = 'comment-1111111';

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(pool, {});

      await expect(commentThreadRepositoryPostgres.deleteCommentById(addedCommentId)).rejects.toThrowError('tidak bisa menghapus comment karena comment tidak ada');
    });
  });

  describe('getCommentsByThreadId', () => {
    it('should return all comments from a thread', async () => {
      const date = (new Date()).toISOString();
      const firstComment = new DetailCommentThread({
        id: 'comment-1111111', username: 'SomeUser', date, content: 'first comment', is_deleted: false, replies: [], likeCount: 0,
      });
      const secondComment = new DetailCommentThread({
        id: 'comment-456', username: 'dicoding', date, content: 'second comment', is_deleted: false, replies: [], likeCount: 0,
      });
      await CommentsThreadTableTestHelper.addCommentThread(firstComment);
      await CommentsThreadTableTestHelper.addCommentThread(secondComment);
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );

      const commentDetails = await commentThreadRepositoryPostgres.getCommentsByThreadId('thread-11111111');

      expect(commentDetails[0].id).toStrictEqual(firstComment.id);
      expect(commentDetails[0].username).toStrictEqual(firstComment.username);
      expect(commentDetails[0].content).toStrictEqual(firstComment.content);
      expect(commentDetails[0].is_deleted).toStrictEqual(firstComment.is_deleted);
      expect(commentDetails[0].likeCount).toStrictEqual(firstComment.likeCount);
      expect(commentDetails[0].date).toBeTruthy();
      expect(typeof commentDetails[0].date).toStrictEqual('string');
    });

    it('should return an empty array when no comments exist for the thread', async () => {
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );

      const commentDetails = await commentThreadRepositoryPostgres.getCommentsByThreadId('thread-11111111');
      expect(commentDetails).toStrictEqual([]);
    });
  });

  describe('verifyCommentAvalaibility', () => {
    it('should resolve if comment exists', async () => {
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-1111111',
      });

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );

      await expect(commentThreadRepositoryPostgres.verifyCommentAvalaibility({ threadId: 'thread-11111111', commentId: 'comment-1111111' }))
        .resolves.not.toThrowError();
    });

    it('should reject if comment does not exist', async () => {
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );

      await expect(commentThreadRepositoryPostgres.verifyCommentAvalaibility({ threadId: 'thread-11111111', commentId: 'comment-456' }))
        .rejects.toThrowError('comment yang Anda cari tidak ada');
    });

    it('should reject if comment is already deleted', async () => {
      await CommentsThreadTableTestHelper.addCommentThread({
        id: 'comment-1111111',
        isDeleted: true,
      });

      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );

      await expect(commentThreadRepositoryPostgres.verifyCommentAvalaibility({ threadId: 'thread-11111111', commentId: 'comment-456' }))
        .rejects.toThrowError('comment yang Anda cari tidak ada');
    });
  });

  describe('verifyCommentAccess', () => {
    it('should not throw error if user has authorization', async () => {
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-1111111', threadId: 'thread-11111111', owner: 'user-1111111111' });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );
      await expect(commentThreadRepositoryPostgres.verifyCommentAccess({
        commentId: 'comment-1111111', ownerId: 'user-1111111111',
      })).resolves.not.toThrowError();
    });

    it('should throw error if user has no authorization', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-xyz' });
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-456', threadId: 'thread-11111111', owner: 'user-1111111111' });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );
      await expect(commentThreadRepositoryPostgres.verifyCommentAccess({
        threadId: 'thread-11111111', owner: 'user-456',
      })).rejects.toThrowError('proses gagal karena Anda tidak mempunyai akses ke aksi ini');
    });
  });

  describe('checkCommentInThread', () => {
    it('should not throw error if comment exists in thread', async () => {
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-1111111', threadId: 'thread-11111111' });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );
      await expect(commentThreadRepositoryPostgres.checkCommentInThread({
        threadId: 'thread-11111111', commentId: 'comment-1111111',
      })).resolves;
    });

    it('should throw error if comment is not in thread', async () => {
      await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-456', threadId: 'thread-456' });
      const commentThreadRepositoryPostgres = new CommentThreadRepositoryPostgres(
        pool, {},
      );
      await expect(commentThreadRepositoryPostgres.checkCommentInThread({
        threadId: 'thread-11111111', commentId: 'comment-456',
      })).rejects.toThrowError('comment yang anda cari tidak ada di thread ini');
    });
  });
});
