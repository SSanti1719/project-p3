import { /* inject, */ BindingScope, injectable} from '@loopback/core';
const generator = require('generate-password');
const cryptoJS = require('crypto-js');
@injectable({scope: BindingScope.TRANSIENT})
export class GeneralFunctionsService {
  constructor(/* Add @inject to inject parameters */) { }

  /*
   * Add service methods here
   */
  /**
   *
   * @returns random password with the package generate-password
   */
  GenerateRandomPassword(): string {
    let password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    return password;
  }

  /**
   *
   * @param password already password
   * @returns encrypt password
   */
  EncryptPassword(password: string): string {
    let newPassword = cryptoJS.MD5(password).toString();
    return newPassword;
  }

}
