import {HttpErrors, toInterceptor} from '@loopback/rest';
import passport from 'passport';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import {jwt as jwtKeys, roles} from '../config/index.config';

const options: StrategyOptions = {
  //jwtFromRequest: ExtractJwt.fromHeader("custom_header_name"),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Header => Autorization : Bearer token
  secretOrKey: jwtKeys.secret_Key,
};

const MyAuthStrategy = new Strategy(options, async (decodingToken, done) => {
  return done(null, decodingToken.data);
});

const verifyRole = (type: string, role: number) => {
  console.log('entre');
  if (type === 'admin' && role === roles.admin) return true;
  if (type === 'seller' && role === roles.seller) return true;
  if (type === 'basic' && (role === roles.admin || role === roles.seller))
    return true;

  return false;
};

const adminAuthenticate = toInterceptor(
  passport.authenticate('jwt', {session: false}),
  (req: any, res: any, next: any) => {
    console.log(req.user);
    const verification = verifyRole('admin', req.user.role);

    if (verification) return next();

    throw new HttpErrors[401]();
  },
);

const sellerAuthenticate = toInterceptor(
  passport.authenticate('jwt', {session: false}),
  (req: any, res: any, next: any) => {
    const verification = verifyRole('seller', req.user.role);

    if (verification) return next();

    throw new HttpErrors[401]();
  },
);

const BasicAuthenticate = toInterceptor(
  passport.authenticate('jwt', {session: false}),
  (req: any, res: any, next: any) => {
    const verification = verifyRole('basic', req.user.role);

    if (verification) return next();

    throw new HttpErrors[401]();
  },
);

export {
  MyAuthStrategy,
  adminAuthenticate,
  sellerAuthenticate,
  BasicAuthenticate,
};
