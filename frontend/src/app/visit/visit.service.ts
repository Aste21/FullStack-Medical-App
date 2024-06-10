import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import { Visit } from './visit.model';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = 'http://localhost:8080/visits';

  constructor(private http: HttpClient) {}

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(this.apiUrl);
  }

  addVisit(visit: Visit): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, visit, { headers, responseType: 'text' });
  }

  deleteVisit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateVisit(id: number, visit: Visit): Observable<Visit> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Visit>(`${this.apiUrl}/${id}`, visit, { headers });
  }

  partialUpdateVisit(id: number, updates: Partial<Visit>): Observable<Visit> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Visit>(`${this.apiUrl}/${id}`, updates, { headers });
  }

  getVisitsByDoctor(doctorId: number): Observable<Visit[]> {
    const url = `${this.apiUrl}?doctorId=${doctorId}`;
    console.log('Fetching visits for doctor ID:', doctorId, 'URL:', url);
    // @ts-ignore
    return this.http.get<Visit[]>(url).pipe(
      tap(visits => console.log(`Raw visits for doctor ID ${doctorId}:`, visits)),
      map(visits => {
        const filteredVisits = visits.filter(visit => visit.doctor && visit.doctor.id === doctorId);
        console.log(`Filtered visits for doctor ID ${doctorId}:`, filteredVisits);
        return filteredVisits;
      }),
      catchError(error => {
        console.error(`Failed to fetch visits for doctor ID ${doctorId}`, error);
        return of([]);
      })
    );
  }

  getVisitsByUser(userId: number): Observable<Visit[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    console.log('Fetching visits for user ID:', userId, 'URL:', url);
    return this.http.get<Visit[]>(url).pipe(
      tap(visits => console.log(`Raw visits for user ID ${userId}:`, visits)),
      map(visits => {
        const filteredVisits = visits.filter(visit => visit.user && visit.user.id === userId);
        console.log(`Filtered visits for user ID ${userId}:`, filteredVisits);
        return filteredVisits;
      }),
      catchError(error => {
        console.error(`Failed to fetch visits for user ID ${userId}`, error);
        return of([]);
      })
    );
  }
}
