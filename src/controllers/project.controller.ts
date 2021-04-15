import {inject, intercept} from '@loopback/context';
import {service} from '@loopback/core';
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
import {cloudFilesRoutes, codeTypes} from '../config/index.config';
import {filesInterceptor} from '../middleware/multer';
import {Project} from '../models';
import {
  CityRepository,
  CountryRepository,
  ProjectRepository,
} from '../repositories';
import {GeneralFunctionsService} from '../services';
import {cloudinary} from '../services/cloudinary.service';

/*
 @requestBody({
      content: {
        'multipart/form-data': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: ['id'],
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
*/
export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @repository(CityRepository) private cityRepository: CityRepository,
    @repository(CountryRepository) private countryRepository: CountryRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @service(GeneralFunctionsService)
    private generalFunctions: GeneralFunctionsService,
  ) {}

  @post('/projects')
  @intercept(filesInterceptor)
  @response(200, {
    description: 'Project model instance',
    content: {'application/json': {schema: getModelSchemaRef(Project)}},
  })
  async create(): Promise<Project> {
    const {name, description, cityId} = this.req.body;
    const {file} = this.req;

    if (!name || !description || !cityId || !file)
      throw new HttpErrors.BadRequest('Incomplete data');

    if (!(await this.cityRepository.findById(cityId)))
      throw new HttpErrors.BadRequest('cityId no valid');

    const uploadedImage: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(
      file.path,
      {
        public_id: `${cloudFilesRoutes.projects}/${path.basename(
          file.path,
          path.extname(file.path),
        )}`,
      },
    );

    const image = uploadedImage.secure_url;
    const image_public_id = uploadedImage.public_id;
    const code = this.generalFunctions.generateCode(codeTypes.project);

    const project = await this.projectRepository.create({
      code,
      name,
      description,
      cityId,
      image,
      image_public_id,
    });

    return project;
  }

  @get('/projects/count')
  @response(200, {
    description: 'Project model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Project) where?: Where<Project>): Promise<Count> {
    return this.projectRepository.count(where);
  }

  @get('/projects')
  @response(200, {
    description: 'Array of Project model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Project, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @get('/home-projects')
  async getHomeProjects(): Promise<any[]> {
    const projects = await this.projectRepository.find();

    const homeProjectsList = Promise.all(
      projects.map(async project => {
        const city = await this.cityRepository.findById(project.cityId);
        const country = await this.countryRepository.findById(city.countryId);

        return {
          ...project,
          cityName: city.name,
          countryId: country.id,
          countryName: country.name,
        };
      }),
    );

    return await homeProjectsList;
  }

  @patch('/projects')
  @response(200, {
    description: 'Project PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
    @param.where(Project) where?: Where<Project>,
  ): Promise<Count> {
    return this.projectRepository.updateAll(project, where);
  }

  @get('/projects/{id}')
  @response(200, {
    description: 'Project model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Project, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Project, {exclude: 'where'})
    filter?: FilterExcludingWhere<Project>,
  ): Promise<Project> {
    return this.projectRepository.findById(id, filter);
  }

  @patch('/projects/{id}')
  @response(204, {
    description: 'Project PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {partial: true}),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    await this.projectRepository.updateById(id, project);
  }

  @put('/projects/{id}')
  @response(204, {
    description: 'Project PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() project: Project,
  ): Promise<void> {
    await this.projectRepository.replaceById(id, project);
  }

  @del('/projects/{id}')
  @response(204, {
    description: 'Project DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectRepository.deleteById(id);
  }
}
