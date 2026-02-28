import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { StoryService } from '../services/story-service'

@Component({
  selector: 'app-story-table',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatInputModule,
  ],
  templateUrl: './story-table.component.html',
  styleUrl: './story-table.component.css',
  standalone: true,
})
export class StoryTable implements OnInit {
  timespan: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'mo', 'tu', 'we', 'th', 'fr', 'totalRow'];
  editControl: FormControl = new FormControl();
  editingCell: { rowIndex: number; column: string } | null = null;

  constructor(private fb: FormBuilder, private storyService: StoryService) {
    this.timespan = this.calculateTimespan();
    this.dataSource = new MatTableDataSource([
      {}
    ]);
  }

  ngOnInit() {
//     this.dataSource = this.storyService.fetchData();
    const result = this.storyService.fetchData();
  }

  /**
   * Start editing a cell
   */
  startEdit(rowIndex: number, column: string, currentValue: any): void {
    this.editingCell = { rowIndex, column };
    this.editControl.setValue(currentValue);
  }

  /**
   * Save the edited value
   */
  saveEdit(rowIndex: number, column: string): void {
    const data = this.dataSource.data;
    data[rowIndex][column] = this.editControl.value;
    this.dataSource.data = [...data];
    this.editingCell = null;
    this.calculateTableRow(rowIndex);
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingCell = null;
  }

  private calculateTableRow(rowIndex: number) {
    const data = this.dataSource.data;
    const total = Object.entries(data[rowIndex]).reduce<number>((acc, [key, value]) => {
        if (typeof value === 'number' && key !== 'totalRow') {
          return acc += value;
        }
        return acc;
      }, 0)
    data[rowIndex]['totalRow'] = total;
  }

  /**
   * Calculate current week number and date range (Monday to Friday)
   * Format: "Woche 9 23.-27.02.26"
   */
  private calculateTimespan(): string {
    const today = new Date();
    const weekNumber = this.getWeekNumber(today);
    const mondayOfWeek = this.getMondayOfWeek(today);
    const fridayOfWeek = new Date(mondayOfWeek);
    fridayOfWeek.setDate(fridayOfWeek.getDate() + 4);

    const mondayFormatted = this.formatDate(mondayOfWeek);
    const fridayFormatted = this.formatDate(fridayOfWeek);

    return `Woche ${weekNumber} ${mondayFormatted}-${fridayFormatted}`;
  }

  /**
   * Get ISO week number (1-53)
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * Get the Monday of the current week
   */
  private getMondayOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /**
   * Format date as "DD.MM.YY"
   */
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  }
}
