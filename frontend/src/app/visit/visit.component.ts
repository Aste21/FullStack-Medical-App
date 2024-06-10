import { Component, OnInit } from '@angular/core';
import { VisitService } from './visit.service';
import { Visit } from './visit.model';
import { UserDTO } from '../services/user-dto';
import { AuthService } from '../auth/auth.service';
import { Doctor } from '../doctors/doctor.model';
import { DoctorService } from '../doctors/doctor.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visitList: Visit[] = [];
  doctorList: Doctor[] = [];
  users: UserDTO[] = [];
  visit: Visit = new Visit();
  prescriptionUpdate: { [key: number]: string } = {}; // to track prescription updates for each visit

  constructor(
    private visitService: VisitService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDoctorsAndUsers();
  }

  loadDoctorsAndUsers(): void {
    this.doctorService.getDoctors().subscribe(
      (doctors: Doctor[]) => {
        this.doctorList = doctors;
        console.log('Loaded doctors:', this.doctorList);
        this.authService.getAllUsers().subscribe(
          (users: UserDTO[]) => {
            this.users = users.filter(user => user.name && user.surname && user.email);
            console.log('Loaded users:', this.users);
            this.loadVisits();
          },
          (err: any) => {
            console.error('Failed to load users', err);
          }
        );
      },
      (err: any) => {
        console.error('Failed to load doctors', err);
      }
    );
  }

  loadVisits() {
    this.visitService.getVisits().subscribe(visits => {
      console.log('Loaded visits:', visits);
      this.visitList = visits;
      console.log('Final visit list:', this.visitList);
    }, (err) => {
      console.error('Failed to load visits', err);
    });
  }

  isFormValid(): boolean {
    return this.visit.date.trim() !== '' && this.visit.doctorId > 0 && this.visit.userId > 0;
  }

  add(visitDate: string, doctorId: string, userId: string) {
    const newVisit = new Visit();
    newVisit.date = visitDate;
    newVisit.doctorId = +doctorId;
    newVisit.userId = +userId;

    const doctor = this.doctorList.find(doc => doc.id === newVisit.doctorId);
    const user = this.users.find(u => u.id === newVisit.userId);
    // @ts-ignore
    newVisit.doctor = doctor ? doctor : new Doctor();
    // @ts-ignore
    newVisit.user = user ? user : new UserDTO();

    console.log('New visit to add:', newVisit);

    this.visitService.addVisit(newVisit).subscribe({
      next: (response) => {
        console.log('Add visit response:', response);
        this.loadVisits();
      },
      error: (err) => {
        console.error('Error adding visit:', err);
      }
    });
  }

  delete(visit: Visit): void {
    this.visitList = this.visitList.filter(c => c !== visit);
    this.visitService.deleteVisit(visit.id!).subscribe(() => {
      console.log('Visit deleted');
      this.loadVisits();
    }, (err) => {
      console.error('Failed to delete visit', err);
    });
  }

  update(date: string, doctorId: string, userId: string, chosenToUpdateVisit: Visit): void {
    let id = chosenToUpdateVisit.id;
    date = date ? date.trim() : '';

    const doctorIdNum = Number(doctorId);
    const userIdNum = Number(userId);

    if (id !== undefined) {
      const updatedVisit = {
        date,
        doctorId: doctorIdNum,
        userId: userIdNum,
        prescription: this.prescriptionUpdate[id] || chosenToUpdateVisit.prescription // update prescription if changed
      };

      this.visitService.partialUpdateVisit(id, updatedVisit)
        .subscribe({
          next: (response: Visit) => { // Handle the updated Visit object
            if (response) {
              console.log('Update visit response:', response);
              let index = this.visitList.indexOf(chosenToUpdateVisit);
              const doctor = this.doctorList.find(doc => doc.id === response.doctorId) || chosenToUpdateVisit.doctor;
              const user = this.users.find(u => u.id === response.userId) || chosenToUpdateVisit.user;
              response.doctor = doctor;
              response.user = user;
              this.visitList[index] = response;
              console.log('Visit updated:', response);
            } else {
              console.error('Update response is null');
            }
          },
          error: (err) => {
            console.error('Error updating visit', err);
          }
        });
    }
  }

  onPrescriptionChange(visitId: number, value: string) {
    this.prescriptionUpdate[visitId] = value;
  }
}
