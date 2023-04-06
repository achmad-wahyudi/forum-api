const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const NewCommentLike = require('../../../Domains/comment-likes/entities/NewCommentLike');
const pool = require('../../database/postgres/pool');

describe('CommentLikeRepositoryPostgres', () => {
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
    await CommentsTableTestHelper.addComment({ id: strCommentId1, owner: strUserId });
    await CommentsTableTestHelper.addComment({ id: strCommentId2, owner: strUserId });
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyLikeAvalaibility function', () => {
    it('verifyLikeAvalaibility should return true if like exists', async () => {
      await CommentLikesTableTestHelper.addCommentLike({
        id: strLikeId,
        commentId: strCommentId1,
        owner: strUserId,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const verifyLikeAvalaibility = await commentLikeRepositoryPostgres.verifyLikeAvalaibility({
        commentId: strCommentId1,
        owner: strUserId,
      });

      expect(verifyLikeAvalaibility).toEqual(true);
    });

    it('verifyLikeAvalaibility should return false if like does not exists', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const verifyLikeAvalaibility = await commentLikeRepositoryPostgres.verifyLikeAvalaibility({
        commentId: strCommentId2,
        owner: strUserId,
      });

      expect(verifyLikeAvalaibility).toEqual(false);
    });
  });

  describe('addCommentLike function', () => {
    it('addCommentLike function should add database entry for said like', async () => {
      const newCommentLike = new NewCommentLike({
        commentId: strCommentId1,
        owner: strUserId,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addCommentLike = await commentLikeRepositoryPostgres.addCommentLike(newCommentLike);
      const commnetLike = await CommentLikesTableTestHelper
        .getLikeByCommentIdAndOwner(newCommentLike);

      expect(addCommentLike).toStrictEqual(({
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
      await CommentLikesTableTestHelper.addCommentLike({
        id: strLikeId,
        commentId: strCommentId1,
        owner: strUserId,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await expect(commentLikeRepositoryPostgres.deleteLikeByCommentIdAndOwner({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      })).resolves.not.toThrowError();
    });

    it('deleteLikeByCommentIdAndOwner should throw error when deleting non-existing like', async () => {
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await expect(commentLikeRepositoryPostgres.deleteLikeByCommentIdAndOwner({
        commentId: 'comment-1111111',
        owner: 'user-1111111111',
      })).rejects.toThrowError();
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('getLikeCountByCommentId function should get right likeCount #Like1', async () => {
      await CommentLikesTableTestHelper
        .addCommentLike({ commentId: strCommentId1, owner: strUserId });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});
      const likeCount = await commentLikeRepositoryPostgres
        .getLikeCountByCommentId(strCommentId1);

      expect(likeCount).toEqual(1);
    });

    it('getLikeCountByCommentId function should get right likeCount #Like2', async () => {
      const likeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId(strCommentId2);

      expect(likeCount).toEqual(0);
    });
  });
});
