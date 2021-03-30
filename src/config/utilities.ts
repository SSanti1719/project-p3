const subject = (type: string): string => {
  switch (type) {
    case 'signUp':
      return 'Tu Usuario ha sido creado';
    default:
      return '';
  }
};

const text = (type: string): string => {
  switch (type) {
    case 'signUp':
      return 'Hola, tu usuario ha sido creado exitosamente con los siguientes datos';
    default:
      return '';
  }
};

const html = (type: string, data: any): string => {
  switch (type) {
    case 'signUp':
      return `
        <h1>Email: ${data.email}</h1>
        <h1>Password: ${data.password}</h1>
      `;

    default:
      return '';
  }
};

export {subject, text, html};
