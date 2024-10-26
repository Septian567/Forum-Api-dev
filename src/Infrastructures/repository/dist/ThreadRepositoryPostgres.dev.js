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

var NotFoundError = require("../../Commons/exceptions/NotFoundError");

var ThreadRepository = require("../../Domains/threads/ThreadRepository");

var AddedThread = require("../../Domains/threads/entities/AddedThread");

var ThreadRepositoryPostgres =
/*#__PURE__*/
function (_ThreadRepository) {
  _inherits(ThreadRepositoryPostgres, _ThreadRepository);

  function ThreadRepositoryPostgres(pool, idGenerator) {
    var _this;

    _classCallCheck(this, ThreadRepositoryPostgres);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ThreadRepositoryPostgres).call(this));
    _this._pool = pool;
    _this._idGenerator = idGenerator;
    return _this;
  }

  _createClass(ThreadRepositoryPostgres, [{
    key: "addNewThread",
    value: function addNewThread(thread, ownerId) {
      var title, body, id, time, query, result, _result$rows$, threadId, threadTitle, userId;

      return regeneratorRuntime.async(function addNewThread$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              title = thread.title, body = thread.body;
              id = "thread-".concat(this._idGenerator());
              time = new Date();
              query = {
                text: "\n        INSERT INTO threads (id, title, body, created_at, user_id)\n        VALUES ($1, $2, $3, $4, $5)\n        RETURNING id, title, user_id\n      ",
                values: [id, title, body, time, ownerId]
              };
              _context.next = 6;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 6:
              result = _context.sent;
              _result$rows$ = result.rows[0], threadId = _result$rows$.id, threadTitle = _result$rows$.title, userId = _result$rows$.user_id;
              return _context.abrupt("return", new AddedThread({
                id: threadId,
                title: threadTitle,
                owner: userId
              }));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getThreadById",
    value: function getThreadById(threadId) {
      var query, result;
      return regeneratorRuntime.async(function getThreadById$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = {
                text: "SELECT * FROM threads WHERE id = $1",
                values: [threadId]
              };
              _context2.next = 3;
              return regeneratorRuntime.awrap(this._pool.query(query));

            case 3:
              result = _context2.sent;

              if (!(result.rowCount === 0)) {
                _context2.next = 6;
                break;
              }

              throw new NotFoundError("thread not found");

            case 6:
              return _context2.abrupt("return", result.rows[0]);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }]);

  return ThreadRepositoryPostgres;
}(ThreadRepository);

module.exports = ThreadRepositoryPostgres;