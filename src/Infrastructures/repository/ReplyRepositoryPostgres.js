const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const {
      commentId, owner, content,
    } = newReply;
    const id = `reply-${this._idGenerator(10)}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async checkReplyIsExist({ threadId, commentId, replyId }) {
    const query = {
      text: `SELECT 1 
      FROM replies
      INNER JOIN comments ON replies.comment_id = comments.id
      WHERE replies.id = $1
      AND replies.comment_id = $2
      AND comments.thread_id = $3
      AND replies.is_deleted = false`,
      values: [replyId, commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('reply yang Anda cari tidak ada');
    }
  }

  async verifyReplyAccess({ ownerId, replyId }) {
    const query = {
      text: 'SELECT 1 FROM replies WHERE owner = $1 AND id = $2',
      values: [ownerId, replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak melakukan aksi tersebut pada reply ini');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1 returning id',
      values: [replyId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('reply yang ingin Anda hapus tidak ada');
    }
  }

  async getRepliesByThreadId(id) {
    const query = {
      text: `SELECT replies.id, comments.id AS comment_id, 
              replies.is_deleted,
              replies.content AS content,
              replies.date,
              users.username 
              FROM replies 
              INNER JOIN comments ON replies.comment_id = comments.id
              INNER JOIN users ON replies.owner = users.id
              WHERE comments.thread_id = $1
              ORDER BY replies.date ASC`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.map((entry) => new DetailReply({
      ...entry,
      commentId: entry.comment_id,
      date: entry.date.toISOString(),
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
