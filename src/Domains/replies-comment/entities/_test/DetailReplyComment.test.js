const DetailReplyComment = require('../DetailReplyComment');

describe('a DetailReplyComment entity', () => {
  it('should throw error if payload does not meet criteria', () => {
    // arrange
    const payload = {
      id: 'reply-111111111',
      content: 'some reply',
      date: '2021',
    };

    // action & assert
    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      commentId: 999,
      content: 145,
      date: {},
      username: {},
    };

    // action & assert
    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReplyComment object properly', () => {
    const payload = {
      id: 'reply-111111111',
      commentId: 'comment-1111111',
      content: 'some reply',
      date: '2021',
      username: 'John Doe',
    };

    const detailReplyComment = new DetailReplyComment(payload);
    expect(detailReplyComment.id).toEqual(payload.id);
    expect(detailReplyComment.commentId).toEqual(payload.commentId);
    expect(detailReplyComment.content).toEqual(payload.content);
    expect(detailReplyComment.date).toEqual(payload.date);
    expect(detailReplyComment.username).toEqual(payload.username);
  });
});
