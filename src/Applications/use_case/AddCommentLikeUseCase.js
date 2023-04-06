const NewLikeComment = require('../../Domains/comment-likes/entities/NewCommentLike');

class AddCommentLikeUseCase {
  constructor({
    commentRepository, commentLikeRepository,
  }) {
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(paramCommentLike, owner) {
    await this._commentRepository.checkCommentIsExist(paramCommentLike);

    const newLikeComment = new NewLikeComment({
      commentId: paramCommentLike.commentId, owner,
    });

    if (await this._commentLikeRepository.verifyLikeAvalaibility(newLikeComment)) {
      await this._commentLikeRepository.deleteLikeByCommentIdAndOwner(newLikeComment);
    } else {
      await this._commentLikeRepository.addCommentLike(newLikeComment);
    }
  }
}

module.exports = AddCommentLikeUseCase;
