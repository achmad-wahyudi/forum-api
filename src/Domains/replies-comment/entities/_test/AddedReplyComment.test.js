const AddedReplyComment = require('../AddedReplyComment');

describe('a AddedReplyComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'reply-111111111',
      content: 'some reply',
    };

    // action & assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 111111111,
      content: 145,
      owner: {},
    };

    // action & assert
    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReplyComment object properly', () => {
    const payload = {
      id: 'reply-111111111',
      content: 'some reply',
      owner: 'user-1111111111',
    };

    const addedReplyComment = new AddedReplyComment(payload);
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(addedReplyComment.owner).toEqual(payload.owner);
  });
});
