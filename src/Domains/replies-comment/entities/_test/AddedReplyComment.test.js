const AddedReplyComment = require('../AddedReplyComment');

describe('a AddedReplyComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-111111111',
      content: 'content reply',
    };

    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 111111111,
      content: 111,
      owner: {},
    };

    expect(() => new AddedReplyComment(payload)).toThrowError('ADDED_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReplyComment object properly', () => {
    const payload = {
      id: 'reply-111111111',
      content: 'content reply',
      owner: 'user-1111111111',
    };

    const addedReplyComment = new AddedReplyComment(payload);
    expect(addedReplyComment.id).toEqual(payload.id);
    expect(addedReplyComment.content).toEqual(payload.content);
    expect(addedReplyComment.owner).toEqual(payload.owner);
  });
});
