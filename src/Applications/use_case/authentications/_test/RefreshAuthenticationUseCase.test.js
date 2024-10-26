const AuthenticationRepository = require("../../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../../security/AuthenticationTokenManager");
const RefreshAuthenticationUseCase = require("../RefreshAuthenticationUseCase");

describe("RefreshAuthenticationUseCase", () => {
  let refreshAuthenticationUseCase;
  let mockAuthenticationRepository;
  let mockAuthenticationTokenManager;

  beforeEach(() => {
    mockAuthenticationRepository = new AuthenticationRepository();
    mockAuthenticationTokenManager = new AuthenticationTokenManager();

    refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });
  });

  const executeAndExpectError = async (useCasePayload, expectedError) => {
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(expectedError);
  };

  it("must raise an error if payload does not contain refresh token", async () => {
    // Arrange
    const useCasePayload = {};

    // Action & Assert
    await executeAndExpectError(
      useCasePayload,
      "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
    );
  });

  it("is expected to raise an error if refresh token is not a string", async () => {
    // Arrange
    const useCasePayload = { refreshToken: 1 };

    // Action & Assert
    await executeAndExpectError(
      useCasePayload,
      "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should properly orchestrate the refresh authentication action", async () => {
    // Arrange
    const useCasePayload = { refreshToken: "some_refresh_token" };
    mockAuthenticationRepository.checkAvailabilityToken = jest
      .fn()
      .mockResolvedValue();
    mockAuthenticationTokenManager.verifyRefreshToken = jest
      .fn()
      .mockResolvedValue();
    mockAuthenticationTokenManager.decodePayload = jest
      .fn()
      .mockResolvedValue({ username: "dicoding", id: "user-123" });
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue("some_new_access_token");

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(
      useCasePayload.refreshToken
    );
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });
    expect(accessToken).toEqual("some_new_access_token");
  });
});
