const AddCommentThreadUseCase = require('../../../../Applications/use_case/AddCommentThreadUseCase');
const DeleteCommentThreadUseCase = require('../../../../Applications/use_case/DeleteCommentThreadUseCase');

class CommentsThreadHandler {
  constructor(container) {
    this._container = container;

    this.postCommentThreadHandler = this.postCommentThreadHandler.bind(this);
    this.deleteCommentThreadHandler = this.deleteCommentThreadHandler.bind(this);
  }

  async postCommentThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addCommentThreadUseCase = this._container.getInstance(AddCommentThreadUseCase.name);

    const addedCommentThread = await addCommentThreadUseCase.execute(
      request.payload, request.params, owner,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment: {
          id: addedCommentThread.id,
          content: addedCommentThread.content,
          owner: addedCommentThread.owner,
        },
      },
    });
    response.code(201);

    return response;
  }

  async deleteCommentThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const deleteCommentThreadUseCase = this._container.getInstance(DeleteCommentThreadUseCase.name);

    await deleteCommentThreadUseCase.execute(request.params, owner);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsThreadHandler;
