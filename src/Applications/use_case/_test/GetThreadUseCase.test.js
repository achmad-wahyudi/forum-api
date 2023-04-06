const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentThreadRepository = require('../../../Domains/comments-thread/CommentThreadRepository');
const DetailCommentThread = require('../../../Domains/comments-thread/entities/DetailCommentThread');
const DetailReplyComment = require('../../../Domains/replies-comment/entities/DetailReplyComment');
const GetThreadUseCase = require('../GetThreadUseCase');
const ReplyCommentRepository = require('../../../Domains/replies-comment/ReplyCommentRepository');
const LikeCommentRepository = require('../../../Domains/likes-comment/LikeCommentRepository');

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
        new DetailCommentThread({
          content: 'comment A',
          date: '2021',
          id: 'comment-1111111',
          username: 'user A',
          likeCount: 2,
          replies: [
            {
              content: 'reply A',
              date: '2021',
              id: 'reply-111111111',
              username: 'user C',
            },
          ],
        }),
        new DetailCommentThread({
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
    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockCommentThreadRepository = new CommentThreadRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => ({
        id: 'thread-11111111',
        title: 'some thread title',
        body: 'some thread body',
        date: '2020',
        username: 'John Doe',
      }));
    mockReplyCommentRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => [
        new DetailReplyComment({
          id: 'reply-111111111',
          commentId: 'comment-1111111',
          content: 'reply A',
          date: '2021',
          username: 'user C',
        }),
        new DetailReplyComment({
          id: 'reply-456',
          commentId: 'comment-456',
          content: 'reply B',
          date: '2021',
          username: 'user D',
        }),
      ]);

    mockCommentThreadRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => [
        new DetailCommentThread({
          id: 'comment-1111111',
          username: 'user A',
          date: '2021',
          content: 'comment A',
          replies: [],
          likeCount: 0,
        }),
        new DetailCommentThread({
          id: 'comment-456',
          username: 'user B',
          date: '2020',
          content: 'comment B',
          replies: [],
          likeCount: 0,
        }),
      ]);

    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-1111111' ? 2 : 0));

    const getThreadDetailUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentThreadRepository: mockCommentThreadRepository,
      replyCommentRepository: mockReplyCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // action
    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    // assert
    expect(useCaseResult).toEqual(expectedDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentThreadRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
    expect(mockReplyCommentRepository.getRepliesByThreadId).toBeCalledWith(useCaseParam.threadId);
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
      new DetailReplyComment({
        id: 'reply-111111111',
        commentId: 'comment-1111111',
        content: 'reply A',
        date: '2021',
        username: 'user C',
        isDeleted: true,
      }),
      new DetailReplyComment({
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
      id: 'reply-111111111',
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

    const mockLikeCommentRepository = new LikeCommentRepository();
    mockLikeCommentRepository.getLikeCountByCommentId = jest.fn()
      .mockImplementation((commentId) => Promise.resolve(commentId === 'comment-1111111' ? 2 : 0));

    const getThreadDetailUseCase = new GetThreadUseCase(
      {
        threadRepository: {},
        commentThreadRepository: {},
        likeCommentRepository: mockLikeCommentRepository,
      },
    );

    const SpyGetLikeCountForComments = jest.spyOn(getThreadDetailUseCase, '_getLikeCountForComments');

    const result = await getThreadDetailUseCase
      ._getLikeCountForComments(commentParam);

    expect(result)
      .toEqual(2);
    expect(mockLikeCommentRepository.getLikeCountByCommentId).toBeCalledTimes(1);

    SpyGetLikeCountForComments.mockClear();
  });
});
