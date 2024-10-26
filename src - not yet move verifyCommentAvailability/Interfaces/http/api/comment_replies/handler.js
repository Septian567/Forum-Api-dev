const AddCommentReplyUseCase = require('../../../../Applications/use_case/comment_replies/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/comment_replies/DeleteCommentReplyUseCase');

class CommentReplyHandler {
   constructor(container) {
      this._container = container;
      this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
      this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
   }

   async postCommentReplyHandler(request, h) {
      const addCommentReplyUseCase = this._container.getInstance(
         AddCommentReplyUseCase.name,
      );
      const { id: ownerId } = request.auth.credentials;
      const { threadId, commentId } = request.params;
      const addedCommentReply = await addCommentReplyUseCase.execute(
         request.payload,
         threadId,
         commentId,
         ownerId,
      );

      return h
         .response({
            status: 'success',
            data: {
               addedReply: addedCommentReply,
            },
         })
         .code(201);
   }

   async deleteCommentReplyHandler(request, h) {
      const deleteCommentReplyUseCase = this._container.getInstance(
         DeleteCommentReplyUseCase.name,
      );
      const { id: credentialId } = request.auth.credentials; // Perbaiki nama variabel jika perlu
      const { threadId, commentId, commentReplyId } = request.params;

      await deleteCommentReplyUseCase.execute(
         commentReplyId,
         threadId,
         commentId,
         credentialId,
      );

      return {
         status: 'success',
      };
   }
}

module.exports = CommentReplyHandler;
