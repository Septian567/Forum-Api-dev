class RefreshAuthenticationUseCase {
   constructor({ authenticationRepository, authenticationTokenManager }) {
      this._authenticationRepository = authenticationRepository;
      this._authenticationTokenManager = authenticationTokenManager;
   }

   async execute(useCasePayload) {
      this._verifyPayload(useCasePayload);
      const { refreshToken } = useCasePayload;

      await this._verifyRefreshToken(refreshToken);

      const { username, id } = await this._getDecodedPayload(refreshToken);

      return this._generateAccessToken({ username, id });
   }

   _verifyPayload({ refreshToken }) {
      if (!refreshToken) {
         throw new Error(
            'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
         );
      }

      if (typeof refreshToken !== 'string') {
         throw new Error(
            'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
         );
      }
   }

   async _verifyRefreshToken(refreshToken) {
      await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
      await this._authenticationRepository.checkAvailabilityToken(refreshToken);
   }

   async _getDecodedPayload(refreshToken) {
      return this._authenticationTokenManager.decodePayload(refreshToken);
   }

   _generateAccessToken({ username, id }) {
      return this._authenticationTokenManager.createAccessToken({ username, id });
   }
}

module.exports = RefreshAuthenticationUseCase;
