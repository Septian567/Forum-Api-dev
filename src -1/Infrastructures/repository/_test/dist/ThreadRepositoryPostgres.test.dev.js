"use strict";

var ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var NotFoundError = require("../../../Commons/exceptions/NotFoundError");

var AddedThread = require("../../../Domains/threads/entities/AddedThread");

var NewThread = require("../../../Domains/threads/entities/NewThread");

var pool = require("../../database/postgres/pool");

var ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", function () {
  // Pre-requisite
  var userId = "user-123";
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
          case "end":
            return _context.stop();
        }
      }
    });
  });
  afterEach(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(ThreadsTableTestHelper.cleanTable());

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
            return regeneratorRuntime.awrap(UsersTableTestHelper.cleanTable());

          case 2:
            _context3.next = 4;
            return regeneratorRuntime.awrap(pool.end());

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  describe("addNewThread function", function () {
    it("persists a newly added thread", function _callee4() {
      var newThread, fakeIdGenerator, threadRepositoryPostgres, threads;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Arrange
              newThread = new NewThread({
                title: "First thread",
                body: "This is a new thread"
              });

              fakeIdGenerator = function fakeIdGenerator() {
                return "123";
              };

              threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator); // Action

              _context4.next = 5;
              return regeneratorRuntime.awrap(threadRepositoryPostgres.addNewThread(newThread, userId));

            case 5:
              _context4.next = 7;
              return regeneratorRuntime.awrap(ThreadsTableTestHelper.findThreadById("thread-123"));

            case 7:
              threads = _context4.sent;
              expect(threads).toHaveLength(1);

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it("returns the added thread correctly", function _callee5() {
      var newThread, fakeIdGenerator, threadRepositoryPostgres, addedThread;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Arrange
              newThread = new NewThread({
                title: "First thread",
                body: "This is a new thread"
              });

              fakeIdGenerator = function fakeIdGenerator() {
                return "123";
              };

              threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator); // Action

              _context5.next = 5;
              return regeneratorRuntime.awrap(threadRepositoryPostgres.addNewThread(newThread, userId));

            case 5:
              addedThread = _context5.sent;
              // Assert
              expect(addedThread).toStrictEqual(new AddedThread({
                id: "thread-123",
                title: "First thread",
                owner: "user-123"
              }));

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
  describe("getThreadById function", function () {
    it("throws NotFoundError if no thread is found", function _callee6() {
      var threadRepositoryPostgres;
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // Arrange
              threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}); // Action & Assert

              _context6.next = 3;
              return regeneratorRuntime.awrap(expect(threadRepositoryPostgres.getThreadById("thread-521")).rejects.toThrowError(NotFoundError));

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
    it("retrieves the correct thread", function _callee7() {
      var threadRepositoryPostgres, thread;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(ThreadsTableTestHelper.addThread({
                id: "thread-521",
                title: "Thread test"
              }));

            case 2:
              threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}); // Action

              _context7.next = 5;
              return regeneratorRuntime.awrap(threadRepositoryPostgres.getThreadById("thread-521"));

            case 5:
              thread = _context7.sent;
              // Assert
              expect(thread.title).toEqual("Thread test");

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
  });
});