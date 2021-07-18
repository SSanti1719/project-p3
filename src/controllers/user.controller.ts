import {intercept, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {emailTypes} from '../config/index.config';
import {
  changePasswordCredentials,
  Credentials,
  resetPasswordCredentials,
} from '../config/interfaces';
import {User} from '../models';
import {adminAuthenticate} from '../providers/auth-strategy.provider';
import {CityRepository, UserRepository} from '../repositories';
import {AuthService} from '../services';
import {GeneralFunctionsService} from '../services/general-functions.service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CityRepository)
    public cityRepository: CityRepository,
    @service(GeneralFunctionsService)
    public generalFunctions: GeneralFunctionsService,
    @service(AuthService)
    public authenticationService: AuthService,
  ) {}

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'password'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    if (!user.cityId || !(await this.cityRepository.findById(user.cityId)))
      throw new HttpErrors.BadRequest('CityId no valid');

    let randomPassword = this.generalFunctions.GenerateRandomPassword();
    let encryptPassword = this.generalFunctions.EncryptPassword(randomPassword);

    user.password = encryptPassword;

    let newUser = await this.userRepository.create(user);

    if (!newUser) {
      throw new HttpErrors.InternalServerError();
    }

    const emailData = {
      email: newUser.email,
      password: randomPassword,
    };
    await this.generalFunctions.EmailNotification(
      emailData,
      emailTypes.sign_up,
    );

    return newUser;
  }

  @post('/login')
  @response(200, {
    description: 'User login',
  })
  async login(@requestBody() credentials: Credentials): Promise<Object> {
    let user = await this.authenticationService.IdentifyUser(
      credentials.username,
      credentials.password,
    );

    if (!user) {
      throw new HttpErrors.Unauthorized('Username or password incorrect');
    } else {
      let token = this.authenticationService.GenerateToken(user);
      return {
        username: user.email,
        id: user.id,
        role: user.role,
        token,
      };
    }
  }
  @post('/change-password')
  @response(200, {
    description: 'User change password',
  })
  async changePassword(
    @requestBody() credentials: changePasswordCredentials,
  ): Promise<Boolean> {
    let user = await this.authenticationService.IdentifyUser(
      credentials.username,
      credentials.currentPassword,
    );
    if (!user) {
      throw new HttpErrors.Unauthorized('Username or password incorrect');
    } else {
      await this.authenticationService.changePassword(
        user,
        credentials.newPassword,
      );

      const emailData = {
        email: user.email,
      };
      await this.generalFunctions.EmailNotification(
        emailData,
        emailTypes.change_password,
      );
      return true;
    }
  }

  @post('/reset-password')
  @response(200, {
    description: 'User reset password',
  })
  async resetPassword(@requestBody() credentials: resetPasswordCredentials) {
    const newPassword = await this.authenticationService.resetPassword(
      credentials.username,
    );

    if (!newPassword) throw new HttpErrors.BadRequest();

    const emailData = {
      email: credentials.username,
      password: newPassword,
    };
    this.generalFunctions.EmailNotification(
      emailData,
      emailTypes.reset_password,
    );

    return true;
  }

  @get('/users/count')
  @intercept(adminAuthenticate)
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @intercept(adminAuthenticate)
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
