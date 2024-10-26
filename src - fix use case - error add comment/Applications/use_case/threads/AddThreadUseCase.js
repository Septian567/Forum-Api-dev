const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
   constructor({ threadRepository }) {
      this._threadRepository = threadRepository;
   }

   async execute(useCasePayload, useCaseCredential) {
      const newThread = this._createNewThread(useCasePayload);
      return this._threadRepository.addNewThread(newThread, useCaseCredential);
   }

   _createNewThread(payload) {
      return new NewThread(payload);
   }
}

module.exports = AddThreadUseCase;
