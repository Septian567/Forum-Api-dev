async getCommentById(commentId) {
    const query = {
      text: SELECT_COMMENT_BY_ID_QUERY,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return GetComment.verifyCommentDeletion(result.rows[0]);
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: SELECT_COMMENTS_BY_THREAD_ID_QUERY,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return GetComment.verifyCommentDeletions(result.rows); 
}
  
  async deleteComment(commentId, threadId, ownerId) {
    const query = {
      text: UPDATE_COMMENT_IS_DELETED_QUERY,
      values: [commentId, threadId, ownerId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }