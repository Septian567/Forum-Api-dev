"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InvariantError = require("../../Commons/exceptions/InvariantError");

var RegisteredUser = require("../../Domains/users/entities/RegisteredUser");

var UserRepository = require("../../Domains/users/UserRepository");

var USER_NOT_FOUND = "user not found";
var USERNAME_NOT_FOUND = "username not found";
var USERNAME_NOT_AVAILABLE = "username tidak tersedia";
var QUERY_TEXTS = {
  SELECT_USERNAME: "SELECT username FROM users WHERE username = $1",
  INSERT_USER: "INSERT INTO users (id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id, username, fullname",
  SELECT_PASSWORD_BY_USERNAME: "SELECT password FROM users WHERE username = $1",
  SELECT_ID_BY_USERNAME: "SELECT id FROM users WHERE username = $1",
  SELECT_USER_BY_ID: "SELECT * FROM users WHERE id = $1"
};

var UserRepositoryPostgres =
/*#__PURE__*/
function (_UserRepository) {
  _inherits(UserRepositoryPostgres, _UserRepository);

  function UserRepositoryPostgres(pool, idGenerator) {
    var _this;

    _classCallCheck(this, UserRepositoryPostgres);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UserRepositoryPostgres).call(this));
    _this._pool = pool;
    _this._idGenerator = idGenerator;
    return _this;
  }

  _createClass(UserRepositoryPostgres, [{
    key: "verifyAvailableUsername",
    value: function verifyAvailableUsername(username) {
      var query, result;
      return regeneratorRuntime.async(function verifyAvailableUsername$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              query = {
                text: QUERY_TEXTS.SELECT_USERNAME,
                values: [username]
              };
              _context.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context.sent;

              if (!(result.rowCount > 0)) {
                _context.next = 6;
                break;
              }

              throw new InvariantError(USERNAME_NOT_AVAILABLE);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "addUser",
    value: function addUser(registerUser) {
      var username, password, fullname, id, query, result;
      return regeneratorRuntime.async(function addUser$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              username = registerUser.username, password = registerUser.password, fullname = registerUser.fullname;
              id = "user-".concat(this._idGenerator());
              query = {
                text: QUERY_TEXTS.INSERT_USER,
                values: [id, username, password, fullname]
              };
              _context2.next = 5;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 5:
              result = _context2.sent;
              return _context2.abrupt("return", new RegisteredUser(result.rows[0]));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getPasswordByUsername",
    value: function getPasswordByUsername(username) {
      var query, result;
      return regeneratorRuntime.async(function getPasswordByUsername$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              query = {
                text: QUERY_TEXTS.SELECT_PASSWORD_BY_USERNAME,
                values: [username]
              };
              _context3.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context3.sent;

              if (!(result.rowCount === 0)) {
                _context3.next = 6;
                break;
              }

              throw new InvariantError(USERNAME_NOT_FOUND);

            case 6:
              return _context3.abrupt("return", result.rows[0].password);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getIdByUsername",
    value: function getIdByUsername(username) {
      var query, result, id;
      return regeneratorRuntime.async(function getIdByUsername$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              query = {
                text: QUERY_TEXTS.SELECT_ID_BY_USERNAME,
                values: [username]
              };
              _context4.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context4.sent;

              if (!(result.rowCount === 0)) {
                _context4.next = 6;
                break;
              }

              throw new InvariantError(USERNAME_NOT_FOUND);

            case 6:
              id = result.rows[0].id;
              return _context4.abrupt("return", id);

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getUserById",
    value: function getUserById(userId) {
      var query, result;
      return regeneratorRuntime.async(function getUserById$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              query = {
                text: QUERY_TEXTS.SELECT_USER_BY_ID,
                values: [userId]
              };
              _context5.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context5.sent;

              if (!(result.rowCount === 0)) {
                _context5.next = 6;
                break;
              }

              throw new InvariantError(USER_NOT_FOUND);

            case 6:
              return _context5.abrupt("return", result.rows[0]);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }]);

  return UserRepositoryPostgres;
}(UserRepository);

module.exports = UserRepositoryPostgres;