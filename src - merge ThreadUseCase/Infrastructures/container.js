/* istanbul ignore file */

const { createContainer } = require("instances-container");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// External Dependencies
const PasswordHash = require("../Applications/security/PasswordHash");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");
const OwnerValidator = require("../Applications/security/OwnerValidator");
const OwnerValidatorManager = require("./security/OwnerValidatorManager");

// Repositories
const UserRepository = require("../Domains/users/UserRepository");
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");
const ThreadRepository = require("../Domains/threads/ThreadRepository");
const ThreadRepositoryPostgres = require("./repository/ThreadRepositoryPostgres");
const CommentRepository = require("../Domains/comments/CommentRepository");
const CommentRepositoryPostgres = require("./repository/CommentRepositoryPostgres");
const CommentReplyRepository = require("../Domains/comment_replies/CommentReplyRepository");
const CommentReplyRepositoryPostgres = require("./repository/CommentReplyRepositoryPostgres");

// Use Cases
const AddUserUseCase = require("../Applications/use_case/users/AddUserUseCase");
const LoginUserUseCase = require("../Applications/use_case/users/LoginUserUseCase");
const LogoutUserUseCase = require("../Applications/use_case/users/LogoutUserUseCase");
const RefreshAuthenticationUseCase = require("../Applications/use_case/authentications/RefreshAuthenticationUseCase");
// const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const ThreadUseCase = require("../Applications/use_case/threads/ThreadUseCase");
const CommentUseCase = require("../Applications/use_case/comments/CommentUseCase");
const AddCommentReplyUseCase = require("../Applications/use_case/comment_replies/AddCommentReplyUseCase");
const DeleteCommentReplyUseCase = require("../Applications/use_case/comment_replies/DeleteCommentReplyUseCase");
// const GetDetailsThreadUseCase = require('../Applications/use_case/threads/GetDetailsThreadUseCase');

// Create container
const container = createContainer();

// Register repositories
function registerRepositories(container) {
  container.register([
    {
      key: UserRepository.name,
      Class: UserRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: AuthenticationRepository.name,
      Class: AuthenticationRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }],
      },
    },
    {
      key: PasswordHash.name,
      Class: BcryptPasswordHash,
      parameter: {
        dependencies: [{ concrete: bcrypt }],
      },
    },
    {
      key: AuthenticationTokenManager.name,
      Class: JwtTokenManager,
      parameter: {
        dependencies: [{ concrete: Jwt.token }],
      },
    },
    {
      key: ThreadRepository.name,
      Class: ThreadRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: CommentRepository.name,
      Class: CommentRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: CommentReplyRepository.name,
      Class: CommentReplyRepositoryPostgres,
      parameter: {
        dependencies: [{ concrete: pool }, { concrete: nanoid }],
      },
    },
    {
      key: OwnerValidator.name,
      Class: OwnerValidatorManager,
    },
  ]);
}

// Register use cases
function registerUseCases(container) {
  container.register([
    {
      key: AddUserUseCase.name,
      Class: AddUserUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          { name: "userRepository", internal: UserRepository.name },
          { name: "passwordHash", internal: PasswordHash.name },
        ],
      },
    },
    {
      key: LoginUserUseCase.name,
      Class: LoginUserUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          { name: "userRepository", internal: UserRepository.name },
          {
            name: "authenticationRepository",
            internal: AuthenticationRepository.name,
          },
          {
            name: "authenticationTokenManager",
            internal: AuthenticationTokenManager.name,
          },
          { name: "passwordHash", internal: PasswordHash.name },
        ],
      },
    },
    {
      key: LogoutUserUseCase.name,
      Class: LogoutUserUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          {
            name: "authenticationRepository",
            internal: AuthenticationRepository.name,
          },
        ],
      },
    },
    {
      key: RefreshAuthenticationUseCase.name,
      Class: RefreshAuthenticationUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          {
            name: "authenticationRepository",
            internal: AuthenticationRepository.name,
          },
          {
            name: "authenticationTokenManager",
            internal: AuthenticationTokenManager.name,
          },
        ],
      },
    },
    //  {
    //    key: AddThreadUseCase.name,
    //    Class: AddThreadUseCase,
    //    parameter: {
    //      injectType: "destructuring",
    //      dependencies: [
    //        { name: "threadRepository", internal: ThreadRepository.name },
    //      ],
    //    },
    //  },
    {
      key: ThreadUseCase.name, // Ganti dengan use case baru
      Class: ThreadUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          { name: "threadRepository", internal: ThreadRepository.name },
          { name: "userRepository", internal: UserRepository.name },
          { name: "commentRepository", internal: CommentRepository.name },
          {
            name: "commentReplyRepository",
            internal: CommentReplyRepository.name,
          },
        ],
      },
    },
    {
      key: CommentUseCase.name,
      Class: CommentUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          { name: "commentRepository", internal: CommentRepository.name },
          { name: "threadRepository", internal: ThreadRepository.name },
          { name: "userRepository", internal: UserRepository.name },
          { name: "ownerValidator", internal: OwnerValidator.name },
        ],
      },
    },
    {
      key: AddCommentReplyUseCase.name,
      Class: AddCommentReplyUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          {
            name: "commentReplyRepository",
            internal: CommentReplyRepository.name,
          },
          { name: "commentRepository", internal: CommentRepository.name },
          { name: "threadRepository", internal: ThreadRepository.name },
          { name: "userRepository", internal: UserRepository.name },
        ],
      },
    },
    {
      key: DeleteCommentReplyUseCase.name,
      Class: DeleteCommentReplyUseCase,
      parameter: {
        injectType: "destructuring",
        dependencies: [
          {
            name: "commentReplyRepository",
            internal: CommentReplyRepository.name,
          },
          { name: "ownerValidator", internal: OwnerValidator.name },
        ],
      },
    },
    // {
    //   key: GetDetailsThreadUseCase.name,
    //   Class: GetDetailsThreadUseCase,
    //   parameter: {
    //     injectType: "destructuring",
    //     dependencies: [
    //       { name: "userRepository", internal: UserRepository.name },
    //       { name: "threadRepository", internal: ThreadRepository.name },
    //       { name: "commentRepository", internal: CommentRepository.name },
    //       {
    //         name: "commentReplyRepository",
    //         internal: CommentReplyRepository.name,
    //       },
    //     ],
    //   },
    // },
  ]);
}

// Execute registrations
registerRepositories(container);
registerUseCases(container);

module.exports = container;
