const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const OwnerValidator = require("../../../security/OwnerValidator");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  let mockCommentRepository;
  let mockOwnerValidator;
  let deleteCommentUseCase;

  beforeEach(() => {
    mockCommentRepository = new CommentRepository();
    mockOwnerValidator = new OwnerValidator();
    deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      ownerValidator: mockOwnerValidator,
    });

    mockCommentRepository.getCommentById = jest.fn();
    mockOwnerValidator.verifyOwner = jest.fn();
    mockCommentRepository.deleteComment = jest.fn();
  });

  it("must correctly orchestrate the delete comment process", async () => {
    // Arrange
    const commentId = "comment-212";
    const threadId = "thread-212";
    const credential = "user-212";

    const comment = {
      id: commentId,
      user_id: credential,
    };

    mockCommentRepository.getCommentById.mockResolvedValue(comment);
    mockOwnerValidator.verifyOwner.mockResolvedValue();
    mockCommentRepository.deleteComment.mockResolvedValue();

    // Action
    await deleteCommentUseCase.execute(commentId, threadId, credential);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(
      commentId
    );
    expect(mockOwnerValidator.verifyOwner).toHaveBeenCalledWith(
      credential,
      comment.user_id,
      "comment"
    );
  });
});
