const AuthenticationRepository = require("../../../../Domains/authentications/AuthenticationRepository");
const LogoutUserUseCase = require("../LogoutUserUseCase");

describe("LogoutUserUseCase", () => {
  let logoutUserUseCase;

  beforeEach(() => {
    logoutUserUseCase = new LogoutUserUseCase({});
  });

  it("must throw an error when the payload does not contain a refresh token", async () => {
    // Arrange
    const useCasePayload = {};

    // Act & Assert
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  it("must throw an error when the refresh token is not a string", async () => {
    // Arrange
    const useCasePayload = { refreshToken: 123 };

    // Act & Assert
    await expect(
      logoutUserUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should successfully orchestrate the deletion of the authentication", async () => {
    // Arrange
    const useCasePayload = { refreshToken: "refreshToken" };
    const mockAuthenticationRepository = new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue();
    mockAuthenticationRepository.deleteToken = jest.fn().mockResolvedValue();

    logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Act
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(
      useCasePayload.refreshToken
    );
  });
});
