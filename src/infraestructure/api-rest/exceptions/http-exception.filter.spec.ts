import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockResponse: Response;
  let mockRequest: Request;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockRequest = { url: '/test' } as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
      getArgs: () => [],
      getArgByIndex: () => null,
      switchToRpc: () => null,
      switchToWs: () => null,
      getType: () => 'http',
    } as unknown as ArgumentsHost;
  });

  it('should return the correct status and message for HttpException', () => {
    const mockExceptionResponse = { message: 'Bad Request' };
    const mockExceptionStatus = HttpStatus.BAD_REQUEST;
    const mockException = new HttpException(
      mockExceptionResponse,
      mockExceptionStatus,
    );

    filter.catch(mockException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(mockExceptionStatus);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: mockExceptionStatus,
      message: mockExceptionResponse.message,
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });

  it('should return 500 Internal Server Error for non-HttpException', () => {
    const mockNonHttpException = new Error('Some unexpected error');

    filter.catch(mockNonHttpException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });
});
