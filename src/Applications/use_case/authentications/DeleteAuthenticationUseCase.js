class DeleteAuthenticationUseCase {
   constructor({ authenticationRepository }) {
      this._authenticationRepository = authenticationRepository;
   }

   async execute(useCasePayload) {
      this._validatePayload(useCasePayload);
      await this._deleteToken(useCasePayload.refreshToken);
   }

   _validatePayload({ refreshToken }) {
      if (!refreshToken) {
         throw new Error(
            DeleteAuthenticationUseCase.ERRORS.NOT_CONTAIN_REFRESH_TOKEN,
         );
      }

      if (typeof refreshToken !== 'string') {
         throw new Error(DeleteAuthenticationUseCase.ERRORS.INVALID_DATA_TYPE);
      }
   }

   async _deleteToken(refreshToken) {
      await this._authenticationRepository.checkAvailabilityToken(refreshToken);
      await this._authenticationRepository.deleteToken(refreshToken);
   }
}

DeleteAuthenticationUseCase.ERRORS = {
   NOT_CONTAIN_REFRESH_TOKEN:
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN',
   INVALID_DATA_TYPE:
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
};

module.exports = DeleteAuthenticationUseCase;
