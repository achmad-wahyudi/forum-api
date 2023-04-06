const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const RepliesCommentTableTestHelper = require('../../../../tests/RepliesCommentTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('endpoints concerning CRUD on replies', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
    await RepliesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('on POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should return with 201 and return success status with payload', async () => {
      // arrange
      const requestPayload = {
        content: 'somekind of reply',
      };

      const server = await createServer(container);

      /* create first user and add thread and comment */
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should return with 400 when payload has missing requirements', async () => {
      // arrange
      const requestPayload = {};

      const server = await createServer(container);

      /* create first user and add thread and comment */
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should return with 400 when payload wrong data type', async () => {
      // arrange
      const requestPayload = {
        content: 2021,
      };

      const server = await createServer(container);

      /* create first user and add thread and comment */
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('on DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should return with 200 and return success status', async () => {
      // arrange
      const server = await createServer(container);

      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      const replyId = 'reply-111111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });
      await RepliesCommentTableTestHelper.addReplyComment({ id: replyId, owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
        // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should return with 403 if user does not have access to reply', async () => {
      // arrange
      const server = await createServer(container);

      /* add first user and thread, comment and reply */
      const { userId: firstUserId } = await ServerTestHelper.getAccessTokenAndUserId({ server, username: 'JohnDoe' });
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      const replyId = 'reply-111111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: firstUserId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: firstUserId });
      await RepliesCommentTableTestHelper.addReplyComment({ id: replyId, owner: firstUserId });

      /* add second user */
      const { accessToken: secondAccessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server, username: 'JaneDoe' });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${secondAccessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should return with 404 if reply is already deleted', async () => {
      // arrange
      const server = await createServer(container);

      /* add first user and thread, comment and reply */
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server, username: 'JohnDoe' });
      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';
      const replyId = 'reply-111111111';
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });
      await RepliesCommentTableTestHelper
        .addReplyComment({ id: replyId, owner: userId, isDeleted: true });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
