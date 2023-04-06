/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentThreadRepositoryPostgres = require('./repository/CommentThreadRepositoryPostgres');
const ReplyCommentRepositoryPostgres = require('./repository/ReplyCommentRepositoryPostgres');
const CommentThreadRepository = require('../Domains/comments-thread/CommentThreadRepository');
const ReplyCommentRepository = require('../Domains/replies-comment/ReplyCommentRepository');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const LikeCommentRepository = require('../Domains/likes-comment/LikeCommentRepository');
const LikeCommentRepositoryPostgres = require('./repository/LikeCommentRepositoryPostgres');

// use case
const AddCommentThreadUseCase = require('../Applications/use_case/AddCommentThreadUseCase');
const AddReplyCommentUseCase = require('../Applications/use_case/AddReplyCommentUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const RegisterUserUseCase = require('../Applications/use_case/RegisterUserUseCase');
const DeleteAuthenticationUseCase = require('../Applications/use_case/DeleteAuthenticationUseCase');
const DeleteCommentThreadUseCase = require('../Applications/use_case/DeleteCommentThreadUseCase');
const DeleteReplyCommentUseCase = require('../Applications/use_case/DeleteReplyCommentUseCase');
const GetThreadUseCase = require('../Applications/use_case/GetThreadUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const AddLikeCommentUseCase = require('../Applications/use_case/AddLikeCommentUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: CommentThreadRepository.name,
    Class: CommentThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyCommentRepository.name,
    Class: ReplyCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: LikeCommentRepository.name,
    Class: LikeCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddCommentThreadUseCase.name,
    Class: AddCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentThreadRepository',
          internal: CommentThreadRepository.name,
        },
      ],
    },
  },
  {
    key: AddReplyCommentUseCase.name,
    Class: AddReplyCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentThreadRepository',
          internal: CommentThreadRepository.name,
        },
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: RegisterUserUseCase.name,
    Class: RegisterUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: DeleteAuthenticationUseCase.name,
    Class: DeleteAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentThreadUseCase.name,
    Class: DeleteCommentThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentThreadRepository',
          internal: CommentThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteReplyCommentUseCase.name,
    Class: DeleteReplyCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name,
        },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name,
        },
        {
          name: 'commentThreadRepository',
          internal: CommentThreadRepository.name,
        },
        {
          name: 'replyCommentRepository',
          internal: ReplyCommentRepository.name,
        },
        {
          name: 'likeCommentRepository',
          internal: LikeCommentRepository.name,
        },
      ],
    },
  },
  {
    key: AddLikeCommentUseCase.name,
    Class: AddLikeCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentThreadRepository',
          internal: CommentThreadRepository.name,
        },
        {
          name: 'likeCommentRepository',
          internal: LikeCommentRepository.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;
