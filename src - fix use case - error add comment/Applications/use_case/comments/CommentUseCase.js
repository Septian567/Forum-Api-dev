class CommentUseCase {
  constructor({
    commentRepository,
    threadRepository,
    userRepository,
    ownerValidator,
  }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._ownerValidator = ownerValidator;
  }

  // Method untuk menambahkan komentar
  async addComment(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    const thread = await this._verifyThread(useCaseThreadId);
    const user = await this._verifyUser(useCaseCredential);

    return this._commentRepository.addComment(content, thread.id, user.id);
  }

  // Method untuk menghapus komentar
  async deleteComment(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    await this._commentRepository.verifyCommentAvailability(useCaseCommentId); // Verifikasi komentar sebelum menghapus
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );

    await this._ownerValidator.verifyOwner(
      useCaseCredential,
      comment.user_id,
      "comment"
    );

    return this._commentRepository.deleteComment(
      comment.id,
      useCaseThreadId,
      useCaseCredential
    );
  }

  // Method untuk mendapatkan komentar
  async getComment(useCaseCommentId) {
    await this._commentRepository.verifyCommentAvailability(useCaseCommentId); // Verifikasi komentar
    return this._commentRepository.getCommentById(useCaseCommentId);
  }

  // Verifikasi thread
  async _verifyThread(threadId) {
    return this._threadRepository.getThreadById(threadId);
  }

  // Verifikasi user
  async _verifyUser(userId) {
    return this._userRepository.getUserById(userId);
  }
}

module.exports = CommentUseCase;
