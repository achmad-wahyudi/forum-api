const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const RepliesCommentTableTestHelper = require('../../../../tests/RepliesCommentTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');

describe('endpoints concerning CRUD on threads', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
    await RepliesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(container);
      const serverHelper = await ServerTestHelper.getAccessTokenAndUserId({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${serverHelper.accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should respond with 403 when no access token is provided', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
        body: 'dolor sit amet',
      };

      const server = await createServer(container);

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson).toBeInstanceOf(Object);
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response with 400 when payload does not meet structure specifications', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: 'lorem ipsum',
      };

      const server = await createServer(container);

      /* add user and gain access token */
      const serverHelper = await ServerTestHelper.getAccessTokenAndUserId({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${serverHelper.accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response with 400 when payload does not meet data type specifications', async () => {
      // arrange
      /* add thread payload */
      const requestPayload = {
        title: {},
        body: 123,
      };

      const server = await createServer(container);

      /* add user and gain access token */
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      // action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond with 200 with thread details and comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-11111111';
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111', username: 'JohnDoe' });
      await UsersTableTestHelper.registerUser({ id: 'user-456', username: 'JaneDoe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-1111111111' });
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-1111111', threadId, owner: 'user-1111111111' });
      await CommentsThreadTableTestHelper.addCommentThread({ id: 'comment-456', threadId, owner: 'user-1111111111' });
      await RepliesCommentTableTestHelper.addReplyComment({ id: 'reply-111111111', commentId: 'comment-456', owner: 'user-1111111111' });
      await RepliesCommentTableTestHelper.addReplyComment({ id: 'reply-456', commentId: 'comment-1111111', owner: 'user-456' });
      await LikesTableTestHelper.addLikeComment({ id: 'like-1111111111', commentId: 'comment-1111111', owner: 'user-1111111111' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(2);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[1].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(1);
      expect(responseJson.data.thread.comments[1].likeCount).toEqual(0);
    });

    it('should respond with 200 and with thread details with empty comments', async () => {
      const server = await createServer(container);

      const threadId = 'thread-11111111';
      await UsersTableTestHelper.registerUser({ id: 'user-1111111111', username: 'John Doe' });
      await ThreadableTestHelper.addThread({ id: threadId, owner: 'user-1111111111' });

      // action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it('should respond with 404 if thread does not exist', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/xyz',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
