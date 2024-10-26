class GetComment {
  static verifyCommentDeletion(comment) {
    if (!comment) {
      return null;
    }

    if (comment.is_delete) {
      comment.content = "**komentar telah dihapus**";
    }

    return comment;
  }

  static verifyCommentDeletions(comments) {
    return comments.map((comment) => {
      if (comment.is_delete) {
        comment.content = "**komentar telah dihapus**";
      }
      return comment;
    });
  }
}

module.exports = GetComment;
