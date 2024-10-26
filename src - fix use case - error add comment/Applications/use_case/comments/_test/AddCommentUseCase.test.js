const CommentRepository = require("../../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const UserRepository = require("../../../../Domains/users/UserRepository");
const NewComment = require("../../../../Domains/comments/entities/NewComment");
const AddedComment = require("../../../../Domains/comments/entities/AddedComment");
const AddCommentUseCase = require("../AddCommentUseCase");

describe("AddCommentUseCase", () => {
  const useCasePayload = {
    content: "This is comment",
  };

  const useCaseCredential = {
    id: "user-123",
  };

  const useCaseThreadId = {
    id: "thread-123",
  };

  const mockAddedComment = new AddedComment({
    id: "comment-123",
    content: useCasePayload.content,
    owner: useCaseCredential.id,
  });

  let mockRepositories;
  let addCommentUseCase;

  beforeEach(() => {
    mockRepositories = {
      commentRepository: new CommentRepository(),
      threadRepository: new ThreadRepository(),
      userRepository: new UserRepository(),
    };

    // Mock repository methods
    mockRepositories.threadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(useCaseThreadId);
    mockRepositories.userRepository.getUserById = jest
      .fn()
      .mockResolvedValue(useCaseCredential);
    mockRepositories.commentRepository.addComment = jest
      .fn()
      .mockResolvedValue(mockAddedComment);

    // Initialize use case
    addCommentUseCase = new AddCommentUseCase(mockRepositories);
  });

  it("must correctly orchestrate the add comment use case", async () => {
    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      useCaseThreadId.id,
      useCaseCredential.id
    );

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(
      mockRepositories.threadRepository.getThreadById
    ).toHaveBeenCalledWith(useCaseThreadId.id);
    expect(mockRepositories.userRepository.getUserById).toHaveBeenCalledWith(
      useCaseCredential.id
    );
    expect(mockRepositories.commentRepository.addComment).toHaveBeenCalledWith(
      new NewComment({
        content: useCasePayload.content,
      }).content,
      useCaseThreadId.id,
      useCaseCredential.id
    );
  });
});
