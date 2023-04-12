const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsThreadTableTestHelper = require('../../../../tests/CommentsThreadTableTestHelper');
const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');

describe('endpoints concerning CRUD on likes comment', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadableTestHelper.cleanTable();
    await CommentsThreadTableTestHelper.cleanTable();
    await LikesCommentTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 when giving like comment ', async () => {
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';

      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });
      await LikesCommentTableTestHelper.addLikeComment({ commentId, owner: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 200 when giving unlike comment', async () => {
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId({ server });

      const threadId = 'thread-11111111';
      const commentId = 'comment-1111111';

      await ThreadableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsThreadTableTestHelper.addCommentThread({ id: commentId, owner: userId });
      await LikesCommentTableTestHelper.addLikeComment({ commentId, owner: userId });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
