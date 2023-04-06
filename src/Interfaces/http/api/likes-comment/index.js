const LikesCommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likesComment',
  register: async (server, { container }) => {
    const likesCommentHandler = new LikesCommentHandler(container);
    server.route(routes(likesCommentHandler));
  },
};
