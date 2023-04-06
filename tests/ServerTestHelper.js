/* istanbul ignore file */
const ServerTestHelper = {

  async getAccessTokenAndUserId({ server, username = 'JohnDoe' }) {
    const userPayload = {
      username, password: 'secretpassword',
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...userPayload,
        fullname: 'placeholder fullname',
      },
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: userPayload,
    });

    const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;
    const { accessToken } = (JSON.parse(responseAuth.payload)).data;
    return { userId, accessToken };
  },
};

module.exports = ServerTestHelper;
