const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._commentRepository.checkCommentBelongsToThread(useCaseParam);
    const newReply = new NewReply({
      ...useCasePayload, ...useCaseParam, owner,
    });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
