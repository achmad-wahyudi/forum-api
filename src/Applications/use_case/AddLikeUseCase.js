const NewLike = require('../../Domains/likes/entities/NewLike');

class AddLikeUseCase {
  constructor({
    commentRepository, likeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParam, owner) {
    await this._commentRepository.checkCommentIsExist(useCaseParam);
    const newLike = new NewLike({
      commentId: useCaseParam.commentId, owner,
    });

    if (await this._likeRepository.checkLikeIsExists(newLike)) {
      await this._likeRepository.deleteLikeByCommentIdAndOwner(newLike);
    } else {
      await this._likeRepository.addLike(newLike);
    }
  }
}

module.exports = AddLikeUseCase;
