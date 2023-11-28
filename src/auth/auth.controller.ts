import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Render,
  Body,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { User } from '~/users/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @Render('login')
  async loginPage() {
    return { message: "You're not logged in yet" };
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req, @Response() res) {
    return this.authService.login(req.user, res);
  }

  @Get('/signup')
  @Render('signup')
  async signupPage() {
    return { message: "You're not logged in yet" };
  }

  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signup(createUserDto);
  }
}
