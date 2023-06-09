const CommentThreadRepository = require('../../Domains/comments-thread/CommentThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const DetailCommentThread = require('../../Domains/comments-thread/entities/DetailCommentThread');

class CommentThreadRepositoryPostgres extends CommentThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentThread(newCommentThread) {
    const {
      content, threadId, owner,
    } = newCommentThread;
    const id = `comment-${this._idGenerator(10)}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, owner, content],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted=TRUE WHERE id=$1 RETURNING id',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('tidak bisa menghapus comment karena comment tidak ada');
    }
  }

  async verifyCommentAccess({ commentId, ownerId }) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('proses gagal karena Anda tidak mempunyai akses ke aksi ini');
    }
  }

  async verifyCommentAvalaibility({ threadId, commentId }) {
    const query = {
      text: ` SELECT 1
      FROM comments INNER JOIN threads ON comments.thread_id = threads.id
      WHERE threads.id = $1
      AND comments.id = $2
      `,
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment yang Anda cari tidak ada');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT  comments.id,
              comments.is_deleted,
              comments.content AS content,
              comments.date, 
              users.username
              FROM comments INNER JOIN users
              ON comments.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY comments.date ASC`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows.map((entry) => new DetailCommentThread({
      ...entry,
      date: entry.date.toISOString(),
      likeCount: 0,
    }));
  }

  async checkCommentInThread({ threadId, commentId }) {
    const query = {
      text: 'SELECT 1 FROM comments WHERE id = $1 AND thread_id= $2',
      values: [commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0]) {
      throw new NotFoundError('comment yang anda cari tidak ada di thread ini');
    }
  }
}

module.exports = CommentThreadRepositoryPostgres;
