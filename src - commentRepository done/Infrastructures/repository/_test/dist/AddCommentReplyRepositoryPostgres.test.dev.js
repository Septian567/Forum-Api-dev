"use strict";

var ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");

var CommentRepliesTableTestHelper = require("../../../../tests/CommentRepliesTableTestHelper");

var pool = require("../../database/postgres/pool");

var NewCommentReply = require("../../../Domains/comment_replies/entities/NewCommentReply");

var CommentReplyRepositoryPostgres = require("../CommentReplyRepositoryPostgres");

var AddedCommentReply = require("../../../Domains/comment_replies/entities/AddedCommentReply");

describe("CommentReplyRepositoryPostgres - addCommentReply", function () {
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
  describe("addCommentReply function", function () {
    it("should persist added comment reply", function _callee4() {
      var newCommentReply, commentReply;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Arrange
              newCommentReply = new NewCommentReply({
                content: "This is a reply"
              }); // Action

              _context4.next = 3;
              return regeneratorRuntime.awrap(commentReplyRepository.addCommentReply(newCommentReply.content, threadId, commentId, userId));

            case 3:
              _context4.next = 5;
              return regeneratorRuntime.awrap(CommentRepliesTableTestHelper.getCommentReplyById("reply-222"));

            case 5:
              commentReply = _context4.sent;
              expect(commentReply).toHaveLength(1);

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it("should return added comment reply correctly", function _callee5() {
      var newCommentReply, addedCommentReply;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Arrange
              newCommentReply = new NewCommentReply({
                content: "This is a reply"
              }); // Action

              _context5.next = 3;
              return regeneratorRuntime.awrap(commentReplyRepository.addCommentReply(newCommentReply.content, threadId, commentId, userId));

            case 3:
              addedCommentReply = _context5.sent;
              // Assert
              expect(addedCommentReply).toStrictEqual(new AddedCommentReply({
                id: "reply-222",
                content: "This is a reply",
                owner: userId
              }));

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
});