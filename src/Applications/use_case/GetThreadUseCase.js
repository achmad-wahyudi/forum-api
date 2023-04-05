/* eslint-disable no-await-in-loop */
class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getThreadById(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const threadReplies = await this._replyRepository.getRepliesByThreadId(threadId);

    // eslint-disable-next-line no-restricted-syntax
    for (const comment of threadDetail.comments) {
      comment.replies = this._getRepliesForComments(comment, threadReplies);

      comment.likeCount = await this._getLikeCountForComments(comment);
    }

    return threadDetail;
  }

  _getRepliesForComments(comment, threadReplies) {
    return threadReplies
      .filter((reply) => reply.commentId === comment.id)
      .map((reply) => {
        const { commentId, ...replyDetail } = reply;
        return replyDetail;
      });
  }

  async _getLikeCountForComments(comment) {
    return this._likeRepository.getLikeCountByCommentId(comment.id);
  }
}

module.exports = GetThreadUseCase;
