import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user-management/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user-management/services/user.service';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateToken(email: string, validity: string): Promise<Token> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const tokenValue = this.jwtService.sign(payload, { expiresIn: '1h' });
    const decodedToken = this.jwtService.decode(tokenValue) as { exp: number };
    const expirationDate = new Date(decodedToken.exp * 1000);

    const token = this.tokenRepository.create({
      user,
      token: tokenValue,
      validity,
      expired_date: expirationDate.toISOString(),
    });

    return await this.tokenRepository.save(token);
  }

  async verifyToken(tokenValue: string, validity: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({
      where: { token: tokenValue, is_expired: false },
    });
    if (!token) return false;
    const decoded = this.jwtService.verify(token.token);
    if (!!decoded && token.validity === validity) {
      await this.expiredToken(tokenValue);
      return true;
    }
    return false;
  }

  async expiredToken(tokenValue: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { token: tokenValue, is_expired: false },
    });
    if (token) {
      token.is_expired = true;
      await this.tokenRepository.save(token);
    }
  }

  async getUserToken(user: User): Promise<Token[]> {
    return await this.tokenRepository.find({
      where: { user },
      relations: ['user'],
    });
  }

  async deleteExpiredToken(): Promise<void> {
    await this.tokenRepository.delete({
      is_expired: true,
    });
  }
}
