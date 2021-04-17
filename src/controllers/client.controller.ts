import {inject, intercept} from '@loopback/context';
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
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import path from 'path';
import {cloudFilesRoutes} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {Client} from '../models';
import {CityRepository, ClientRepository} from '../repositories';
import {cloudinary} from '../services/cloudinary.service';

export class ClientController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
    @repository(CityRepository)
    public cityRepository: CityRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
  ) {}

  @post('/clients')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Client model instance',
    content: {'application/json': {schema: getModelSchemaRef(Client)}},
  })
  async create(): Promise<Client> {
    const {
      name,
      lastname,
      document,
      birthday,
      phone,
      email,
      adress,
      cityId,
    } = this.req.body;

    const {file} = this.req;

    if (
      !name ||
      !lastname ||
      !document ||
      !birthday ||
      !phone ||
      !email ||
      !adress ||
      !file
    )
      throw new HttpErrors.BadRequest('Incomplete Data');

    if (!cityId || !(await this.cityRepository.findById(cityId)))
      throw new HttpErrors.BadRequest('CityId no valid');

    const uploadedImage: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
      file.path,
      {
        public_id: `${cloudFilesRoutes.clients}/${path.basename(
          file.path,
          path.extname(file.path),
        )}`,
      },
    );

    const image = uploadedImage.secure_url;
    const image_public_id = uploadedImage.public_id;

    return this.clientRepository.create({
      name,
      lastname,
      document,
      birthday,
      phone,
      email,
      adress,
      cityId,
      image,
      image_public_id,
    });
  }

  @get('/clients/count')
  @response(200, {
    description: 'Client model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Client) where?: Where<Client>): Promise<Count> {
    return this.clientRepository.count(where);
  }

  @get('/clients')
  @response(200, {
    description: 'Array of Client model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Client, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Client) filter?: Filter<Client>): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @patch('/clients')
  @response(200, {
    description: 'Client PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
    @param.where(Client) where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.updateAll(client, where);
  }

  @get('/clients/{id}')
  @response(200, {
    description: 'Client model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Client, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Client, {exclude: 'where'})
    filter?: FilterExcludingWhere<Client>,
  ): Promise<Client> {
    return this.clientRepository.findById(id, filter);
  }

  @patch('/clients/{id}')
  @intercept(filesInterceptor)
  @response(204, {
    description: 'Client PATCH success',
  })
  async updateById(@param.path.string('id') id: string): Promise<void> {
    const oldClient = await this.clientRepository.findById(id);

    if (!oldClient) throw new HttpErrors.NotFound('client not found');

    const requestBody = this.req.body;

    const client: any = {};

    if (requestBody.name) {
      client.name = requestBody.name;
    }

    if (requestBody.lastname) {
      client.lastname = requestBody.lastname;
    }

    if (requestBody.document) {
      client.document = client.document;
    }

    if (requestBody.birthday) {
      client.birthday = requestBody.birthday;
    }

    if (requestBody.phone) {
      client.phone = requestBody.phone;
    }

    if (requestBody.email) {
      client.email = requestBody.email;
    }

    if (requestBody.adress) {
      client.adress = requestBody.adress;
    }

    if (requestBody.cityId) {
      const city = await this.cityRepository.findById(requestBody.cityId);

      if (!city) throw new HttpErrors.BadRequest('Invalid cityId');

      client.cityId = requestBody.cityId;
    }

    if (this.req.file) {
      cloudinary.v2.uploader.destroy(oldClient.image_public_id);

      const imageUploaded = await cloudinary.v2.uploader.upload(
        this.req.file.path,
        {
          public_id: `${cloudFilesRoutes.projects}/${path.basename(
            this.req.file.path,
            path.extname(this.req.file.path),
          )}`,
        },
      );

      client.image = imageUploaded.secure_url;
      client.image_public_id = imageUploaded.public_id;
    }

    await this.clientRepository.updateById(id, client);
  }

  @put('/clients/{id}')
  @response(204, {
    description: 'Client PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() client: Client,
  ): Promise<void> {
    await this.clientRepository.replaceById(id, client);
  }

  @del('/clients/{id}')
  @response(204, {
    description: 'Client DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clientRepository.deleteById(id);
  }
}
