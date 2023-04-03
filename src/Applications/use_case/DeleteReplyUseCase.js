class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCaseParam, owner) {
    await this._replyRepository.checkReplyIsExist(useCaseParam);
    await this._replyRepository.verifyReplyAccess({
      ownerId: owner,
      replyId: useCaseParam.replyId,
    });
    await this._replyRepository.deleteReplyById(useCaseParam.replyId);
  }
}

module.exports = DeleteReplyUseCase;
