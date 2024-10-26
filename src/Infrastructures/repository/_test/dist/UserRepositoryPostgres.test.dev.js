"use strict";

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var InvariantError = require("../../../Commons/exceptions/InvariantError");

var RegisterUser = require("../../../Domains/users/entities/RegisterUser");

var RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");

var pool = require("../../database/postgres/pool");

var UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("UserRepositoryPostgres", function () {
  afterEach(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(UsersTableTestHelper.cleanTable());

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  afterAll(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(pool.end());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  describe("verifyAvailableUsername function", function () {
    it("should throw InvariantError when username not available", function _callee3() {
      var userRepositoryPostgres;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
                username: "dicoding"
              }));

            case 2:
              // memasukan user baru dengan username dicoding
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action & Assert

              _context3.next = 5;
              return regeneratorRuntime.awrap(expect(userRepositoryPostgres.verifyAvailableUsername("dicoding")).rejects.toThrowError(InvariantError));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it("should not throw InvariantError when username available", function _callee4() {
      var userRepositoryPostgres;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Arrange
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action & Assert

              _context4.next = 3;
              return regeneratorRuntime.awrap(expect(userRepositoryPostgres.verifyAvailableUsername("dicoding")).resolves.not.toThrowError(InvariantError));

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
  });
  describe("addUser function", function () {
    it("should persist register user and return registered user correctly", function _callee5() {
      var registerUser, fakeIdGenerator, userRepositoryPostgres, users;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              // Arrange
              registerUser = new RegisterUser({
                username: "dicoding",
                password: "secret_password",
                fullname: "Dicoding Indonesia"
              });

              fakeIdGenerator = function fakeIdGenerator() {
                return "123";
              }; // stub!


              userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator); // Action

              _context5.next = 5;
              return regeneratorRuntime.awrap(userRepositoryPostgres.addUser(registerUser));

            case 5:
              _context5.next = 7;
              return regeneratorRuntime.awrap(UsersTableTestHelper.findUsersById("user-123"));

            case 7:
              users = _context5.sent;
              expect(users).toHaveLength(1);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
    it("should return registered user correctly", function _callee6() {
      var registerUser, fakeIdGenerator, userRepositoryPostgres, registeredUser;
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              // Arrange
              registerUser = new RegisterUser({
                username: "dicoding",
                password: "secret_password",
                fullname: "Dicoding Indonesia"
              });

              fakeIdGenerator = function fakeIdGenerator() {
                return "123";
              }; // stub!


              userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator); // Action

              _context6.next = 5;
              return regeneratorRuntime.awrap(userRepositoryPostgres.addUser(registerUser));

            case 5:
              registeredUser = _context6.sent;
              // Assert
              expect(registeredUser).toStrictEqual(new RegisteredUser({
                id: "user-123",
                username: "dicoding",
                fullname: "Dicoding Indonesia"
              }));

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      });
    });
  });
  describe("getPasswordByUsername", function () {
    it("should throw InvariantError when user not found", function () {
      // Arrange
      var userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action & Assert

      return expect(userRepositoryPostgres.getPasswordByUsername("dicoding")).rejects.toThrowError(InvariantError);
    });
    it("should return username password when user is found", function _callee7() {
      var userRepositoryPostgres, password;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              // Arrange
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
              _context7.next = 3;
              return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
                username: "dicoding",
                password: "secret_password"
              }));

            case 3:
              _context7.next = 5;
              return regeneratorRuntime.awrap(userRepositoryPostgres.getPasswordByUsername("dicoding"));

            case 5:
              password = _context7.sent;
              expect(password).toBe("secret_password");

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
  });
  describe("getIdByUsername", function () {
    it("should throw InvariantError when user not found", function _callee8() {
      var userRepositoryPostgres;
      return regeneratorRuntime.async(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              // Arrange
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action & Assert

              _context8.next = 3;
              return regeneratorRuntime.awrap(expect(userRepositoryPostgres.getIdByUsername("dicoding")).rejects.toThrowError(InvariantError));

            case 3:
            case "end":
              return _context8.stop();
          }
        }
      });
    });
    it("should return user id correctly", function _callee9() {
      var userRepositoryPostgres, userId;
      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
                id: "user-321",
                username: "dicoding"
              }));

            case 2:
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action

              _context9.next = 5;
              return regeneratorRuntime.awrap(userRepositoryPostgres.getIdByUsername("dicoding"));

            case 5:
              userId = _context9.sent;
              // Assert
              expect(userId).toEqual("user-321");

            case 7:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
  });
  describe("getUserById", function () {
    it("should throw InvariantError when user not found", function _callee10() {
      var userRepositoryPostgres;
      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              // Arrange
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action & Assert

              _context10.next = 3;
              return regeneratorRuntime.awrap(expect(userRepositoryPostgres.getUserById("user-321")).rejects.toThrowError(InvariantError));

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    it("should return user correctly", function _callee11() {
      var userRepositoryPostgres, user;
      return regeneratorRuntime.async(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
                id: "user-321",
                username: "dicoding"
              }));

            case 2:
              userRepositoryPostgres = new UserRepositoryPostgres(pool, {}); // Action

              _context11.next = 5;
              return regeneratorRuntime.awrap(userRepositoryPostgres.getUserById("user-321"));

            case 5:
              user = _context11.sent;
              // Assert
              expect(user.username).toEqual("dicoding");

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
  });
});