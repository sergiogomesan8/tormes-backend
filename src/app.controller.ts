import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*  @Get()
  getHello(@Request() req) {
    const user: UserDto = req.user;
    if (user.id === null) {
      throw new BadRequestException(
        'Bad request. Invalid data provided: userId is null',
      );
    }
    return user;
  }*/
}
