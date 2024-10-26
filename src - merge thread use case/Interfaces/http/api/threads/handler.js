const ThreadUseCases = require("../../../../Applications/use_case/threads/ThreadUseCases");

class ThreadHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const { id: userId } = request.auth.credentials;
    const addedThread = await threadUseCases.addThread(request.payload, userId);
    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request, h) {
    const threadUseCases = this._container.getInstance(ThreadUseCases.name);
    const { threadId } = request.params;
    const thread = await threadUseCases.getDetailsThread(threadId);
    const response = h.response({
      status: "success",
      data: { thread },
    });

    return response;
  }
}

module.exports = ThreadHandler;
