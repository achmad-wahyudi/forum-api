const DetailReplyComment = require('../DetailReplyComment');

describe('a DetailReplyComment entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-111111111',
      content: 'content reply',
      date: '2023',
    };

    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      commentId: 222,
      content: 1111,
      date: {},
      username: {},
    };

    expect(() => new DetailReplyComment(payload)).toThrowError('DETAIL_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReplyComment object properly', () => {
    const payload = {
      id: 'reply-111111111',
      commentId: 'comment-1111111',
      content: 'content reply',
      date: '2023',
      username: 'username1',
    };

    const detailReplyComment = new DetailReplyComment(payload);
    expect(detailReplyComment.id).toEqual(payload.id);
    expect(detailReplyComment.commentId).toEqual(payload.commentId);
    expect(detailReplyComment.content).toEqual(payload.content);
    expect(detailReplyComment.date).toEqual(payload.date);
    expect(detailReplyComment.username).toEqual(payload.username);
  });

  it('should check when deleting replies', () => {
    const payload = {
      id: 'reply-111111111',
      commentId: 'comment-1111111',
      content: 'content reply',
      date: '2023',
      username: 'username1',
      is_deleted: true,
    };

    const detailReplyComment = new DetailReplyComment(payload);
    expect(detailReplyComment.id).toEqual(payload.id);
    expect(detailReplyComment.username).toEqual(payload.username);
    expect(detailReplyComment.date).toEqual(payload.date);
    expect(detailReplyComment.replies).toEqual(payload.replies);
    expect(detailReplyComment.content).toEqual('**balasan telah dihapus**');
  });
});
