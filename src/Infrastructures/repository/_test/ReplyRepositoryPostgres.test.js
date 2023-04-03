const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of ReplyRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.registerUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({ id: commentId, owner: userId });
    });
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addReply function', () => {
      it('addReply function should add reply in database', async () => {
        // arrange
        const newReply = new NewReply({
          commentId: 'comment-123',
          owner: 'user-123',
          content: 'some reply',
        });

        const fakeIdGenerator = () => '123';
        function fakeDateGenerator() {
          this.toISOString = () => '2021';
        }
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(
          pool, fakeIdGenerator, fakeDateGenerator,
        );

        // action
        const addedReply = await replyRepositoryPostgres.addReply(newReply);
        const reply = await RepliesTableTestHelper.findReplyById(addedReply.id);

        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: newReply.content,
          owner: newReply.owner,
        }));
        expect(reply).toBeDefined();
      });
    });

    describe('checkReplyIsExist function', () => {
      it('should not throw error if reply exists', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.checkReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-123',
        })).resolves.toBeUndefined();
      });

      it('should throw error if reply does not exist', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        expect(replyRepositoryPostgres.checkReplyIsExist({
          threadId: 'thread-123',
          commentId: 'comment-123',
          replyId: 'reply-789',
        })).rejects.toThrowError('reply yang Anda cari tidak ada');
      });
    });

    describe('verifyReplyAccess function', () => {
      it('should not throw error when user has access', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-123',
          replyId: 'reply-123',
        })).resolves.toBeUndefined();
      });

      it('should throw error when user does not have access', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-456',
          replyId: 'reply-123',
        })).rejects.toThrowError('Anda tidak berhak melakukan aksi tersebut pada reply ini');
      });
    });

    describe('deleteReplyById function', () => {
      it('should not throw error when reply deleted successfully', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});

        expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
          .resolves.toBeUndefined();
      });

      it('deleted reply should have is_deleted column as true in database', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        await RepliesTableTestHelper.addReply({});
        await replyRepositoryPostgres.deleteReplyById('reply-123');

        const reply = await RepliesTableTestHelper.findReplyById('reply-123');
        expect(reply.is_deleted).toEqual(true);
      });

      it('should throw error when reply has been already deleted', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        expect(replyRepositoryPostgres.deleteReplyById('reply-123'))
          .rejects.toThrowError('reply yang ingin Anda hapus tidak ada');
      });
    });

    describe('getRepliesByThreadId function', () => {
      it('it should return all of the replies in a thread', async () => {
        // arrange
        await UsersTableTestHelper.registerUser({ id: 'user-789', username: 'UserA' });
        await UsersTableTestHelper.registerUser({ id: 'user-456', username: 'UserB' });

        await ThreadsTableTestHelper.addThread({ id: 'thread-789', owner: 'user-789' });

        await CommentsTableTestHelper.addComment({ id: 'comment-789', owner: 'user-789', threadId: 'thread-789' });
        await CommentsTableTestHelper.addComment({ id: 'comment-456', owner: 'user-456', threadId: 'thread-789' });

        const replyA = {
          id: 'reply-123', commentId: 'comment-789', content: 'reply A', date: '2020',
        };
        const replyB = {
          id: 'reply-456', commentId: 'comment-456', content: 'reply B', date: '2021',
        };

        const expectedReplies = [
          { ...replyA, username: 'UserB' }, { ...replyB, username: 'UserA' },
        ];

        await RepliesTableTestHelper.addReply({ ...replyA, owner: 'user-456' });
        await RepliesTableTestHelper.addReply({ ...replyB, owner: 'user-789' });

        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {}, {});

        const retrievedReplies = await replyRepositoryPostgres.getRepliesByThreadId('thread-789');

        expect(retrievedReplies).toEqual(expectedReplies);
      });
    });
  });
});
