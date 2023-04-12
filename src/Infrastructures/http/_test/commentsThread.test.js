const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');

describe('endpoints concerning CRUD on comments thread', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comments thread', async () => {
      const requestPayload = {
        content: 'content comment',
      };
      const threadId = 'thread-11111111';

      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {};
      const threadId = 'thread-11111111';

      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: 2023,
      };
      const threadId = 'thread-11111111';

      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });
      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan comment baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response with 200 and return success status', async () => {
      const server = await createServer(container);
      const { userId, accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';

      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it("should response with 403 when someone tries to delete a comment that doesn't belong to them", async () => {
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId({ server, username: 'username1' });

      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';

      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper
        .addCommentThread({ id: commentId, owner: userId });

      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId({ server, username: 'username2' });

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
