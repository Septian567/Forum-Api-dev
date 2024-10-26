"use strict";

var ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

var CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");

var pool = require("../../database/postgres/pool");

var CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");

var InvariantError = require("../../../Commons/exceptions/InvariantError");

describe("CommentReplyRepositoryPostgres - deleteCommentReply", function () {
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
  });
  describe("deleteCommentReply", function () {
    it("should delete reply correctly and mark it as deleted", function _callee4() {
      var deletedReply;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.addCommentReply({
                id: "reply-333",
                user_id: userId,
                thread_id: threadId,
                comment_id: commentId,
                is_delete: false
              }));

            case 2:
              _context4.next = 4;
              return regeneratorRuntime.awrap(commentReplyRepository.deleteCommentReply("reply-333", threadId, commentId, userId));

            case 4:
              _context4.next = 6;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.getCommentReplyById("reply-333"));

            case 6:
              deletedReply = _context4.sent;
              // Assert
              expect(deletedReply[0].is_delete).toEqual(true);
              expect(deletedReply[0].content).toEqual("**balasan telah dihapus**");

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it("should throw InvariantError when deletion fails", function _callee5() {
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(expect(commentReplyRepository.deleteCommentReply("reply-333", "thread-121", "comment-111", "user-123")).rejects.toThrowError(InvariantError));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
});