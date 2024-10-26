const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository interface", () => {
  let threadRepository;

  beforeEach(() => {
    threadRepository = new ThreadRepository();
  });

  const methods = [
    {
      name: "addNewThread",
      args: ["", ""],
      error: "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    },
    {
      name: "getThreadById",
      args: [""],
      error: "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    },
  ];

  methods.forEach(({ name, args, error }) => {
    it(`throws error when ${name} is invoked`, async () => {
      await expect(threadRepository[name](...args)).rejects.toThrowError(error);
    });
  });
});
