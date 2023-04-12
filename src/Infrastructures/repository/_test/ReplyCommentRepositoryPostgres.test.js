const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const RepliesCommentTableTestHelper = require('../../../../tests/RepliesCommentTableTestHelper');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');
const NewReplyComment = require('../../../Domains/replies-comment/entities/NewReplyComment');
const AddedReplyComment = require('../../../Domains/replies-comment/entities/AddedReplyComment');
const pool = require('../../database/postgres/pool');
const ReplyCommentRepositoryPostgres = require('../ReplyCommentRepositoryPostgres');

describe('ReplyCommentRepositoryPostgres', () => {
  it('should be instance of ReplyCommentRepository domain', () => {
    const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres({}, {});

    expect(replyCommentRepositoryPostgres).toBeInstanceOf(ReplyCommentRepository);
  });

  describe('behavior test', () => {
    beforeAll(async () => {
      const userId = 'user-1111111111';
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      await UsersTableTestHelper.registerUser({ id: userId, username: 'SomeUser' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });
      jest.setTimeout(10000);
    });
    afterEach(async () => {
      await RepliesCommentTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await CommentsThreadTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
      await RepliesCommentTableTestHelper.cleanTable();
      await pool.end();
    });

    describe('addReplyComment function', () => {
      it('addReplyComment function should add reply in database', async () => {
        // arrange
        const newReplyComment = new NewReplyComment({
          commentId: 'comment-1111111',
          owner: 'user-1111111111',
          content: 'some reply',
        });

        const fakeIdGenerator = () => '111111111';
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(
          pool, fakeIdGenerator,
        );

        // action
        const addedReplyComment = await replyCommentRepositoryPostgres
          .addReplyComment(newReplyComment);
        const reply = await RepliesCommentTableTestHelper.findReplyById(addedReplyComment.id);

        expect(addedReplyComment).toStrictEqual(new AddedReplyComment({
          id: 'reply-111111111',
          content: newReplyComment.content,
          owner: newReplyComment.owner,
        }));
        expect(reply).toBeDefined();
      });
    });

    describe('verifyReplyAvalaibility function', () => {
      it('should not throw error if reply exists', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        await RepliesCommentTableTestHelper.addReplyComment({});

        expect(replyCommentRepositoryPostgres.verifyReplyAvalaibility({
          threadId: 'thread-11111111',
          commentId: 'comment-1111111',
          replyId: 'reply-111111111',
        })).resolves.not.toThrowError();
      });

      it('should throw error if reply does not exist', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        expect(replyCommentRepositoryPostgres.verifyReplyAvalaibility({
          threadId: 'thread-11111111',
          commentId: 'comment-1111111',
          replyId: 'reply-789',
        })).rejects.toThrowError('reply yang Anda cari tidak ada');
      });
    });

    describe('verifyReplyAccess function', () => {
      it('should not throw error when user has access', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        await RepliesCommentTableTestHelper.addReplyComment({});

        expect(replyCommentRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-1111111111',
          replyId: 'reply-111111111',
        })).resolves.not.toThrowError();
      });

      it('should throw error when user does not have access', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        await RepliesCommentTableTestHelper.addReplyComment({});

        expect(replyCommentRepositoryPostgres.verifyReplyAccess({
          ownerId: 'user-456',
          replyId: 'reply-111111111',
        })).rejects.toThrowError('Anda tidak berhak melakukan aksi tersebut pada reply ini');
      });
    });

    describe('deleteReplyById function', () => {
      it('should not throw error when reply deleted successfully', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        await RepliesCommentTableTestHelper.addReplyComment({});

        expect(replyCommentRepositoryPostgres.deleteReplyById('reply-111111111'))
          .resolves.toBeUndefined();
      });

      it('deleted reply should have is_deleted column as true in database', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        await RepliesCommentTableTestHelper.addReplyComment({});
        await replyCommentRepositoryPostgres.deleteReplyById('reply-111111111');

        jest.setTimeout(10000);

        const reply = await RepliesCommentTableTestHelper.findReplyById('reply-111111111');
        expect(reply.is_deleted).toEqual(true);
      });

      it('should throw error when reply has been already deleted', async () => {
        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        expect(replyCommentRepositoryPostgres.deleteReplyById('reply-111111111'))
          .rejects.toThrowError('reply yang ingin Anda hapus tidak ada');
      });
    });

    describe('getRepliesByThreadId function', () => {
      it('it should return all of the replies in a thread', async () => {
        // arrange
        await UsersTableTestHelper.registerUser({ id: 'user-789', username: 'UserA' });
        await UsersTableTestHelper.registerUser({ id: 'user-456', username: 'UserB' });

        await ThreadsTableTestHelper.addThread({ id: 'thread-789', owner: 'user-789' });

        await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-789', owner: 'user-789', threadId: 'thread-789' });
        await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-456', owner: 'user-456', threadId: 'thread-789' });

        const replyA = {
          id: 'reply-111111111', commentId: 'comment-789', content: 'reply A',
        };
        const replyB = {
          id: 'reply-456', commentId: 'comment-456', content: 'reply B',
        };

        const expectedReplies = [
          { ...replyA, username: 'UserB' }, { ...replyB, username: 'UserA' },
        ];

        await RepliesCommentTableTestHelper.addReplyComment({ ...replyA, owner: 'user-456' });
        await RepliesCommentTableTestHelper.addReplyComment({ ...replyB, owner: 'user-789' });

        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        const retrievedReplies = await replyCommentRepositoryPostgres.getRepliesByThreadId('thread-789');

        expect(retrievedReplies.id).toStrictEqual(expectedReplies.id);
        expect(retrievedReplies.commentId).toStrictEqual(expectedReplies.commentId);
        expect(retrievedReplies.content).toStrictEqual(expectedReplies.content);
        expect(retrievedReplies.username).toStrictEqual(expectedReplies.username);
        expect(retrievedReplies[0].date).toBeTruthy();
        expect(typeof retrievedReplies[0].date).toStrictEqual('string');
      });

      it('it should return the deleted replies', async () => {
        // arrange
        await UsersTableTestHelper.registerUser({ id: 'user-111', username: 'User111' });

        await ThreadsTableTestHelper.addThread({ id: 'thread-222', owner: 'user-111' });

        await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-333', owner: 'user-111', threadId: 'thread-222' });

        const replyA = {
          id: 'reply-444', commentId: 'comment-333', content: 'reply A',
        };

        const expectedReplies = [
          { ...replyA, username: 'UserB' },
        ];

        await RepliesCommentTableTestHelper.addReplyComment({ ...replyA, owner: 'user-111' });

        const replyCommentRepositoryPostgres = new ReplyCommentRepositoryPostgres(pool, {});

        expect(replyCommentRepositoryPostgres.deleteReplyById('reply-444'))
          .resolves.not.toThrowError();

        const retrievedReplies = await replyCommentRepositoryPostgres.getRepliesByThreadId('thread-222');

        expect(retrievedReplies.id).toStrictEqual(expectedReplies.id);
        expect(retrievedReplies.commentId).toStrictEqual(expectedReplies.commentId);
        expect(retrievedReplies.content).toStrictEqual(expectedReplies.content);
        expect(retrievedReplies.username).toStrictEqual(expectedReplies.username);
        expect(retrievedReplies[0].date).toBeTruthy();
        expect(typeof retrievedReplies[0].date).toStrictEqual('string');
      });
    });
  });
});
