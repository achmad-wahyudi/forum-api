class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.verifyThreadAvalaibility(threadId);
    threadDetail.comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replyRepository = await this._replyRepository.getRepliesByThreadId(threadId);

    // eslint-disable-next-line no-restricted-syntax
    for (const element of threadDetail.comments) {
      element.replies = replyRepository
        .filter((reply) => reply.commentId === element.id)
        .map((reply) => {
          const { commentId, ...replyDetail } = reply;
          return replyDetail;
        });
    }

    return threadDetail;
  }
}

module.exports = GetThreadUseCase;
