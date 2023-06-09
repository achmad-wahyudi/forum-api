/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReplyComment({
    id = 'reply-111111111',
    commentId = 'comment-1111111',
    owner = 'user-1111111111',
    content = 'content reply',
    isDeleted = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, owner, content, isDeleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async deleteReplyById(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted=TRUE WHERE id=$1',
      values: [id],
    };
    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },

};

module.exports = RepliesTableTestHelper;
