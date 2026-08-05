import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './core/guards/auth.guard';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {s
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const result = { id: 1, name: 'John Doe', email: 'john@example.com' };

      mockAuthService.register.mockResolvedValue(result);

      expect(await authController.register(registerDto)).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(
        'John Doe',
        'john@example.com',
        'password',
      );
    });

    it('should throw an error if user already exists', async () => {
      const registerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      mockAuthService.register.mockImplementation(() => {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      });

      await expect(authController.register(registerDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginDto = { email: 'john@example.com', password: 'password' };
      const result = { access_token: 'jwt_token' };

      mockAuthService.login.mockResolvedValue(result);

      expect(await authController.login(loginDto)).toEqual(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(
        'john@example.com',
        'password',
      );
    });

    it('should throw an error for invalid credentials', async () => {
      const loginDto = { email: 'john@example.com', password: 'wrongpassword' };

      mockAuthService.login.mockImplementation(() => {
        throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
      });

      await expect(authController.login(loginDto)).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('profile', () => {
    it('should return "Profile" if user is authenticated', async () => {
      expect(await authController.profile()).toBe('Profile');
    });
  });
});
