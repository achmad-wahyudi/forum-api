const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({
    threadRepository, commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._threadRepository.verifyThreadAvalaibility(useCaseParam.threadId);
    const newComment = new NewComment({
      ...useCasePayload, owner, threadId: useCaseParam.threadId,
    });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
