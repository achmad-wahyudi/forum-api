const NewReplyComment = require('../../Domains/replies-comment/entities/NewReplyComment');

class AddReplyUseCase {
  constructor({ commentThreadRepository, replyCommentRepository }) {
    this._commentThreadRepository = commentThreadRepository;
    this._replyCommentRepository = replyCommentRepository;
  }

  async execute(useCasePayload, paramReplyComment, owner) {
    await this._commentThreadRepository.checkCommentInThread(paramReplyComment);
    const newReplyComment = new NewReplyComment({
      ...useCasePayload, ...paramReplyComment, owner,
    });
    return this._replyCommentRepository.addReplyComment(newReplyComment);
  }
}

module.exports = AddReplyUseCase;
