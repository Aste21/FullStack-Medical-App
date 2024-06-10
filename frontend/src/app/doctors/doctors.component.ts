import { Component, OnInit } from '@angular/core';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.model';
import { UserDTO } from '../services/user-dto';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {VisitService} from "../visit/visit.service";

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctorList: Doctor[] = [];
  doctor = {
    firstname: '',
    lastname: '',
    profession: ''
  };
  users: UserDTO[] = [];
  doctorVisitsMap: Map<number, boolean> = new Map();
  userVisitsMap: Map<number, boolean> = new Map();

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private visitService: VisitService
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadUsers();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (data: Doctor[]) => {
        this.doctorList = data;
        this.checkDoctorVisits();
      },
      (err: any) => {
        console.error('Failed to load doctors', err);
      }
    );
  }

  isFormValid(): boolean {
    return this.doctor.firstname.trim() !== '' && this.doctor.lastname.trim() !== '' && this.doctor.profession.trim() !== '';
  }

  add(firstname: string, lastname: string, profession: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    profession = profession.trim();

    if (!firstname || !lastname || !profession) {
      console.error('All fields are required.');
      return;
    }

    this.doctorService.addDoctor({ firstname, lastname, profession } as Doctor)
      .subscribe({
        next: (doctor: Doctor) => {
          this.doctorList?.push(doctor);
          this.checkDoctorVisits();
        },
        error: () => {},
        complete: () => {
          if (this.doctorList != undefined) {
            this.doctorService.totalItems.next(this.doctorList.length);
            console.log(this.doctorList.length);
          }
        }
      });
  }

  checkDoctorVisits(): void {
    this.doctorList.forEach(doctor => {
      if (doctor.id !== undefined) {
        this.visitService.getVisitsByDoctor(doctor.id).subscribe(
          visits => {
            this.doctorVisitsMap.set(doctor.id!, visits.length > 0);
            console.log(`Doctor ID ${doctor.id} has visits:`, visits.length > 0); // Debugging log
          },
          err => {
            console.error(`Failed to fetch visits for doctor ID ${doctor.id}`, err);
            this.doctorVisitsMap.set(doctor.id!, false);
          }
        );
      }
    });
  }

  delete(doctor: Doctor): void {
    if (doctor.id === undefined) {
      alert('Cannot delete doctor with undefined ID.');
      return;
    }
    if (this.doctorVisitsMap.get(doctor.id)) {
      alert('Cannot delete doctor with associated visits.');
      return;
    }

    this.doctorService.deleteDoctor(doctor.id!).subscribe(
      () => {
        this.doctorList = this.doctorList?.filter(c => c !== doctor);
        if (this.doctorList != undefined) {
          this.doctorService.totalItems.next(this.doctorList.length);
          console.log(this.doctorList.length);
        }
      },
      (err: any) => { console.error('Failed to delete doctor', err); }
    );
  }

  update(firstname: string, lastname: string, profession: string, chosenToUpdateDoctor: Doctor): void {
    const id = chosenToUpdateDoctor.id;
    if (id === undefined) {
      alert('Cannot update doctor with undefined ID.');
      return;
    }
    firstname = firstname.trim();
    lastname = lastname.trim();
    profession = profession.trim();
    if (id != undefined) {
      this.doctorService.updateDoctor({ firstname, lastname, profession } as Doctor, id)
        .subscribe({
          next: (doctor: Doctor) => {
            if (this.doctorList != undefined) {
              const index = this.doctorList.indexOf(chosenToUpdateDoctor);
              this.doctorList[index] = doctor;
              this.checkDoctorVisits();
            }
          },
          error: (err: any) => { console.error('Failed to update doctor', err); },
          complete: () => {
            if (this.doctorList != undefined) {
              this.doctorService.totalItems.next(this.doctorList.length);
              console.log(this.doctorList.length);
            }
          }
        });
    }
  }

  deleteAll(): void {
    this.doctorService.deleteDoctors().subscribe(
      () => {
        if (this.doctorList != undefined) {
          this.doctorList.length = 0;
        }
      },
      (err: any) => { console.error('Failed to delete all doctors', err); }
    );
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: UserDTO[]) => {
        this.users = data.filter(user => user.name && user.surname && user.email);
        this.checkUserVisits();
      },
      (err: any) => {
        console.error('Failed to load users', err);
      }
    );
  }

  checkUserVisits(): void {
    this.users.forEach(user => {
      if (user.id !== undefined) {
        this.visitService.getVisitsByUser(user.id).subscribe(
          visits => {
            this.userVisitsMap.set(user.id!, visits.length > 0);
            console.log(`User ID ${user.id} has visits:`, visits.length > 0); // Debugging log
          },
          err => {
            console.error(`Failed to fetch visits for user ID ${user.id}`, err);
            this.userVisitsMap.set(user.id!, false);
          }
        );
      }
    });
  }

  deleteUser(id: number): void {
    if (id === undefined) {
      alert('Cannot delete user with undefined ID.');
      return;
    }
    if (this.userVisitsMap.get(id)) {
      alert('Cannot delete user with associated visits.');
      return;
    }
    this.authService.deleteUser(id).subscribe(
      () => {
        this.loadUsers(); // Reload the user list after deletion
      },
      (err: any) => {
        console.error('Failed to delete user', err);
      }
    );
  }
}
