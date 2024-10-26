const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const NewCommentReply = require("../../../../Domains/comment_replies/entities/NewCommentReply");
const AddedCommentReply = require("../../../../Domains/comment_replies/entities/AddedCommentReply");
const AddCommentReplyUseCase = require("../AddCommentReplyUseCase");
const CommentReplyRepository = require("../../../../Domains/comment_replies/CommentReplyRepository");

describe("AddCommentReplyUseCase", () => {
  it("should properly orchestrate the addition of a comment reply", async () => {
    // Arrange
    const useCasePayload = { content: "This is a comment" };
    const useCaseCredential = { id: "user-123" };
    const useCaseThreadId = { id: "thread-123" };
    const useCaseCommentId = { id: "comment-123" };

    const mockAddedCommentReply = new AddedCommentReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCaseCredential.id,
    });

    // Create mock repositories
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    // Mock functions
    jest
      .spyOn(mockCommentRepository, "getCommentById")
      .mockResolvedValue(useCaseCommentId);
    jest
      .spyOn(mockThreadRepository, "getThreadById")
      .mockResolvedValue(useCaseThreadId);
    jest
      .spyOn(mockUserRepository, "getUserById")
      .mockResolvedValue(useCaseCredential);
    jest
      .spyOn(mockCommentReplyRepository, "addCommentReply")
      .mockResolvedValue(mockAddedCommentReply);

    // Create use case instance
    const addCommentReplyUseCase = new AddCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    // Action
    const addedComment = await addCommentReplyUseCase.execute(
      useCasePayload,
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );

    // Assert
    expect(addedComment).toStrictEqual(mockAddedCommentReply);

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      useCaseThreadId.id
    );
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(
      useCaseCredential.id
    );
    expect(mockCommentReplyRepository.addCommentReply).toHaveBeenCalledWith(
      new NewCommentReply({
        content: useCasePayload.content,
      }).content,
      useCaseThreadId.id,
      useCaseCommentId.id,
      useCaseCredential.id
    );
  });
});
