import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/users/hash.service';
import { CreateUserDto } from '~/users/dto/create-user.dto';
import { User, UserDocument } from '~/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (!user) return null;

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    if (user && (await this.hashService.comparePassword(pass, user.password))) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any, res: Response) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: 'strict',
    });

    return res.json({
      access_token,
    });
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    createdUser.password = await this.hashService.hashPassword(
      createdUser.password,
    );

    return createdUser.save();
  }
}
