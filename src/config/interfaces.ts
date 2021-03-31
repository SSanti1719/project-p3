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

export {Credentials, changePasswordCredentials};

