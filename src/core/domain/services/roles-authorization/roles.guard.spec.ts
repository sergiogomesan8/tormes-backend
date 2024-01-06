import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;
  let context: jest.Mocked<ExecutionContext>;

  beforeEach(async () => {
    const reflectorMock: jest.Mocked<Reflector> = {
      get: jest.fn(),
      getAll: jest.fn(),
      getAllAndMerge: jest.fn(),
      getAllAndOverride: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [RolesGuard, { provide: Reflector, useValue: reflectorMock }],
    }).compile();

    guard = moduleRef.get<RolesGuard>(RolesGuard);
    reflector = moduleRef.get<Reflector>(Reflector) as jest.Mocked<Reflector>;
    context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should not allow if roles are not defined', () => {
    reflector.get.mockReturnValue(undefined);
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should not allow if user is not defined', () => {
    reflector.get.mockReturnValue([1]);
    context.switchToHttp().getRequest = jest.fn().mockReturnValue({});
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should allow if user has required role', () => {
    reflector.get.mockReturnValue([1]);
    context.switchToHttp().getRequest = jest
      .fn()
      .mockReturnValue({ user: { userType: 1 } });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should not allow if user does not have required role', () => {
    reflector.get.mockReturnValue([1]);
    context.switchToHttp().getRequest = jest
      .fn()
      .mockReturnValue({ user: { userType: 2 } });
    expect(guard.canActivate(context)).toBe(false);
  });

  it('should correctly match roles', () => {
    expect(guard.matchRoles([1, 2, 3], 2)).toBe(true);
    expect(guard.matchRoles([1, 2, 3], 4)).toBe(false);
  });
});
