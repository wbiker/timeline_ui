import { Component } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-story-table',
  imports: [
    MatTable
  ],
  templateUrl: './story-table.html',
  styleUrl: './story-table.css',
})
export class StoryTable {
  timespan = "Woche 9 23.-27.02.26";
  dataSource = [];
}
