class DetailCommentThread {
  constructor(payload) {
    const {
      id, username, date, content, replies = [], likeCount, is_deleted: isDeleted,
    } = payload;
    this._verifyPayload(payload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.replies = replies;
    this.likeCount = likeCount;

    this._deleteContent(isDeleted);
  }

  _deleteContent(isDeleted) {
    if (isDeleted) this.content = '**komentar telah dihapus**';
  }

  _verifyPayload({
    id, username, date, content, replies = [], likeCount,
  }) {
    if (!id || !username || !date || !content || !replies) {
      throw new Error('DETAIL_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || !(Array.isArray(replies))
      || typeof likeCount !== 'number') {
      throw new Error('DETAIL_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailCommentThread;
