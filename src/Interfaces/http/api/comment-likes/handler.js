const AddCommentLikeUseCase = require('../../../../Applications/use_case/AddCommentLikeUseCase');

class CommentLikesHandler {
  constructor(container) {
    this._container = container;

    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
  }

  async putCommentLikeHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const addCommentLikeUseCase = this._container.getInstance(AddCommentLikeUseCase.name);
    await addCommentLikeUseCase.execute(
      request.params, owner,
    );

    const response = h.response({
      status: 'success',
    });
    response.code(200);

    return response;
  }
}

module.exports = CommentLikesHandler;
