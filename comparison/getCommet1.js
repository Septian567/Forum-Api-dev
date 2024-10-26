 async getCommentById(commentId) {
    const query = {
      text: SELECT_COMMENT_BY_ID_QUERY,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: SELECT_COMMENTS_BY_THREAD_ID_QUERY,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rowCount ? result.rows : [];
}
  
async deleteComment(commentId, threadId, ownerId) {
    const deletedContent = "**komentar telah dihapus**";

    const query = {
      text: UPDATE_COMMENT_QUERY,
      values: [deletedContent, commentId, threadId, ownerId],
    };

    await this._pool.query(query);
  }