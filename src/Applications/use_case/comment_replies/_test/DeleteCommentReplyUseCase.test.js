const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");
const OwnerValidator = require("../../../security/OwnerValidator");
const DeleteCommentReplyUseCase = require("../DeleteCommentReplyUseCase");

describe("DeleteCommentReplyUseCase", () => {
  it("should correctly manage the deletion process of a comment reply", async () => {
    // Arrange
    const commentReplyId = "reply-212";
    const commentId = "comment-212";
    const threadId = "thread-212";
    const userId = "user-212";

    const existingCommentReply = {
      id: commentReplyId,
      user_id: userId,
    };

    const mockCommentReplyRepository = {
      getCommentReplyById: jest.fn().mockResolvedValue(existingCommentReply),
      deleteCommentReply: jest.fn().mockResolvedValue(),
    };

    const mockOwnerValidator = {
      verifyOwner: jest.fn().mockResolvedValue(),
    };

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      ownerValidator: mockOwnerValidator,
    });

    // Act
    await deleteCommentReplyUseCase.execute(
      commentReplyId,
      threadId,
      commentId,
      userId
    );

    // Assert
    expect(mockCommentReplyRepository.getCommentReplyById).toHaveBeenCalledWith(
      commentReplyId
    );
    expect(mockOwnerValidator.verifyOwner).toHaveBeenCalledWith(
      userId,
      existingCommentReply.user_id,
      "comment reply"
    );
  });
});
