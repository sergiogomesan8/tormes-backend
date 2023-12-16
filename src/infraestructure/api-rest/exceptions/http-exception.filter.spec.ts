import { HttpExceptionFilter } from './http-exception.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

describe('HttpExceptionFilter', () => {
  it('should catch exceptions', () => {
    const mockRequest = {
      url: '/test',
    } as Request;

    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockResponse = {
      status: mockStatus,
    } as unknown as Response;

    const mockNextFunction = jest.fn() as NextFunction;

    const mockArgumentsHost: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: <T = any>() => mockResponse as T,
        getRequest: <T = any>() => mockRequest as T,
        getNext: <T = any>() => mockNextFunction as T,
      }),
      getArgs: <T = any>() => [] as T,
      getArgByIndex: () => null,
      switchToRpc: () => null,
      switchToWs: () => null,
      getType: <TContext = string>() => 'http' as TContext,
    };

    const mockExceptionResponse = { message: 'Test exception' };
    const mockExceptionStatus = HttpStatus.BAD_REQUEST;
    const mockException = {
      getResponse: () => mockExceptionResponse,
      getStatus: () => mockExceptionStatus,
    } as unknown as HttpException;

    const filter = new HttpExceptionFilter();
    filter.catch(mockException, mockArgumentsHost);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: 500,
      message: mockExceptionResponse.message,
      timestamp: expect.any(String),
      path: mockRequest.url,
    });
  });
});
