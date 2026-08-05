import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome Cepex B2B Platform APIs!';
  }
}
