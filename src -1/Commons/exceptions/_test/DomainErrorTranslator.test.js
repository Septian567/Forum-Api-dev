const DomainErrorTranslator = require("../DomainErrorTranslator");
const InvariantError = require("../InvariantError");

describe("DomainErrorTranslator", () => {
  it("should correctly translate errors", () => {
    // Daftar error yang akan diuji
    const errorsToTest = [
      {
        error: new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"),
        expected: new InvariantError(
          "cannot create a new user because a required property is missing"
        ),
      },
      {
        error: new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"),
        expected: new InvariantError(
          "cannot create a new user because data type is incorrect"
        ),
      },
      {
        error: new Error("REGISTER_USER.USERNAME_LIMIT_CHAR"),
        expected: new InvariantError(
          "cannot create a new user because the username exceeds the character limit"
        ),
      },
      {
        error: new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"),
        expected: new InvariantError(
          "cannot create a new user because the username contains restricted characters"
        ),
      },
    ];

    // Menguji setiap error dalam daftar
    errorsToTest.forEach(({ error, expected }) => {
      expect(DomainErrorTranslator.translate(error)).toStrictEqual(expected);
    });
  });

  it("should return the original error when the error message does not need translation", () => {
    // Error yang tidak perlu diterjemahkan
    const error = new Error("some_error_message");

    // Menerjemahkan error
    const translatedError = DomainErrorTranslator.translate(error);

    // Memastikan error yang diterjemahkan sama dengan error asli
    expect(translatedError).toStrictEqual(error);
  });
});
