import {
  DefaultSequence,
  ExpressRequestHandler,
  RequestContext,
} from '@loopback/rest';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import {MyAuthStrategy} from './providers/auth-strategy.provider';

const middlewareList: ExpressRequestHandler[] = [
  cors(),
  morgan('dev'),
  passport.initialize(),
];

export class MySequence extends DefaultSequence {
  async handle(context: RequestContext) {
    try {
      const {request, response} = context;

      const finished = await this.invokeMiddleware(context, middlewareList);
      passport.use(MyAuthStrategy);

      if (finished) return;

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);

      // console.log('-------Finished: ', finished);
      // console.log('-------Route: ', route);
      // console.log('-------Args: ', args);
      // console.log('-------result: ', result);

      this.send(response, result);
    } catch (error) {
      this.reject(context, error);
    }
  }
}
