import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {Doctor} from "./doctor.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private doctorsUrl = 'http://localhost:8080/doctors';

  constructor(private http: HttpClient) { }

  /** GET doctors from the server */
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorsUrl);
  }

  /** GET doctor by id. Will 404 if id not found */
  getDoctor(id: number): Observable<Doctor> {
    const url = `${this.doctorsUrl}/${id}`;
    return this.http.get<Doctor>(url).pipe(
      tap(_ => this.log(`fetched doctor id=${id}`)),
      catchError(this.handleError<Doctor>(`getDoctor id=${id}`))
    );
  }

  /** POST: add a new doctor to the server */
  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.doctorsUrl, doctor, httpOptions).pipe(
      tap((doctorAdded: Doctor) => this.log(`added doctor id=${doctorAdded.id}`)),
      catchError(this.handleError<Doctor>('addDoctor'))
    );
  }

  /** DELETE: delete the doctor from the server */
  deleteDoctor(doctor: Doctor | number): Observable<Doctor> {
    const id = typeof doctor === 'number' ? doctor : doctor.id;
    const url = `${this.doctorsUrl}/${id}`;
    return this.http.delete<Doctor>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted doctor id=${id}`)),
      catchError(this.handleError<Doctor>('deleteDoctor'))
    );
  }

  /** DELETE: delete all the doctors from the server */
  deleteDoctors(): Observable<Doctor> {
    return this.http.delete<Doctor>(this.doctorsUrl, httpOptions).pipe(
      tap(_ => this.log(`deleted doctors`)),
      catchError(this.handleError<Doctor>('deleteDoctors'))
    );
  }

  /** PUT: update the doctor on the server */
  updateDoctor(doctor: Doctor, id:number): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.doctorsUrl}/${id}`, doctor, httpOptions).pipe(
      // tap(_ => this.log(`updated doctor id=${doctor.id}`)), // same as the line below
      tap((doctorUpdated: Doctor) => this.log(`updated doctor id=${doctorUpdated.id}`)),
      catchError(this.handleError<any>('updateDoctor'))
    );
  }

  /** PUT: update all the doctors on the server */
  updateDoctors(doctors: Doctor[]): Observable<Doctor[]> {
    return this.http.put<Doctor[]>(this.doctorsUrl, doctors, httpOptions).pipe(
      tap(_ => this.log(`updated doctor id=${doctors}`)),
      catchError(this.handleError<any>('updateDoctor'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  /** Log a DoctorService message with the MessageService */
  private log(message: string) {
    console.log('DoctorService: ' + message);
  }

  /** GET number of doctors from the server */
  getDoctorsCounter(): Observable<number> {
    const url = `${this.doctorsUrl}/counter`;
    return this.http.get<number>(url);
  }

  // for automatic update of number of doctors in parent component
  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  getCartItems() {
    return this.totalItems.asObservable();
  }

}
