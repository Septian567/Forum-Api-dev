const NewCommentReply = require('../../../Domains/comment_replies/entities/NewCommentReply');

class AddCommentReplyUseCase {
   constructor({
      commentReplyRepository,
      commentRepository,
      threadRepository,
      userRepository,
   }) {
      this._commentReplyRepository = commentReplyRepository;
      this._commentRepository = commentRepository;
      this._threadRepository = threadRepository;
      this._userRepository = userRepository;
   }

   async execute(
      useCasePayload,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential,
   ) {
      const { content } = new NewCommentReply(useCasePayload);

      const { id: commentId } = await this._verifyComment(useCaseCommentId);
      const { id: threadId } = await this._verifyThread(useCaseThreadId);
      const { id: userId } = await this._verifyUser(useCaseCredential);

      return this._commentReplyRepository.addCommentReply(
         content,
         threadId,
         commentId,
         userId,
      );
   }

   async _verifyComment(commentId) {
      return this._commentRepository.getCommentById(commentId);
   }

   async _verifyThread(threadId) {
      return this._threadRepository.getThreadById(threadId);
   }

   async _verifyUser(userId) {
      return this._userRepository.getUserById(userId);
   }
}

module.exports = AddCommentReplyUseCase;
