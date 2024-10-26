const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentReplyRepository = require('../../Domains/comment_replies/CommentReplyRepository');
const AddedCommentReply = require('../../Domains/comment_replies/entities/AddedCommentReply');

const INSERT_COMMENT_REPLY_QUERY = 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7) Returning id, content, user_id';
const SELECT_COMMENT_REPLY_BY_ID_QUERY = 'SELECT * FROM comment_replies WHERE id = $1';
const SELECT_COMMENT_REPLY_BY_COMMENT_ID_QUERY = 'SELECT * FROM comment_replies WHERE comment_id = $1 ORDER BY created_at ASC';
const UPDATE_COMMENT_REPLY_QUERY = 'UPDATE comment_replies SET content = $1, is_delete = true WHERE id = $2 AND thread_id = $3 AND user_id = $4 AND comment_id = $5 RETURNING id';

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
   constructor(pool, idGenerator) {
      super();
      this._pool = pool;
      this._idGenerator = idGenerator;
   }

   async addCommentReply(commentReplyContent, threadId, commentId, ownerId) {
      const id = `reply-${this._idGenerator()}`;
      const createdAt = new Date();
      const isDelete = false;

      const result = await this._pool.query({
         text: INSERT_COMMENT_REPLY_QUERY,
         values: [
            id,
            commentReplyContent,
            createdAt,
            ownerId,
            threadId,
            commentId,
            isDelete,
         ],
      });

      const { id: replyId, content, user_id: owner } = result.rows[0];

      return new AddedCommentReply({
         id: replyId,
         content,
         owner,
      });
   }

   async getCommentReplyById(commentReplyId) {
      const result = await this._pool.query({
         text: SELECT_COMMENT_REPLY_BY_ID_QUERY,
         values: [commentReplyId],
      });

      if (!result.rowCount) {
         throw new NotFoundError('comment reply not found');
      }

      return result.rows[0];
   }

   async getCommentReplyByCommentId(commentId) {
      const result = await this._pool.query({
         text: SELECT_COMMENT_REPLY_BY_COMMENT_ID_QUERY,
         values: [commentId],
      });

      return result.rowCount ? result.rows : [];
   }

   async deleteCommentReply(commentReplyId, threadId, commentId, ownerId) {
      const deletedContent = '**balasan telah dihapus**';

      const result = await this._pool.query({
         text: UPDATE_COMMENT_REPLY_QUERY,
         values: [deletedContent, commentReplyId, threadId, ownerId, commentId],
      });

      if (!result.rowCount) {
         throw new InvariantError('failed to delete comment');
      }
   }
}

module.exports = CommentReplyRepositoryPostgres;
