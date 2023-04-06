const NewReplyComment = require('../../Domains/replies-comment/entities/NewReplyComment');

class AddReplyUseCase {
  constructor({ commentThreadRepository, replyCommentRepository }) {
    this._commentThreadRepository = commentThreadRepository;
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._commentThreadRepository.checkCommentBelongsToThread(useCaseParam);
    const newReplyComment = new NewReplyComment({
      ...useCasePayload, ...useCaseParam, owner,
    });
    return this._replyCommentRepository.addReplyComment(newReplyComment);
  }
}

module.exports = AddReplyUseCase;
