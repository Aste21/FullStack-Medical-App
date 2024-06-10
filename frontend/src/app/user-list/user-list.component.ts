import { Component, OnInit } from '@angular/core';
import {UserDTO} from "../services/user-dto";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: UserDTO[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: UserDTO[]) => {
        this.users = data;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  deleteUser(id: number): void {
    this.authService.deleteUser(id).subscribe(
      () => {
        this.loadUsers();  // Reload the user list after deletion
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
}
