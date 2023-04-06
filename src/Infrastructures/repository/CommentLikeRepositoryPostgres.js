const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentLikeRepository = require('../../Domains/comment-likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLikeAvalaibility({ commentId, owner }) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    return !!(result.rows.length);
  }

  async addCommentLike(newCommentLike) {
    const id = `like-${this._idGenerator(10)}`;
    const { commentId, owner } = newCommentLike;

    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteLikeByCommentIdAndOwner({ commentId, owner }) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('like tidak tersedia!');
    }
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT COUNT(*)::int FROM likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count;
  }
}

module.exports = CommentLikeRepositoryPostgres;
