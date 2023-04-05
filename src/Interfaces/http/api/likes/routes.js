const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    options: { auth: 'forumapi_jwt' },
    handler: handler.putLikeHandler,
  },
]);

module.exports = routes;
