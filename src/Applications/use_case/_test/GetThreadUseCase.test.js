const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const GetThreadUseCase = require('../GetThreadUseCase');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };

    const expectedDetailThread = new DetailThread({
      id: 'thread-1234',
      title: 'some thread title',
      body: 'some thread body',
      date: '2020',
      username: 'John Doe',
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user A',
        date: '2021',
        content: 'comment A',
        replies: [],
      }),
      new DetailComment({
        id: 'comment-456',
        username: 'user B',
        date: '2020',
        content: 'comment B',
        replies: [],
      }),
    ];

    const retrievedReplies = [
      new DetailReply({
        id: 'reply-123',
        commentId: 'comment-123',
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
    ];

    const { commentId: commentIdReplyA, ...filteredReplyDetailsA } = retrievedReplies[0];
    const { commentId: commentIdReplyB, ...filteredReplyDetailsB } = retrievedReplies[1];

    const expectedCommentsAndReplies = [
      { ...expectedComments[0], replies: [filteredReplyDetailsA] },
      { ...expectedComments[1], replies: [filteredReplyDetailsB] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvalaibility = jest.fn()
      .mockImplementation(() => ({
        id: 'thread-1234',
        title: 'some thread title',
        body: 'some thread body',
        date: '2020',
        username: 'John Doe',
      }));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => [
        new DetailReply({
          id: 'reply-123',
          commentId: 'comment-123',
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
          id: 'comment-123',
          username: 'user A',
          date: '2021',
          content: 'comment A',
          replies: [],
        }),
        new DetailComment({
          id: 'comment-456',
          username: 'user B',
          date: '2020',
          content: 'comment B',
          replies: [],
        }),
      ]);

    const getThreadDetailUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // action
    const useCaseResult = await getThreadDetailUseCase.execute(useCaseParam);

    // assert
    expect(useCaseResult).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsAndReplies,
    }));
    expect(mockThreadRepository.verifyThreadAvalaibility).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
