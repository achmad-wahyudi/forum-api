const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    options: { auth: 'forumapi_jwt' },
    handler: handler.postReplyHandler,
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    options: { auth: 'forumapi_jwt' },
    handler: handler.deleteReplyHandler,
  },
]);

module.exports = routes;
