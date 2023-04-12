const DetailCommentThread = require('../DetailCommentThread');

describe('a DetailCommentThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1111111',
      username: 'username',
      date: '2023',
      content: 'content comment',
      replies: [],
      likeCount: 0,
      isDeleted: false,
    };

    const detailCommentThread = new DetailCommentThread(payload);
    expect(detailCommentThread.id).toEqual(payload.id);
    expect(detailCommentThread.username).toEqual(payload.username);
    expect(detailCommentThread.date).toEqual(payload.date);
    expect(detailCommentThread.content).toEqual(payload.content);
    expect(detailCommentThread.replies).toEqual(payload.replies);
    expect(detailCommentThread.likeCount).toEqual(payload.likeCount);
  });

  it('should throw error if payload does not meet criteria', () => {
    const payload = {
      id: 'comment-1111111',
      username: 'username',
      date: '2023,',
    };

    expect(() => new DetailCommentThread(payload)).toThrowError('DETAIL_COMMENT_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 12345,
      username: {},
      date: 2023,
      content: { content: 'content comment' },
      replies: 'replies',
    };

    expect(() => new DetailCommentThread(payload)).toThrowError('DETAIL_COMMENT_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailCommentThread object properly', () => {
    const payload = {
      id: 'comment-1111111',
      username: 'user-1111111111',
      date: '2023',
      content: 'content comment',
      is_deleted: true,
      replies: [],
      likeCount: 0,
    };

    const detailCommentThread = new DetailCommentThread(payload);
    expect(detailCommentThread.id).toEqual(payload.id);
    expect(detailCommentThread.username).toEqual(payload.username);
    expect(detailCommentThread.date).toEqual(payload.date);
    expect(detailCommentThread.content).toEqual('**komentar telah dihapus**');
    expect(detailCommentThread.replies).toEqual(payload.replies);
  });
});
