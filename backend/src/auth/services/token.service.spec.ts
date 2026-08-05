import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { UserService } from '../user/user.service';
import { Token } from '../auth/entities/token.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

describe('TokenService', () => {
  let service: TokenService;
  let userService: UserService;
  let jwtService: JwtService;
  let tokenRepository: Repository<Token>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Token),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    tokenRepository = module.get<Repository<Token>>(getRepositoryToken(Token));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate and save a token', async () => {
      const email = 'test@example.com';
      const validity = 'email_verification';
      const user = { id: 1, email } as User;
      const tokenValue = 'jwt_token';
      const expirationDate = new Date();
      expirationDate.setSeconds(expirationDate.getSeconds() + 3600);

      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(tokenValue);
      jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue({ exp: expirationDate.getTime() / 1000 });
      jest.spyOn(tokenRepository, 'create').mockReturnValue({} as Token);
      jest.spyOn(tokenRepository, 'save').mockResolvedValue({} as Token);

      const result = await service.generateToken(email, validity);

      expect(userService.findOneByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { expiresIn: '1h' },
      );
      expect(jwtService.decode).toHaveBeenCalledWith(tokenValue);
      expect(tokenRepository.create).toHaveBeenCalledWith({
        user,
        token: tokenValue,
        validity,
        expired_date: expirationDate.toISOString(),
      });
      expect(tokenRepository.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const tokenValue = 'jwt_token';
      const validity = 'email_verification';
      const token = { token: tokenValue, validity, is_expired: false } as Token;

      jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(token);
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ sub: 1, email: 'test@example.com' });
      jest.spyOn(tokenRepository, 'save').mockResolvedValue(token);

      const result = await service.verifyToken(tokenValue, validity);

      expect(tokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: tokenValue, is_expired: false },
      });
      expect(jwtService.verify).toHaveBeenCalledWith(token.token);
      expect(tokenRepository.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if token is not found', async () => {
      const tokenValue = 'jwt_token';
      const validity = 'email_verification';

      jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(null);

      const result = await service.verifyToken(tokenValue, validity);

      expect(tokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: tokenValue, is_expired: false },
      });
      expect(result).toBe(false);
    });

    it('should return false if token validity does not match', async () => {
      const tokenValue = 'jwt_token';
      const validity = 'email_verification';
      const token = {
        token: tokenValue,
        validity: 'reset_password',
        is_expired: false,
      } as Token;

      jest.spyOn(tokenRepository, 'findOne').mockResolvedValue(token);
      jest
        .spyOn(jwtService, 'verify')
        .mockReturnValue({ sub: 1, email: 'test@example.com' });

      const result = await service.verifyToken(tokenValue, validity);

      expect(tokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: tokenValue, is_expired: false },
      });
      expect(jwtService.verify).toHaveBeenCalledWith(token.token);
      expect(result).toBe(false);
    });
  });
});
