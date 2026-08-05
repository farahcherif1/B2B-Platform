import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user-management/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../user-management/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService (Real Functions)', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  const mockUserRepository = {
    findOneByEmail: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should hash the password and create a new user', async () => {
      const userDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      jest.spyOn(userService, 'create').mockImplementation(async (user) => {
        const usera = new User();
        usera.id = 1;
        usera.name = user.name;
        usera.email = user.email;
        usera.password = hashedPassword;
        usera.role = 'user';
        return usera;
      });

      const result = await authService.register(
        userDto.name,
        userDto.email,
        userDto.password,
      );

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      });
    });

    it('should throw an error if the user already exists', async () => {
      const userDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const user = new User();
      user.id = 1;
      user.email = userDto.email;
      user.password = 'password';
      user.role = 'user';
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

      await expect(
        authService.register(userDto.name, userDto.email, userDto.password),
      ).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('login', () => {
    it('should validate credentials and return a JWT', async () => {
      const userDto = { email: 'john@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(userDto.password, 10);
      const user = new User();
      user.id = 1;
      user.email = userDto.email;
      user.password = hashedPassword;
      user.role = 'user';

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await authService.login(userDto.email, userDto.password);

      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw an error for invalid credentials', async () => {
      const userDto = { email: 'john@example.com', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('correctpassword', 10);

      const user = new User();
      user.id = 1;
      user.email = userDto.email;
      user.password = hashedPassword;

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);

      await expect(
        authService.login(userDto.email, userDto.password),
      ).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.NOT_FOUND),
      );
    });
  });
});
