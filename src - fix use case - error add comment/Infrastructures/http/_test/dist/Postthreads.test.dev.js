"use strict";

var _require = require("../../../../tests/UtilsThreadHelperTest"),
    addUserAndGetAccessToken = _require.addUserAndGetAccessToken;

var ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var pool = require("../../database/postgres/pool");

var container = require("../../container");

var createServer = require("../createServer");

describe("/threads endpoint POST", function () {
  var server;
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(createServer(container));

          case 2:
            server = _context.sent;

          case 3:
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
  afterEach(function _callee3() {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(ThreadTableTestHelper.cleanTable());

          case 2:
            _context3.next = 4;
            return regeneratorRuntime.awrap(UsersTableTestHelper.cleanTable());

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  }); // Fungsi pembantu untuk memeriksa respons

  var checkResponse = function checkResponse(response, expectedStatusCode, expectedJson) {
    var responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(expectedStatusCode);
    Object.keys(expectedJson).forEach(function (key) {
      expect(responseJson[key]).toEqual(expectedJson[key]);
    });
  };

  it("should respond 201 and return correct added thread", function _callee4() {
    var requestPayload, userPayload, loginPayload, accessToken, response;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            requestPayload = {
              title: "First Thread",
              body: "This is first thread"
            };
            userPayload = {
              username: "dicoding",
              password: "secret",
              fullname: "Dicoding Indonesia"
            };
            loginPayload = {
              username: "dicoding",
              password: "secret"
            };
            _context4.next = 5;
            return regeneratorRuntime.awrap(addUserAndGetAccessToken(server, userPayload, loginPayload));

          case 5:
            accessToken = _context4.sent;
            _context4.next = 8;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 8:
            response = _context4.sent;
            checkResponse(response, 201, {
              status: "success",
              data: {
                addedThread: expect.anything()
              }
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  it("should respond 401 if no authorization", function _callee5() {
    var requestPayload, accessToken, response;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            requestPayload = {
              title: "First Thread",
              body: "This is first thread"
            };
            accessToken = "wrongtoken";
            _context5.next = 4;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 4:
            response = _context5.sent;
            checkResponse(response, 401, {
              error: "Unauthorized"
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
  it("should respond 400 if bad payload", function _callee6() {
    var requestPayload, userPayload, loginPayload, accessToken, response;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            requestPayload = {
              title: "First Thread"
            };
            userPayload = {
              username: "dicoding",
              password: "secret",
              fullname: "Dicoding Indonesia"
            };
            loginPayload = {
              username: "dicoding",
              password: "secret"
            };
            _context6.next = 5;
            return regeneratorRuntime.awrap(addUserAndGetAccessToken(server, userPayload, loginPayload));

          case 5:
            accessToken = _context6.sent;
            _context6.next = 8;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 8:
            response = _context6.sent;
            checkResponse(response, 400, {
              status: "fail",
              message: "cannot create a new thread, payload not correct"
            });

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    });
  });
});