const CommentReplyRepository = require("../CommentReplyRepository");

describe("CommentReplyRepository interface", () => {
  it("should throw an error when abstract methods are called", async () => {
    // Arrange
    const commentReplyRepository = new CommentReplyRepository();
    const expectedError = "COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED";

    const methodsToTest = [
      () => commentReplyRepository.addCommentReply("", "", "", ""),
      () => commentReplyRepository.getCommentReplyById(""),
      () => commentReplyRepository.getCommentReplyByCommentId(""),
      () => commentReplyRepository.deleteCommentReply("", "", "", ""),
    ];

    for (const method of methodsToTest) {
      await expect(method()).rejects.toThrowError(expectedError);
    }
  });
});
