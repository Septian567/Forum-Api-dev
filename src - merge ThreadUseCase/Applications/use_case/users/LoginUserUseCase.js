const UserLogin = require('../../../Domains/users/entities/UserLogin');
const NewAuthentication = require('../../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
   constructor({
      userRepository,
      authenticationRepository,
      authenticationTokenManager,
      passwordHash,
   }) {
      this._userRepository = userRepository;
      this._authenticationRepository = authenticationRepository;
      this._authenticationTokenManager = authenticationTokenManager;
      this._passwordHash = passwordHash;
   }

   async execute(useCasePayload) {
      const { username, password } = new UserLogin(useCasePayload);

      await this._validatePassword(username, password);
      const id = await this._getUserId(username);
      const newAuthentication = await this._generateTokens(username, id);

      await this._saveRefreshToken(newAuthentication.refreshToken);

      return newAuthentication;
   }

   async _validatePassword(username, password) {
      const encryptedPassword = await this._userRepository.getPasswordByUsername(
         username,
      );
      await this._passwordHash.comparePassword(password, encryptedPassword);
   }

   async _getUserId(username) {
      return this._userRepository.getIdByUsername(username);
   }

   async _generateTokens(username, id) {
      const accessToken = await this._authenticationTokenManager.createAccessToken({
         username,
         id,
      });
      const refreshToken = await this._authenticationTokenManager.createRefreshToken({
         username,
         id,
      });

      return new NewAuthentication({
         accessToken,
         refreshToken,
      });
   }

   async _saveRefreshToken(refreshToken) {
      await this._authenticationRepository.addToken(refreshToken);
   }
}

module.exports = LoginUserUseCase;
