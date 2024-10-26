const ThreadRepository = require("../../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../../Domains/threads/entities/AddedThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  let addThreadUseCase;
  const useCasePayload = {
    title: "Title for thread",
    body: "This is body for thread",
  };

  const useCaseCredential = {
    id: "user-123",
  };

  const mockAddedThread = new AddedThread({
    id: "thread-123",
    title: "Title for thread",
    owner: "user-123",
  });

  const mockThreadRepository = {
    addNewThread: jest.fn().mockResolvedValue(mockAddedThread),
  };

  beforeEach(() => {
    addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });
  });

  it("must orchestrate the add thread action correctly", async () => {
    // Act
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      useCaseCredential
    );

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);
  });
});
