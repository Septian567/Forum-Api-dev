const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

const INSERT_COMMENT_QUERY =
  "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, user_id";
const SELECT_COMMENT_BY_ID_QUERY = "SELECT * FROM comments WHERE id = $1";
const SELECT_COMMENTS_BY_THREAD_ID_QUERY =
  "SELECT * FROM comments WHERE thread_id = $1 ORDER BY created_at ASC";
const UPDATE_COMMENT_QUERY =
  "UPDATE comments SET content = $1, is_delete = true WHERE id = $2 AND thread_id = $3 AND user_id = $4 RETURNING id";

class CommentRepositoryPostgress extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(commentContent, threadId, ownerId) {
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date();
    const isDeleted = false;

    const query = {
      text: INSERT_COMMENT_QUERY,
      values: [id, commentContent, createdAt, ownerId, threadId, isDeleted],
    };

    const result = await this._pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async verifyCommentAvailability(commentId) {
    const query = {
      text: SELECT_COMMENT_BY_ID_QUERY,
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async getCommentById(commentId) {
    // Verifikasi apakah komentar tersedia
    await this.verifyCommentAvailability(commentId);

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

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("gagal menghapus komentar ..");
    }
  }
}

module.exports = CommentRepositoryPostgress;