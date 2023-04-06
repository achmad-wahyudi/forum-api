const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: { auth: 'forumapi_jwt' },
    handler: handler.putCommentLikeHandler,
  },
]);

module.exports = routes;
