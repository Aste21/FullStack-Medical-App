import { Doctor } from '../doctors/doctor.model';
import { UserDTO } from '../services/user-dto';

export class Visit {
  id?: number;
  date: string;
  doctorId: number;
  userId: number;
  doctor: Doctor;
  user: UserDTO;
  prescription?: string;  // Add this line

  constructor() {
    this.date = '';
    this.doctorId = 0;
    this.userId = 0;
    // @ts-ignore
    this.doctor = new Doctor();
    // @ts-ignore
    this.user = new UserDTO();
  }
}
