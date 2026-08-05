import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user-management/services/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { SendEmailDto } from 'src/shared/mailer/dto/send-email.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/user-management/entities/user-role.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/user-management/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from 'src/event-management/services/event.service';
import { User } from 'src/user-management/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private mailerService: MailerService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    private readonly configService: ConfigService,
    private eventService: EventService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  readonly mailer = this.configService.get<string>('MAIL_SENDER');
  readonly mailer_name = this.configService.get<string>('MAIL_SENDER_NAME');
  readonly env_url = this.configService.get<string>('PATH_ENV');

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    console.log(await this.hashPassword(password));
    console.log(storedPasswordHash);
    return bcrypt.compare(password, storedPasswordHash);
  }

  async register(name: string, email: string, password: string): Promise<any> {
    email = email.toLowerCase();
    const user = await this.userService.findOneByEmail(email);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.hashPassword(password);
    const res = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });
    const { ...result } = res;
    return result;
  }

  async registerOrganizer(
    name: string,
    email: string,
    password: string,
  ): Promise<any> {
    email = email.toLowerCase();
    const user = await this.userService.findOneByEmail(email);
    console.log(user);
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.hashPassword(password);
    const res = await this.userService.createOrganizer({
      name,
      email,
      password: hashedPassword,
    });
    return res;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await this.comparePasswords(password, user.password))) {
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.userRoles,
        is_organizer: user.is_organizer,
      };
      return { access_token: this.jwtService.sign(payload) };
    }
    throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
  }

  async loginOrganizer(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await this.comparePasswords(password, user.password))) {
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.userRoles,
        is_organizer: user.is_organizer,
      };
      if (user.is_organizer)
        return {
          access_token: this.jwtService.sign(payload),
          is_organizer: true,
        };
    }
    throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
  }

  async sendEmailResetPassword(email: string): Promise<any> {
    email = email.toLowerCase();
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const token = await this.tokenService.generateToken(
      email,
      'reset-password',
    );
    const dto: SendEmailDto = {
      from: {
        name: this.mailer_name,
        address: this.mailer,
      },
      recipients: [
        {
          name: user.name,
          address: user.email,
        },
      ],
      subject: 'Reset your password',
      html: `<h1>Reset your password</h1><p>Click <a href="${this.env_url}/create-password/${token.token}">here</a> to reset your password</p>`,
    };
    return await this.mailerService.sendEmail(dto);
  }

  async resetPassword(token: string, password: string): Promise<any> {
    const isValid = await this.tokenService.verifyToken(
      token,
      'reset-password',
    );
    if (!isValid) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const { email } = this.jwtService.decode(token) as { email: string };
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    await this.userService.update(user.id, user);
  }

  async inviteOrganizer(data) {
    const role = await this.roleRepository.findOne({
      where: { name: data.role },
    });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.BAD_REQUEST);
    }
    const event = await this.eventService.findOne(data.eventId);
    if (!event) {
      throw new HttpException('Event not found', HttpStatus.BAD_REQUEST);
    }
    let user = await this.userRepository.findOne({
      where: { email: data.email, is_organizer: true },
    });
    let html = `<h1>Invitation to be an organizer</h1><p>you have been invited to be an organizer in the event ${event.name} </p>`;
    if (!user) {
      const password = crypto.randomBytes(20).toString('hex');

      const name = data.email.split('@')[0];
      console.log(name, 'and email', data.email);

      user = await this.registerOrganizer(
        `${name}_organizer`,
        data.email,
        password,
      );
      html =
        html +
        `<br><p>your email : ${data.email} <br>your password is ${password}</p>`;
    }

    const userRole = this.userRoleRepository.create({
      user: user,
      role: role,
      event: event,
    });
    await this.userRoleRepository.save(userRole);
    const dto: SendEmailDto = {
      from: {
        name: this.mailer_name,
        address: this.mailer,
      },
      recipients: [
        {
          name: user.name,
          address: user.email,
        },
      ],
      subject: 'invitation event organizer',
      html,
    };

    return await this.mailerService.sendEmail(dto);
  }
}
