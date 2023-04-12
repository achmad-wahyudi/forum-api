class CommentThreadRepository {
  async addCommentThread(newCommentThread) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentsByThreadId(commentId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentAvalaibility({ threadId, commentId }) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyCommentAccess({ commentId, ownerId }) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteCommentById(commentId) {
    throw new Error('COMMENT_THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentThreadRepository;
