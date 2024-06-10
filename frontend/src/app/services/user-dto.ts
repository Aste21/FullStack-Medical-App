export class UserDTO {
  id: number;
  name: string;
  surname: string;
  email: string;
  username: string;

  constructor(id: number, name: string, surname: string, email: string, username: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.username = username;
  }
}
