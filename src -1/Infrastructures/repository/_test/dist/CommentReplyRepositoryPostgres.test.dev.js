"use strict";

var ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

var CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");

var pool = require("../../database/postgres/pool");

var NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");

var CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");

var AddedCommentReply = require("../../../Domains/comment_replies/entities/AddedCommentReply");

var InvariantError = require("../../../Commons/exceptions/InvariantError");

var NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentReplyRepositoryPostgres", function () {
  var userId = "user-123";
  var threadId = "thread-123";
  var commentId = "comment-123";

  var fakeIdGenerator = function fakeIdGenerator() {
    return "222";
  };

  var commentReplyRepository;
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
              id: userId
            }));

          case 2:
            _context.next = 4;
            return regeneratorRuntime.awrap(ThreadsTableTestHelper.addThread({
              id: threadId,
              user_id: userId
            }));

          case 4:
            _context.next = 6;
            return regeneratorRuntime.awrap(CommentsTableTestHelper.addComment({
              id: commentId,
              user_id: userId,
              thread_id: threadId
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  beforeEach(function () {
    commentReplyRepository = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);
  });
  afterEach(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.cleanTable());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  afterAll(function _callee3() {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(CommentsTableTestHelper.cleanTable());

          case 2:
            _context3.next = 4;
            return regeneratorRuntime.awrap(UsersTableTestHelper.cleanTable());

          case 4:
            _context3.next = 6;
            return regeneratorRuntime.awrap(ThreadsTableTestHelper.cleanTable());

          case 6:
            _context3.next = 8;
            return regeneratorRuntime.awrap(pool.end());

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    });
  });

  var testAddCommentReply = function testAddCommentReply(newCommentReply) {
    return regeneratorRuntime.async(function testAddCommentReply$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(commentReplyRepository.addCommentReply(newCommentReply.content, threadId, commentId, userId));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    });
  };

  describe("addCommentReply function", function () {
    it("should persist added comment reply", function _callee4() {
      var newCommentReply, commentReply;
      return regeneratorRuntime.async(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Arrange
              newCommentReply = new NewCommentReply({
                content: "This is a reply"
              }); // Action

              _context5.next = 3;
              return regeneratorRuntime.awrap(testAddCommentReply(newCommentReply));

            case 3:
              _context5.next = 5;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.getCommentReplyById("reply-222"));

            case 5:
              commentReply = _context5.sent;
              expect(commentReply).toHaveLength(1);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
    it("should return added comment reply correctly", function _callee5() {
      var newCommentReply, addedCommentReply;
      return regeneratorRuntime.async(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // Arrange
              newCommentReply = new NewCommentReply({
                content: "This is a reply"
              }); // Action

              _context6.next = 3;
              return regeneratorRuntime.awrap(commentReplyRepository.addCommentReply(newCommentReply.content, threadId, commentId, userId));

            case 3:
              addedCommentReply = _context6.sent;
              // Assert
              expect(addedCommentReply).toStrictEqual(new AddedCommentReply({
                id: "reply-222",
                content: "This is a reply",
                owner: userId
              }));

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
  });
  describe("getCommentReplyById", function () {
    it("should return NotFoundError when reply not found", function _callee6() {
      return regeneratorRuntime.async(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(expect(commentReplyRepository.getCommentReplyById("wrong-reply")).rejects.toThrowError(NotFoundError));

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
    it("should return reply correctly", function _callee7() {
      var reply;
      return regeneratorRuntime.async(function _callee7$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                user_id: userId,
                thread_id: threadId,
                comment_id: commentId
              }));

            case 2:
              _context8.next = 4;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyById("reply-333"));

            case 4:
              reply = _context8.sent;
              // Assert
              expect(reply.id).toEqual("reply-333");
              expect(reply.user_id).toEqual(userId);
              expect(reply.thread_id).toEqual(threadId);
              expect(reply.comment_id).toEqual(commentId);

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      });
    });
  });
  describe("getCommentReplyByCommentId", function () {
    it("should return empty array when no reply found", function _callee8() {
      var commentReplies;
      return regeneratorRuntime.async(function _callee8$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyByCommentId(commentId));

            case 2:
              commentReplies = _context9.sent;
              // Assert
              expect(Array.isArray(commentReplies)).toBe(true);
              expect(commentReplies).toHaveLength(0);

            case 5:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
    it("should return replies correctly", function _callee9() {
      var replies;
      return regeneratorRuntime.async(function _callee9$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                comment_id: commentId
              }));

            case 2:
              _context10.next = 4;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-222",
                comment_id: commentId
              }));

            case 4:
              _context10.next = 6;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-111",
                comment_id: commentId
              }));

            case 6:
              _context10.next = 8;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyByCommentId(commentId));

            case 8:
              replies = _context10.sent;
              // Assert
              expect(replies).toHaveLength(3);

            case 10:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
  });
  describe("deleteCommentReply", function () {
    it("should delete reply correctly and mark it as deleted", function _callee10() {
      var deletedReply;
      return regeneratorRuntime.async(function _callee10$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                user_id: userId,
                thread_id: threadId,
                comment_id: commentId,
                is_delete: false
              }));

            case 2:
              _context11.next = 4;
              return regeneratorRuntime.awrap(commentReplyRepository.deleteCommentReply("reply-333", threadId, commentId, userId));

            case 4:
              _context11.next = 6;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.getCommentReplyById("reply-333"));

            case 6:
              deletedReply = _context11.sent;
              // Assert
              expect(deletedReply[0].is_delete).toEqual(true);
              expect(deletedReply[0].content).toEqual("**balasan telah dihapus**");

            case 9:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    it("should throw InvariantError when deletion fails", function _callee11() {
      return regeneratorRuntime.async(function _callee11$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(expect(commentReplyRepository.deleteCommentReply("reply-333", "thread-121", "comment-111", "user-123")).rejects.toThrowError(InvariantError));

            case 2:
            case "end":
              return _context12.stop();
          }
        }
      });
    });
  });
});