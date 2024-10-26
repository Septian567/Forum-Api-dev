const AuthenticationRepository = require("../../../../Domains/authentications/AuthenticationRepository");
const DeleteAuthenticationUseCase = require("../DeleteAuthenticationUseCase");

describe("DeleteAuthenticationUseCase", () => {
  let deleteAuthenticationUseCase;
  let mockAuthenticationRepository;

  beforeEach(() => {
    mockAuthenticationRepository = new AuthenticationRepository();
    deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });
  });

  const expectErrorOnExecute = async (useCasePayload, expectedError) => {
    await expect(
      deleteAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(expectedError);
  };

  test("must raise an error if use case payload does not contain refresh token", async () => {
    // Arrange
    const useCasePayload = {};

    // Act & Assert
    await expectErrorOnExecute(
      useCasePayload,
      "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  test("must raise an error if refresh token is not a string", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };

    // Act & Assert
    await expectErrorOnExecute(
      useCasePayload,
      "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  test("must handle the delete authentication action properly", async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: "refreshToken",
    };
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue();
    mockAuthenticationRepository.deleteToken = jest.fn().mockResolvedValue();

    // Act
    await deleteAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
