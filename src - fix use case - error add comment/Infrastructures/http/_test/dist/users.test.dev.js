"use strict";

var pool = require("../../database/postgres/pool");

var UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

var container = require("../../container");

var createServer = require("../createServer");

var testCases = [{
  description: "should response 201 and persisted user",
  payload: {
    username: "dicoding",
    password: "secret",
    fullname: "Dicoding Indonesia"
  },
  expectedStatusCode: 201,
  expectedResponse: {
    status: "success",
    data: {
      addedUser: expect.any(Object)
    }
  }
}, {
  description: "should response 400 when request payload not contain needed property",
  payload: {
    fullname: "Dicoding Indonesia",
    password: "secret"
  },
  expectedStatusCode: 400,
  expectedResponse: {
    status: "fail",
    message: "cannot create a new user because a required property is missing"
  }
}, {
  description: "should response 400 when request payload not meet data type specification",
  payload: {
    username: "dicoding",
    password: "secret",
    fullname: ["Dicoding Indonesia"]
  },
  expectedStatusCode: 400,
  expectedResponse: {
    status: "fail",
    message: "cannot create a new user because data type is incorrect"
  }
}, {
  description: "should response 400 when username more than 50 character",
  payload: {
    username: "dicodingindonesiadicodingindonesiadicodingindonesiadicoding",
    password: "secret",
    fullname: "Dicoding Indonesia"
  },
  expectedStatusCode: 400,
  expectedResponse: {
    status: "fail",
    message: "cannot create a new user because the username exceeds the character limit"
  }
}, {
  description: "should response 400 when username contain restricted character",
  payload: {
    username: "dicoding indonesia",
    password: "secret",
    fullname: "Dicoding Indonesia"
  },
  expectedStatusCode: 400,
  expectedResponse: {
    status: "fail",
    message: "cannot create a new user because the username contains restricted characters"
  }
}, {
  description: "should response 400 when username unavailable",
  payload: {
    username: "dicoding",
    fullname: "Dicoding Indonesia",
    password: "super_secret"
  },
  setup: function setup() {
    return regeneratorRuntime.async(function setup$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(UsersTableTestHelper.addUser({
              username: "dicoding"
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  expectedStatusCode: 400,
  expectedResponse: {
    status: "fail",
    message: "username tidak tersedia"
  }
}];
describe("/users endpoint", function () {
  var server;
  beforeAll(function _callee() {
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(createServer(container));

          case 2:
            server = _context2.sent;

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  afterAll(function _callee2() {
    return regeneratorRuntime.async(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(pool.end());

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  afterEach(function _callee3() {
    return regeneratorRuntime.async(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(UsersTableTestHelper.cleanTable());

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  testCases.forEach(function (_ref) {
    var description = _ref.description,
        payload = _ref.payload,
        setup = _ref.setup,
        expectedStatusCode = _ref.expectedStatusCode,
        expectedResponse = _ref.expectedResponse;
    it(description, function _callee4() {
      var response, responseJson;
      return regeneratorRuntime.async(function _callee4$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!setup) {
                _context5.next = 3;
                break;
              }

              _context5.next = 3;
              return regeneratorRuntime.awrap(setup());

            case 3:
              _context5.next = 5;
              return regeneratorRuntime.awrap(server.inject({
                method: "POST",
                url: "/users",
                payload: payload
              }));

            case 5:
              response = _context5.sent;
              responseJson = JSON.parse(response.payload);
              expect(response.statusCode).toEqual(expectedStatusCode);
              expect(responseJson).toMatchObject(expectedResponse);

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
});