const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    options: { auth: 'forumapi_jwt' },
    handler: handler.postCommentThreadHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    options: { auth: 'forumapi_jwt' },
    handler: handler.deleteCommentThreadHandler,
  },
]);

module.exports = routes;
