const CommentRepository = require("../CommentRepository");

describe("CommentRepository interface", () => {
  it("should throw an error for unimplemented methods", async () => {
    // Arrange
    const commentRepository = new CommentRepository();
    const methodsToTest = [
      {
        method: () => commentRepository.addComment("", "", ""),
        name: "addComment",
      },
      {
        method: () => commentRepository.getCommentById(""),
        name: "getCommentById",
      },
      {
        method: () => commentRepository.getCommentByThreadId(""),
        name: "getCommentByThreadId",
      },
      {
        method: () => commentRepository.deleteComment("", "", ""),
        name: "deleteComment",
      },
    ];

    // Act and Assert: expect each method to throw the same error
    for (const { method } of methodsToTest) {
      await expect(method()).rejects.toThrowError(
        "COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED"
      );
    }
  });
});
