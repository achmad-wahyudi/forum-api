const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name);

    const addedReplyComment = await addReplyCommentUseCase.execute(
      request.payload, request.params, owner,
    );
    const response = h.response({
      status: 'success',
      data: {
        addedReply: addedReplyComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);

    await await deleteReplyCommentUseCase.execute(request.params, owner);
    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = RepliesHandler;
