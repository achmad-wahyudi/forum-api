class DeleteCommentThreadUseCase {
  constructor({
    commentThreadRepository,
  }) {
    this._commentThreadRepository = commentThreadRepository;
  }

  async execute(useCaseParam, owner) {
    const { threadId, commentId } = useCaseParam;

    await this._commentThreadRepository.verifyCommentAvalaibility({ threadId, commentId });
    await this._commentThreadRepository.verifyCommentAccess({ commentId, ownerId: owner });
    await this._commentThreadRepository.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentThreadUseCase;
