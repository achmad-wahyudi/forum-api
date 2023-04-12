class NewReplyComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      commentId, owner, content,
    } = payload;

    this.commentId = commentId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ commentId, owner, content }) {
    if (!commentId || !owner || !content) {
      throw new Error('NEW_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (
      typeof commentId !== 'string'
            || typeof owner !== 'string'
            || typeof content !== 'string'
    ) {
      throw new Error('NEW_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReplyComment;
