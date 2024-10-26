const CommentReplyDetails = require("../CommentReplyDetails");

describe("CommentReplyDetails", () => {
  const validPayload = {
    id: "valid-id",
    content: "some content",
    date: "2024-09-07",
    username: "valid-username",
  };

  it("should throw an error when payload does not contain required properties", () => {
    // Arrange
    const invalidPayload = {
      content: "something",
      date: "something",
      username: "something",
    };

    // Action and Assert
    expect(() => new CommentReplyDetails(invalidPayload)).toThrowError(
      "COMMENT_REPLY_DETAILS.MISSING_REQUIRED_PROPERTIES"
    );
  });

  it("should throw an error when payload contains properties with incorrect data types", () => {
    // Arrange
    const invalidPayload = {
      id: "something",
      content: "something",
      date: 123, // Invalid data type
      username: "something",
    };

    // Action and Assert
    expect(() => new CommentReplyDetails(invalidPayload)).toThrowError(
      "COMMENT_REPLY_DETAILS.INVALID_PROPERTY_TYPE"
    );
  });

  it("should create an instance when payload is valid", () => {
    // Action
    const commentReplyDetails = new CommentReplyDetails(validPayload);

    // Assert
    expect(commentReplyDetails).toBeDefined();
  });
});
