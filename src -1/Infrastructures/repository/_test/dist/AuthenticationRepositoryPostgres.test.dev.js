"use strict";

var InvariantError = require("../../../Commons/exceptions/InvariantError");

var AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

var pool = require("../../database/postgres/pool");

var AuthenticationRepositoryPostgres = require("../AuthenticationRepositoryPostgres");

describe("AuthenticationRepositoryPostgres", function () {
  var authenticationRepository;
  var testToken = "testToken";
  beforeAll(function () {
    authenticationRepository = new AuthenticationRepositoryPostgres(pool);
  });
  afterAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(pool.end());

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  beforeEach(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(AuthenticationsTableTestHelper.cleanTable());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  });

  var testAddToken = function testAddToken() {
    var tokens;
    return regeneratorRuntime.async(function testAddToken$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(authenticationRepository.addToken(testToken));

          case 2:
            _context3.next = 4;
            return regeneratorRuntime.awrap(AuthenticationsTableTestHelper.findToken(testToken));

          case 4:
            tokens = _context3.sent;
            expect(tokens).toHaveLength(1);
            expect(tokens[0].token).toBe(testToken);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    });
  };

  var testCheckAvailabilityToken = function testCheckAvailabilityToken(shouldThrow) {
    return regeneratorRuntime.async(function testCheckAvailabilityToken$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!shouldThrow) {
              _context4.next = 5;
              break;
            }

            _context4.next = 3;
            return regeneratorRuntime.awrap(expect(authenticationRepository.checkAvailabilityToken(testToken)).rejects.toThrow(InvariantError));

          case 3:
            _context4.next = 9;
            break;

          case 5:
            _context4.next = 7;
            return regeneratorRuntime.awrap(AuthenticationsTableTestHelper.addToken(testToken));

          case 7:
            _context4.next = 9;
            return regeneratorRuntime.awrap(expect(authenticationRepository.checkAvailabilityToken(testToken)).resolves.not.toThrow(InvariantError));

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    });
  };

  var testDeleteToken = function testDeleteToken() {
    var tokens;
    return regeneratorRuntime.async(function testDeleteToken$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(AuthenticationsTableTestHelper.addToken(testToken));

          case 2:
            _context5.next = 4;
            return regeneratorRuntime.awrap(authenticationRepository.deleteToken(testToken));

          case 4:
            _context5.next = 6;
            return regeneratorRuntime.awrap(AuthenticationsTableTestHelper.findToken(testToken));

          case 6:
            tokens = _context5.sent;
            expect(tokens).toHaveLength(0);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    });
  };

  describe("addToken function", function () {
    it("should successfully add token to database", testAddToken);
  });
  describe("checkAvailabilityToken function", function () {
    it("should throw InvariantError if token is not available", function () {
      return testCheckAvailabilityToken(true);
    });
    it("should not throw InvariantError if token is available", function () {
      return testCheckAvailabilityToken(false);
    });
  });
  describe("deleteToken function", function () {
    it("should successfully delete token from database", testDeleteToken);
  });
});