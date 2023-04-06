const DetailCommentThread = require('../DetailCommentThread');

describe('a DetailCommentThread entity', () => {
  it('should create DetailCommentThread object properly', () => {
    const payload = {
      id: 'comment-1111111',
      username: 'some comment',
      date: 'thread-11111111,',
      content: 'some comment',
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
    // arrange
    const payload = {
      id: 'comment-1111111',
      username: 'some comment',
      date: 'thread-11111111,',
    };

    // action & assert
    expect(() => new DetailCommentThread(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if payload has invalid data type', () => {
    const payload = {
      id: 123,
      username: {},
      date: 2021,
      content: { content: 'some content' },
      replies: 'replies',
    };

    // action & assert
    expect(() => new DetailCommentThread(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailCommentThread object properly', () => {
    const payload = {
      id: 'comment-1111111',
      username: 'user-1111111111',
      date: 'thread-11111111,',
      content: 'some content',
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
