import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  constructor(private http: HttpClient) {}

  async fetchData() {
    return await this.http.get('http://localhost:9090/stories')
      .subscribe((response) => {
            console.log("got response: " + response);
            return response;
          }
        );
  }

  async storeData(data: unknown) {
    console.log("store data");
    const response = await this.http.post('http://localhost:9090/stories', JSON.stringify(data))
      .subscribe({
        next: (response) => {
            console.log(response);
            return response;
          }
        ,
        error: (error) => {
            console.error('Error: ', error);
          }
        })
    console.log("response: " + response);
  }
}
