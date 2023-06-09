class ReplyRepository {
  async addReplyComment(newReplyComment) {
    throw new Error('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getRepliesByThreadId(threadId) {
    throw new Error('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyAvalaibility({ threadId, commentId, replyId }) {
    throw new Error('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyAccess({ replyId, ownerId }) {
    throw new Error('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReplyById(replyId) {
    throw new Error('REPLY_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ReplyRepository;
