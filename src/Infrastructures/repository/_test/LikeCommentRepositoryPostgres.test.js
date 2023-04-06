const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');
const NewLikeComment = require('../../../Domains/likes-comment/entities/NewLikeComment');
const pool = require('../../database/postgres/pool');

describe('LikeCommentRepositoryPostgres', () => {
  const strUserId = 'user-1111111111';
  const strthreadId = 'thread-11111111';
  const strCommentId1 = 'comment-1111111';
  const strCommentId2 = 'comment-2222222';
  const strLikeId = 'like-1111111111';
  const fakeIdGenerator = () => '1111111111';

  beforeAll(async () => {
    await UsersTableTestHelper.registerUser({ id: strUserId, username: 'wahyu' });
    await ThreadsTableTestHelper.addThread({ id: strthreadId, owner: strUserId });

    // add 2 Comment
    await CommentsThreadTableTestHelper.addCommentThread({ id: strCommentId1, owner: strUserId });
    await CommentsThreadTableTestHelper.addCommentThread({ id: strCommentId2, owner: strUserId });
  });

  afterEach(async () => {
    await LikesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsThreadTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikesCommentTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyLikeAvalaibility function', () => {
    it('verifyLikeAvalaibility should return true if like exists', async () => {
      await LikesCommentTableTestHelper.addLikeComment({
        id: strLikeId,
        commentId: strCommentId1,
        owner: strUserId,
      });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const verifyLikeAvalaibility = await likeCommentRepositoryPostgres.verifyLikeAvalaibility({
        commentId: strCommentId1,
        owner: strUserId,
      });

      expect(verifyLikeAvalaibility).toEqual(true);
    });

    it('verifyLikeAvalaibility should return false if like does not exists', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const verifyLikeAvalaibility = await likeCommentRepositoryPostgres.verifyLikeAvalaibility({
        commentId: strCommentId2,
        owner: strUserId,
      });

      expect(verifyLikeAvalaibility).toEqual(false);
    });
  });

  describe('addLikeComment function', () => {
    it('addLikeComment function should add database entry for said like', async () => {
      const newLikeComment = new NewLikeComment({
        commentId: strCommentId1,
        owner: strUserId,
      });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addLikeComment = await likeCommentRepositoryPostgres.addLikeComment(newLikeComment);
      const commnetLike = await LikesCommentTableTestHelper
        .getLikeByCommentIdAndOwner(newLikeComment);

      expect(addLikeComment).toStrictEqual(({
        id: 'like-1111111111',
      }));
      const expectCommentLike = {
        id: 'like-1111111111',
        comment_id: 'comment-1111111',
        owner: 'user-1111111111',
      };
      expect(commnetLike.id).toStrictEqual(expectCommentLike.id);
      expect(commnetLike.comment_id).toStrictEqual(expectCommentLike.comment_id);
      expect(commnetLike.owner).toStrictEqual(expectCommentLike.owner);
    });
  });

  describe('deleteLikeByCommentIdAndOwner function', () => {
    it('deleteLikeByCommentIdAndOwner should not throw error when deleting like', async () => {
      await LikesCommentTableTestHelper.addLikeComment({
        id: strLikeId,
        commentId: strCommentId1,
        owner: strUserId,
      });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});

      await expect(likeCommentRepositoryPostgres.deleteLikeByCommentIdAndOwner({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      })).resolves.not.toThrowError();
    });

    it('deleteLikeByCommentIdAndOwner should throw error when deleting non-existing like', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});

      await expect(likeCommentRepositoryPostgres.deleteLikeByCommentIdAndOwner({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      })).rejects.toThrowError();
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('getLikeCountByCommentId function should get right likeCount #Like1', async () => {
      await LikesCommentTableTestHelper
        .addLikeComment({ commentId: strCommentId1, owner: strUserId });

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const likeCount = await likeCommentRepositoryPostgres
        .getLikeCountByCommentId(strCommentId1);

      expect(likeCount).toEqual(1);
    });

    it('getLikeCountByCommentId function should get right likeCount #Like2', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});

      const likeCount = await likeCommentRepositoryPostgres.getLikeCountByCommentId(strCommentId2);

      expect(likeCount).toEqual(0);
    });
  });
});
