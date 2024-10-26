/* eslint-disable no-undef */

const NewThread = require("../NewThread");

describe("NewThread entity", () => {
  const createNewThread = (payload) => () => new NewThread(payload);

  it("should throw error when payload lacks required properties", () => {
    const payload = {
      title: "something",
      content: "something",
    };

    expect(createNewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload has incorrect data types", () => {
    const payload = {
      title: "something",
      body: 123,
    };

    expect(createNewThread(payload)).toThrowError(
      "NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE"
    );
  });

  it("should throw error when the title exceeds 50 characters", () => {
    const payload = {
      title:
        "something longer than 50 character and it really hard to have such an error and you did not find it in your last code",
      body: "this is body",
    };

    expect(createNewThread(payload)).toThrowError(
      "NEW_THREAD.TITLE_EXCEED_CHAR_LIMIT"
    );
  });
});
