class DeleteCommentReplyUseCase {
   constructor({ commentReplyRepository, ownerValidator }) {
      this._commentReplyRepository = commentReplyRepository;
      this._ownerValidator = ownerValidator;
   }

   async execute(
      useCaseCommentReplyId,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential,
   ) {
      const commentReply = await this._commentReplyRepository.getCommentReplyById(
         useCaseCommentReplyId,
      );

      // Validasi pemilik dari comment reply
      await this._ownerValidator.verifyOwner(
         useCaseCredential,
         commentReply.user_id,
         'comment reply',
      );

      // Hapus comment reply
      return this._commentReplyRepository.deleteCommentReply(
         commentReply.id,
         useCaseThreadId,
         useCaseCommentId,
         useCaseCredential,
      );
   }
}

module.exports = DeleteCommentReplyUseCase;
