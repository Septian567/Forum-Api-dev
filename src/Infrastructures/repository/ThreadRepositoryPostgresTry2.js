const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError("Thread not found");
    }
  }

  async addNewThread(thread, ownerId) {
    const { title, body } = thread;
    const id = `thread-${this._idGenerator()}`;
    const time = new Date();

    const query = {
      text: `
        INSERT INTO threads (id, title, body, created_at, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, user_id
      `,
      values: [id, title, body, time, ownerId],
    };

    try {
      const result = await this._pool.query(query);
      const {
        id: threadId,
        title: threadTitle,
        user_id: userId,
      } = result.rows[0];

      return new AddedThread({
        id: threadId,
        title: threadTitle,
        owner: userId,
      });
    } catch (error) {
      // Log error or handle it appropriately
      throw error;
    }
  }

  async getThreadById(threadId) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [threadId],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0]; // Mengembalikan data thread
    } catch (error) {
      // Log error or handle it appropriately
      throw error;
    }
  }
}

module.exports = ThreadRepositoryPostgres;
