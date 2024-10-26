const CommentDetails = require("../CommentDetails");

describe("CommentDetails", () => {
  const testCases = [
    {
      description: "throws error when payload is missing required properties",
      payload: {
        content: "something",
        date: "something",
        username: "something",
        replies: [],
      },
      expectedError: "COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY",
    },
    {
      description: "throws error when payload contains incorrect data type",
      payload: {
        id: "something",
        content: "something",
        date: "something",
        username: "something",
        replies: "[]",
      },
      expectedError: "COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE",
    },
    {
      description: "creates instance successfully with valid payload",
      payload: {
        id: "something",
        content: "something",
        date: "something",
        username: "something",
        replies: [],
      },
      expectedError: null,
    },
  ];

  testCases.forEach(({ description, payload, expectedError }) => {
    it(description, () => {
      if (expectedError) {
        expect(() => new CommentDetails(payload)).toThrowError(expectedError);
      } else {
        const commentDetails = new CommentDetails(payload);
        expect(commentDetails).toBeDefined();
      }
    });
  });
});
