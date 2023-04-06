const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const GetThreadUseCase = require('../GetThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentLikeRepository = require('../../../Domains/comment-likes/CommentLikeRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-11111111',
    };

    const expectedDetailThread = {
      body: 'some thread body',
      date: '2020',
      id: 'thread-11111111',
      title: 'some thread title',
      username: 'John Doe',
      comments: [
        new DetailComment({
          content: 'comment A',
          date: '2021',
          id: 'comment-1111111',
          username: 'user A',
          likeCount: 2,
          replies: [
            {
              content: 'reply A',
              date: '2021',
              id: 'reply-123',
              username: 'user C',
            },
          ],
        }),
        new DetailComment({
          content: 'comment B',
          date: '2020',
          id: 'comment-456',
          username: 'user B',
          likeCount: 0,
          replies: [
            {
              content: 'reply B',
              date: '2021',
              id: 'reply-456',
              username: 'user D',
            },
          ],
        }),
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => ({
        id: 'thread-11111111',
        title: 'some thread title',
        body: 'some thread body',
        date: '2020',
        username: 'John Doe',
      }));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => [
        new DetailReply({
          id: 'reply-123',
          commentId: 'comment-1111111',
          content: 'reply A',
          date: '2021',
          username: 'user C',
        }),
        new DetailReply({
          id: 'reply-456',
          commentId: 'comment-456',
          content: 'reply B',
          date: '2021',
          username: 'user D',
        }),
      ]);

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => [
        new DetailComment({
          id: 'comment-1111111',
          username: 'user A',
          date: '2021',
          content: 'comment A',
          replies: [],
          likeCount: 0,
        }),
        new DetailComment({
          id: 'comment-456',
          username: 'user B',
          date: '2020',
          content: 'comment B',
          replies: [],
          likeCount: 0,
        }),
      ]);

    mockCommentLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-1111111' ? 2 : 0));

    const getThreadDetailUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // action
    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    // assert
    expect(useCaseResult).toEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
  });

  it('should operate the branching in the _getRepliesForComments function properly', () => {
    // arrange
    const getThreadDetailUseCase = new GetThreadUseCase(
      {}, {}, {}, {},
    );
    const filteredComment = {
      id: 'comment-1111111',
      username: 'user A',
      date: '2021',
      content: '**komentar telah dihapus**',
      replies: [],
      likeCount: 0,
    };

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-1111111',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: true,
      }),
      new DetailReply({
        id: 'reply-456',
        commentId: 'comment-456',
        content: 'reply B',
        date: '2021',
        username: 'user D',
        isDeleted: false,
      }),
    ];

    const expectedCommentsAndReplies = [{
      content: 'reply A',
      date: '2021',
      id: 'reply-123',
      username: 'user C',
    }];

    const SpyGetRepliesForComments = jest.spyOn(getThreadDetailUseCase, '_getRepliesForComments');

    // action
    getThreadDetailUseCase
      ._getRepliesForComments(filteredComment, retrievedReplies);

    // assert
    expect(SpyGetRepliesForComments)
      .toReturnWith(expectedCommentsAndReplies);

    SpyGetRepliesForComments.mockClear();
  });

  it('should operate the _getLikeCountForComments function properly', async () => {
    const commentParam = {
      id: 'comment-1111111',
      username: 'user B',
      date: '2020',
      content: 'comment B',
      replies: [{
        id: 'reply-456',
        content: 'reply B',
        date: '2021',
        username: 'user D',
      }],
      likeCount: 0,
    };

    const mockCommentLikeRepository = new CommentLikeRepository();
    mockCommentLikeRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-1111111' ? 2 : 0));

    const getThreadDetailUseCase = new GetThreadUseCase(
      {
        threadRepository: {},
        commentRepository: {},
        commentLikeRepository: mockCommentLikeRepository,
      },
    );

    const SpyGetLikeCountForComments = jest.spyOn(getThreadDetailUseCase, '_getLikeCountForComments');

    const result = await getThreadDetailUseCase
      ._getLikeCountForComments(commentParam);

    expect(result)
      .toEqual(2);
    expect(mockCommentLikeRepository.getLikeCountByCommentId).toBeCalledTimes(1);

    SpyGetLikeCountForComments.mockClear();
  });
});
