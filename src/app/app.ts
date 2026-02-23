import { Component, signal } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { StoryTable } from './story-table/story-table';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StoryTable, MatTableModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('timeline_ui');
}
