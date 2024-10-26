/* eslint-disable no-undef */

const ThreadDetails = require("../ThreadDetails");

describe("ThreadDetails", () => {
  const createThreadDetails = (payload) => {
    return () => new ThreadDetails(payload);
  };

  it("throws an error if payload is missing required properties", () => {
    // Arrange
    const payload = {
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: [],
    };

    // Action and Assert
    expect(createThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("throws an error if payload contains incorrect data type", () => {
    // Arrange
    const payload = {
      id: "something",
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: "[]", // Invalid data type
    };

    // Action and Assert
    expect(createThreadDetails(payload)).toThrowError(
      "THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("successfully creates instance if payload is valid", () => {
    // Arrange
    const payload = {
      id: "something",
      title: "something",
      body: "something",
      date: "something",
      username: "something",
      comments: [],
    };

    // Action
    const threadDetails = new ThreadDetails(payload);

    // Assert
    expect(threadDetails).toBeDefined();
  });
});
