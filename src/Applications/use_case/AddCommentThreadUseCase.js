const NewCommentThread = require('../../Domains/comments-thread/entities/NewCommentThread');

class AddCommentThreadUseCase {
  constructor({
    threadRepository, commentThreadRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCasePayload, paramThread, owner) {
    await this._threadRepository.verifyThreadAvalaibility(paramThread.threadId);
    const newCommentThread = new NewCommentThread({
      ...useCasePayload, threadId: paramThread.threadId, owner,
    });
    return this._commentThreadRepository.addCommentThread(newCommentThread);
  }
}

module.exports = AddCommentThreadUseCase;
