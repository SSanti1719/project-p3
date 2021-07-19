interface Credentials {
  username: string;
  password: string;
}

interface changePasswordCredentials {
  id: string;
  username: string;
  currentPassword: string;
  newPassword: string;
}

interface resetPasswordCredentials {
  username: string;
}

interface ClientOffer {
  name: string;
  lastname: string;
  email: string;
  phone: string;
}

export {
  Credentials,
  changePasswordCredentials,
  resetPasswordCredentials,
  ClientOffer,
};
