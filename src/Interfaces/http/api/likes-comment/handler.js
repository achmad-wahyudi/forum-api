const AddLikeCommentUseCase = require('../../../../Applications/use_case/AddLikeCommentUseCase');

class LikesCommentHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addLikeCommentUseCase = this._container.getInstance(AddLikeCommentUseCase.name);

    await addLikeCommentUseCase.execute(
      request.params, owner,
    );

    const response = h.response({
      status: 'success',
    });
    response.code(200);

    return response;
  }
}

module.exports = LikesCommentHandler;
