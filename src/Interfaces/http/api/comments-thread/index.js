const CommentsThreadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentsThread',
  register: async (server, { container }) => {
    const commentsThreadHandler = new CommentsThreadHandler(container);
    server.route(routes(commentsThreadHandler));
  },
};
