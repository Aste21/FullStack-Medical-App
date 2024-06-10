export class Doctor {
  id?: number;
  firstname: string;
  lastname: string;
  profession: string;

  constructor(firstname: string, lastname: string, profession: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.profession = profession;
  }

}
