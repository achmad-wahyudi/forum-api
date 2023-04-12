class DeleteReplyUseCase {
  constructor({ replyCommentRepository }) {
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCaseParam, owner) {
    await this._replyCommentRepository.verifyReplyAvalaibility(useCaseParam);
    await this._replyCommentRepository.verifyReplyAccess({
      ownerId: owner,
      replyId: useCaseParam.replyId,
    });
    await this._replyCommentRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
