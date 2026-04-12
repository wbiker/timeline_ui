import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private http: HttpClient) {}

  async fetchData(weekNumber: number) {
    return await lastValueFrom(
      this.http.get('http://localhost:9090/stories/' + weekNumber)
    );
  }

  async storeData(data: unknown) {
    console.log("store data: " + JSON.stringify(data));
    const response = await lastValueFrom(
      this.http.post('http://localhost:9090/stories', data, {
        headers: { 'Content-Type': 'application/json' }
      })
    );
    console.log("response: " + response);
    return response;
  }
}
