import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {jwt as jwtKeys} from '../config/index.config';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {GeneralFunctionsService} from '../services/general-functions.service';
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(GeneralFunctionsService)
    public generalFunctions: GeneralFunctionsService,
  ) { }

  GenerateToken(user: User): string {
    let token = jwt.sign(
      {
        data: {
          _id: user.id,
          username: user.email,
          role: user.role,
        },
      },
      jwtKeys.secret_Key,
      {expiresIn: jwtKeys.expiration_time},
    );
    return token;
  }

  async VerifyToken(token: string) {
    try {
      let data = jwt.verify(token, jwtKeys.secret_Key).data;
      return data;
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }

  async IdentifyUser(
    username: string,
    password: string,
  ): Promise<User | false> {
    let user = await this.userRepository.findOne({where: {email: username}});
    if (user) {
      let pass = this.generalFunctions.EncryptPassword(password);
      if (user.password === pass) {
        return user;
      }
    }
    return false;
  }

  async changePassword(user: User, newPassword: string): Promise<Boolean> {
    if (user) {
      let newEncryptPassword = this.generalFunctions.EncryptPassword(newPassword);
      user.password = newEncryptPassword;
      await this.userRepository.updateById(user.id, user);
      return true;
    }
    return false;
  }


}
