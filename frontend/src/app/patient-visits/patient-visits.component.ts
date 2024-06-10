import { Component, OnInit } from '@angular/core';
import { VisitService } from '../visit/visit.service';
import { Visit } from '../visit/visit.model';
import { TokenStorageService } from '../auth/token-storage.service';
import { UserDTO } from '../services/user-dto';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-patient-visits',
  templateUrl: './patient-visits.component.html',
  styleUrls: ['./patient-visits.component.css']
})
export class PatientVisitsComponent implements OnInit {
  visitList: Visit[] = [];
  user: UserDTO | undefined;

  constructor(
    private visitService: VisitService,
    private tokenStorage: TokenStorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const username = this.tokenStorage.getUsername();
    console.log('Logged in username:', username); // Added logging
    if (username && username !== '{}') {
      this.authService.getAllUsers().subscribe(users => {
        console.log('Users fetched:', users); // Added logging
        this.user = users.find(u => u.username === username);
        if (this.user && this.user.id) {
          console.log('Found user:', this.user); // Added logging
          this.loadVisits(this.user.id);
        } else {
          console.error('User not found or user ID is undefined');
        }
      }, error => {
        console.error('Failed to fetch users', error);
      });
    } else {
      console.error('User is not logged in or username is undefined');
    }
  }

  loadVisits(userId: number): void {
    this.visitService.getVisitsByUser(userId).subscribe(visits => {
      this.visitList = visits;
    }, error => {
      console.error('Failed to load visits', error);
    });
  }
}
