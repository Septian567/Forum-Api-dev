"use strict";

var ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

var CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");

var pool = require("../../database/postgres/pool");

var CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");

var NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("CommentReplyRepositoryPostgres - getCommentReply", function () {
  var userId = "user-123";
  var threadId = "thread-123";
  var commentId = "comment-123";
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
    commentReplyRepository = new CommentReplyRepositoryPostgres(pool, {});
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
  }); // Reusable assertion functions

  var expectReplyToMatch = function expectReplyToMatch(reply, _ref) {
    var id = _ref.id,
        userId = _ref.userId,
        threadId = _ref.threadId,
        commentId = _ref.commentId;
    expect(reply.id).toEqual(id);
    expect(reply.user_id).toEqual(userId);
    expect(reply.thread_id).toEqual(threadId);
    expect(reply.comment_id).toEqual(commentId);
  };

  var expectRepliesArrayToHaveLength = function expectRepliesArrayToHaveLength(replies, expectedLength) {
    expect(Array.isArray(replies)).toBe(true);
    expect(replies).toHaveLength(expectedLength);
  };

  describe("getCommentReplyById", function () {
    it("should return NotFoundError when reply not found", function _callee4() {
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(expect(commentReplyRepository.getCommentReplyById("wrong-reply")).rejects.toThrowError(NotFoundError));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it("should return reply correctly", function _callee5() {
      var reply;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                user_id: userId,
                thread_id: threadId,
                comment_id: commentId
              }));

            case 2:
              _context5.next = 4;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyById("reply-333"));

            case 4:
              reply = _context5.sent;
              // Assert
              expectReplyToMatch(reply, {
                id: "reply-333",
                userId: userId,
                threadId: threadId,
                commentId: commentId
              });

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
  describe("getCommentReplyByCommentId", function () {
    it("should return empty array when no reply found", function _callee6() {
      var commentReplies;
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyByCommentId(commentId));

            case 2:
              commentReplies = _context6.sent;
              // Assert
              expectRepliesArrayToHaveLength(commentReplies, 0);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
    it("should return replies correctly", function _callee7() {
      var replies;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                comment_id: commentId
              }));

            case 2:
              _context7.next = 4;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-222",
                comment_id: commentId
              }));

            case 4:
              _context7.next = 6;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-111",
                comment_id: commentId
              }));

            case 6:
              _context7.next = 8;
              return regeneratorRuntime.awrap(commentReplyRepository.getCommentReplyByCommentId(commentId));

            case 8:
              replies = _context7.sent;
              // Assert
              expectRepliesArrayToHaveLength(replies, 3);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
  });
});