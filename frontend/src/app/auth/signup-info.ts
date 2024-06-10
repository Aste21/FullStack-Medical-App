export class SignupInfo {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  role: string[];

  constructor(username: string, password: string, name: string, surname: string, email: string, role: string[]) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
  }
}
