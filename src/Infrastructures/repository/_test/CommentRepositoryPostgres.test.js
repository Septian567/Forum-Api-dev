const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentRepositoryPostgres", () => {
  const userId = "user-123";
  const threadId = "thread-123";
  let commentRepositoryPostgres;

  beforeAll(async () => {
    await setupDatabase();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  beforeEach(() => {
    const fakeIdGenerator = () => "222";
    commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      const newComment = new NewComment({ content: "This is a comment" });

      await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      const comment = await CommentsTableTestHelper.getCommentById(
        "comment-222"
      );
      expect(comment).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      const newComment = new NewComment({ content: "This is a comment" });

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-222",
          content: "This is a comment",
          owner: userId,
        })
      );
    });
  });

  describe("getCommentById function", () => {
    it("should return NotFoundError when comment not found", async () => {
      await expect(
        commentRepositoryPostgres.getCommentById("wrong-comment")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return comment correctly", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
      });

      const comment = await commentRepositoryPostgres.getCommentById(
        "comment-333"
      );

      expect(comment.id).toEqual("comment-333");
      expect(comment.user_id).toEqual(userId);
      expect(comment.thread_id).toEqual(threadId);
    });
  });

  describe("getCommentByThreadId function", () => {
    it("should return comments correctly", async () => {
      await addMultipleComments();
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      expect(comments).toHaveLength(3);
    });

    it("should return empty array when no comments found", async () => {
      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      expect(comments).toHaveLength(0);
      expect(Array.isArray(comments)).toBeTruthy();
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly and persist deletion", async () => {
      await CommentsTableTestHelper.addComment({
        id: "comment-333",
        user_id: userId,
        thread_id: threadId,
        is_delete: false,
      });

      await commentRepositoryPostgres.deleteComment(
        "comment-333",
        threadId,
        userId
      );
      const deletedComment = await CommentsTableTestHelper.getCommentById(
        "comment-333"
      );

      expect(deletedComment[0].is_delete).toEqual(true);
      expect(deletedComment[0].content).toEqual("**komentar telah dihapus**");
    });

    it("should throw InvariantError when failed to delete comment", async () => {
      await expect(
        commentRepositoryPostgres.deleteComment(
          "comment-111",
          "thread-121",
          "user-123"
        )
      ).rejects.toThrowError(InvariantError);
    });
  });

  // Helper functions
  async function setupDatabase() {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
  }

  async function teardownDatabase() {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  }

  async function addMultipleComments() {
    await CommentsTableTestHelper.addComment({
      id: "comment-333",
      user_id: userId,
      thread_id: threadId,
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-222",
      user_id: userId,
      thread_id: threadId,
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-111",
      user_id: userId,
      thread_id: threadId,
    });
  }
});
