const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");
const pool = require("../../database/postgres/pool");
const NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");
const CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");
const AddedCommentReply = require("../../../Domains/comment_replies/entities/AddedCommentReply");

describe("CommentReplyRepositoryPostgres - addCommentReply", () => {
  const userId = "user-123";
  const threadId = "thread-123";
  const commentId = "comment-123";
  const fakeIdGenerator = () => "222";
  let commentReplyRepository;

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      user_id: userId,
      thread_id: threadId,
    });
  });

  beforeEach(() => {
    commentReplyRepository = new CommentReplyRepositoryPostgres(
      pool,
      fakeIdGenerator
    );
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("addCommentReply function", () => {
    it("should persist added comment reply", async () => {
      // Arrange
      const newCommentReply = new NewCommentReply({
        content: "This is a reply",
      });

      // Action
      await commentReplyRepository.addCommentReply(
        newCommentReply.content,
        threadId,
        commentId,
        userId
      );

      // Assert
      const commentReply =
        await CommentRepliesTableTestHelper.getCommentReplyById("reply-222");
      expect(commentReply).toHaveLength(1);
    });

    it("should return added comment reply correctly", async () => {
      // Arrange
      const newCommentReply = new NewCommentReply({
        content: "This is a reply",
      });

      // Action
      const addedCommentReply = await commentReplyRepository.addCommentReply(
        newCommentReply.content,
        threadId,
        commentId,
        userId
      );

      // Assert
      expect(addedCommentReply).toStrictEqual(
        new AddedCommentReply({
          id: "reply-222",
          content: "This is a reply",
          owner: userId,
        })
      );
    });
  });
});
