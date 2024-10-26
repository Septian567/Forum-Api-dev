"use strict";

var _require = require('./testHelpers'),
    addUserAndGetAccessToken = _require.addUserAndGetAccessToken;

describe("POST /threads", function () {
  var server;
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(setupServer());

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
            return regeneratorRuntime.awrap(cleanup());

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  it("should respond 201 and return correct added thread", function _callee3() {
    var requestPayload, userPayload, loginPayload, accessToken, response, responseJson;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Arrange
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
            _context3.next = 5;
            return regeneratorRuntime.awrap(addUserAndGetAccessToken(server, userPayload, loginPayload));

          case 5:
            accessToken = _context3.sent;
            _context3.next = 8;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 8:
            response = _context3.sent;
            // Assert
            responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual("success");
            expect(responseJson.data.addedThread).toBeDefined();

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  it("should respond 401 if no authorization", function _callee4() {
    var requestPayload, accessToken, response, responseJson;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // Arrange
            requestPayload = {
              title: "First Thread",
              body: "This is first thread"
            };
            accessToken = "wrongtoken"; // Action

            _context4.next = 4;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 4:
            response = _context4.sent;
            // Assert
            responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual("Unauthorized");

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  it("should respond 400 if bad payload", function _callee5() {
    var requestPayload, userPayload, loginPayload, accessToken, response, responseJson;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // Arrange
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
            _context5.next = 5;
            return regeneratorRuntime.awrap(addUserAndGetAccessToken(server, userPayload, loginPayload));

          case 5:
            accessToken = _context5.sent;
            _context5.next = 8;
            return regeneratorRuntime.awrap(server.inject({
              method: "POST",
              url: "/threads",
              payload: requestPayload,
              headers: {
                Authorization: "Bearer ".concat(accessToken)
              }
            }));

          case 8:
            response = _context5.sent;
            // Assert
            responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual("cannot create a new thread, payload not correct");

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
});