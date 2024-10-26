const LoginUserUseCase = require('../../../../Applications/use_case/users/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/authentications/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/users/LogoutUserUseCase');

class AuthenticationsHandler {
   constructor(container) {
      this._container = container;

      this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
      this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
      this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
   }

   _getUseCase(UseCase) {
      return this._container.getInstance(UseCase.name);
   }

   async postAuthenticationHandler(request, h) {
      const loginUserUseCase = this._getUseCase(LoginUserUseCase);
      const { accessToken, refreshToken } = await loginUserUseCase.execute(
         request.payload,
      );
      return this._createResponse(h, 201, { accessToken, refreshToken });
   }

   async putAuthenticationHandler(request) {
      const refreshAuthenticationUseCase = this._getUseCase(
         RefreshAuthenticationUseCase,
      );
      const accessToken = await refreshAuthenticationUseCase.execute(
         request.payload,
      );
      return this._createResponse(null, 200, { accessToken });
   }

   async deleteAuthenticationHandler(request) {
      const logoutUserUseCase = this._getUseCase(LogoutUserUseCase);
      await logoutUserUseCase.execute(request.payload);
      return this._createResponse(null, 200, {});
   }

   _createResponse(h, statusCode, data) {
      if (h) {
         const response = h.response({
            status: 'success',
            data,
         });
         response.code(statusCode);
         return response;
      }
      return {
         status: 'success',
         data,
      };
   }
}

module.exports = AuthenticationsHandler;
