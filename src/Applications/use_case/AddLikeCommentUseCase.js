const NewLikeComment = require('../../Domains/likes-comment/entities/NewLikeComment');

class AddLikeCommentUseCase {
  constructor({
    commentThreadRepository, likeCommentRepository,
  }) {
    this._commentThreadRepository = commentThreadRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(paramCommentLike, owner) {
    await this._commentThreadRepository.checkCommentIsExist(paramCommentLike);

    const newLikeComment = new NewLikeComment({
      commentId: paramCommentLike.commentId, owner,
    });

    if (await this._likeCommentRepository.verifyLikeAvalaibility(newLikeComment)) {
      await this._likeCommentRepository.deleteLikeByCommentIdAndOwner(newLikeComment);
    } else {
      await this._likeCommentRepository.addLikeComment(newLikeComment);
    }
  }
}

module.exports = AddLikeCommentUseCase;
