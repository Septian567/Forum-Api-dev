const CommentUseCase = require("../../../../Applications/use_case/comments/CommentUseCase");

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getCommentHandler = this.getCommentHandler.bind(this); // Tambahkan pengikatan untuk getCommentHandler
  }

  // Handler untuk menambahkan komentar
  async postCommentHandler(request, h) {
    const commentUseCase = this._getCommentUseCase();
    const ownerId = this._getOwnerId(request);
    const threadId = this._getThreadId(request);
    const addedComment = await commentUseCase.addComment(
      request.payload,
      threadId,
      ownerId
    );

    return this._createResponse(h, 201, { addedComment });
  }

  // Handler untuk menghapus komentar
  async deleteCommentHandler(request) {
    const commentUseCase = this._getCommentUseCase();
    const credentialId = this._getCredentialId(request);
    const { threadId, commentId } = this._getParams(request);

    await commentUseCase.deleteComment(commentId, threadId, credentialId);

    return this._createResponse(null, 200, {});
  }

  // Handler untuk mendapatkan komentar
  async getCommentHandler(request, h) {
    const commentUseCase = this._getCommentUseCase();
    const { commentId } = this._getParams(request); // Ambil commentId dari params

    const comment = await commentUseCase.getComment(commentId); // Panggil getComment

    return this._createResponse(h, 200, { comment });
  }

  // Mengambil instance dari CommentUseCase
  _getCommentUseCase() {
    return this._container.getInstance(CommentUseCase.name);
  }

  _getOwnerId(request) {
    return request.auth.credentials.id;
  }

  _getThreadId(request) {
    return request.params.threadId;
  }

  _getCredentialId(request) {
    return request.auth.credentials.id;
  }

  _getParams(request) {
    return {
      threadId: request.params.threadId,
      commentId: request.params.commentId,
    };
  }

  _createResponse(h, statusCode, data) {
    if (h) {
      const response = h.response({
        status: "success",
        data,
      });
      response.code(statusCode);
      return response;
    }

    return {
      status: "success",
      ...data,
    };
  }
}

module.exports = CommentHandler;
