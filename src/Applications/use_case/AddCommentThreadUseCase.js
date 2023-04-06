const NewCommentThread = require('../../Domains/comments-thread/entities/NewCommentThread');

class AddCommentThreadUseCase {
  constructor({
    threadRepository, commentThreadRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._threadRepository.verifyThreadAvalaibility(useCaseParam.threadId);
    const newCommentThread = new NewCommentThread({
      ...useCasePayload, owner, threadId: useCaseParam.threadId,
    });
    return this._commentThreadRepository.addCommentThread(newCommentThread);
  }
}

module.exports = AddCommentThreadUseCase;
