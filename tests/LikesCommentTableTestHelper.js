/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
  async addLikeComment({
    id = 'like-1111111111',
    commentId = 'comment-1111111',
    owner = 'user-1111111111',
  }) {
    const query = {
      text: 'INSERT INTO likes (id, comment_id, owner) VALUES ($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async getLikeByCommentIdAndOwner({
    commentId = 'comment-1111111',
    owner = 'user-1111111111',
  }) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },

};

module.exports = LikesCommentTableTestHelper;
