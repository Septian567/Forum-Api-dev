const UserRepository = require("../../../../Domains/users/UserRepository");
const AuthenticationRepository = require("../../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../../security/AuthenticationTokenManager");
const PasswordHash = require("../../../security/PasswordHash");
const LoginUserUseCase = require("../LoginUserUseCase");
const NewAuth = require("../../../../Domains/authentications/entities/NewAuth");

describe("LoginUserUseCase", () => {
  it("should correctly handle the login process", async () => {
    // Arrange: prepare payload and expected output
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
    };
    const expectedAuth = new NewAuth({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });

    // Mock dependencies
    const mockDependencies = {
      userRepository: new UserRepository(),
      authenticationRepository: new AuthenticationRepository(),
      authenticationTokenManager: new AuthenticationTokenManager(),
      passwordHash: new PasswordHash(),
    };

    // Mocking: set up mocked behavior for each method
    mockDependencies.userRepository.getPasswordByUsername = jest
      .fn()
      .mockResolvedValue("encrypted_password");
    mockDependencies.passwordHash.comparePassword = jest
      .fn()
      .mockResolvedValue();
    mockDependencies.authenticationTokenManager.createAccessToken = jest
      .fn()
      .mockResolvedValue(expectedAuth.accessToken);
    mockDependencies.authenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockResolvedValue(expectedAuth.refreshToken);
    mockDependencies.userRepository.getIdByUsername = jest
      .fn()
      .mockResolvedValue("user-123");
    mockDependencies.authenticationRepository.addToken = jest
      .fn()
      .mockResolvedValue();

    // Create use case instance
    const loginUserUseCase = new LoginUserUseCase(mockDependencies);

    // Action: execute the use case
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert: validate results
    expect(actualAuthentication).toEqual(expectedAuth);
    expect(
      mockDependencies.userRepository.getPasswordByUsername
    ).toBeCalledWith("dicoding");
    expect(mockDependencies.passwordHash.comparePassword).toBeCalledWith(
      "secret",
      "encrypted_password"
    );
    expect(mockDependencies.userRepository.getIdByUsername).toBeCalledWith(
      "dicoding"
    );
    expect(
      mockDependencies.authenticationTokenManager.createAccessToken
    ).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });
    expect(
      mockDependencies.authenticationTokenManager.createRefreshToken
    ).toBeCalledWith({
      username: "dicoding",
      id: "user-123",
    });
    expect(mockDependencies.authenticationRepository.addToken).toBeCalledWith(
      expectedAuth.refreshToken
    );
  });
});
