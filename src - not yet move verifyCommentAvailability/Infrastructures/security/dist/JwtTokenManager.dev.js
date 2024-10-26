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

var AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManager");

var InvariantError = require("../../Commons/exceptions/InvariantError");

var JwtTokenManager =
/*#__PURE__*/
function (_AuthenticationTokenM) {
  _inherits(JwtTokenManager, _AuthenticationTokenM);

  function JwtTokenManager(jwt) {
    var _this;

    _classCallCheck(this, JwtTokenManager);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(JwtTokenManager).call(this));
    _this._jwt = jwt;
    _this._accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    _this._refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
    return _this;
  }

  _createClass(JwtTokenManager, [{
    key: "createAccessToken",
    value: function createAccessToken(payload) {
      return regeneratorRuntime.async(function createAccessToken$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", this._generateToken(payload, this._accessTokenKey));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createRefreshToken",
    value: function createRefreshToken(payload) {
      return regeneratorRuntime.async(function createRefreshToken$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", this._generateToken(payload, this._refreshTokenKey));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "verifyRefreshToken",
    value: function verifyRefreshToken(token) {
      var artifacts;
      return regeneratorRuntime.async(function verifyRefreshToken$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              artifacts = this._decodeToken(token);

              this._verifyToken(artifacts, this._refreshTokenKey);

              _context3.next = 8;
              break;

            case 5:
              _context3.prev = 5;
              _context3.t0 = _context3["catch"](0);
              throw new InvariantError("invalid refresh token");

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 5]]);
    }
  }, {
    key: "decodePayload",
    value: function decodePayload(token) {
      var artifacts;
      return regeneratorRuntime.async(function decodePayload$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              artifacts = this._decodeToken(token);
              return _context4.abrupt("return", artifacts.decoded.payload);

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_generateToken",
    value: function _generateToken(payload, key) {
      return this._jwt.generate(payload, key);
    }
  }, {
    key: "_decodeToken",
    value: function _decodeToken(token) {
      return this._jwt.decode(token);
    }
  }, {
    key: "_verifyToken",
    value: function _verifyToken(artifacts, key) {
      this._jwt.verify(artifacts, key);
    }
  }]);

  return JwtTokenManager;
}(AuthenticationTokenManager);

module.exports = JwtTokenManager;