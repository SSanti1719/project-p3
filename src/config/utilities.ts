import {emailTypes} from './index.config';

const subject = (type: string): string => {
  switch (type) {
    case emailTypes.sign_up:
      return 'Tu Usuario ha sido creado';
    case emailTypes.change_password:
      return 'Constraseña actualizada';
    case emailTypes.reset_password:
      return 'Constraseña recuperada';
    default:
      return '';
  }
};

const text = (type: string): string => {
  switch (type) {
    case emailTypes.sign_up:
      return 'Hola, tu usuario ha sido creado exitosamente con los siguientes datos';
    case emailTypes.change_password:
      return 'Hola, la contraseña de tu cuenta ha sido actualizada';
    case emailTypes.reset_password:
      return 'Hola, tu contraseña ha sido restablecida';
    default:
      return '';
  }
};

const html = (type: string, data: any): string => {
  switch (type) {
    case emailTypes.sign_up:
      return `
        <h1>Email: ${data.email}</h1>
        <h1>Password: ${data.password}</h1>
      `;
    case emailTypes.change_password:
      return `
        <h1>Email: ${data.email}</h1>
        <h1>Password actualizada existosamente!</h1>
      `;
    case emailTypes.reset_password:
      return `
          <h1>Email: ${data.email}</h1>
          <h1>Password: ${data.password}</h1>
        `;

    default:
      return '';
  }
};

export {subject, text, html};
