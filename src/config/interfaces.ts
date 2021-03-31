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

export {Credentials, changePasswordCredentials, resetPasswordCredentials};
