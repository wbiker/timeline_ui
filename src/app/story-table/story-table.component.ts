import { Component, OnInit, AfterViewChecked, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatTable, MatTableDataSource, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
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
export class StoryTable implements OnInit, AfterViewChecked {
  timespan: string;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['name', 'mo', 'tu', 'we', 'th', 'fr', 'totalRow'];
  editControl: FormControl = new FormControl();
  editingCell: { rowIndex: number; column: string } | null = null;
  todayColumn: string;
  private shouldFocus = false;

  @ViewChildren('editInput') editInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder, private storyService: StoryService) {
    this.timespan = this.calculateTimespan();
    this.todayColumn = this.getTodayColumn();
    this.dataSource = new MatTableDataSource([
      {
        name: '',
        mo: 0,
        tu: 0,
        we: 0,
        th: 0,
        fr: 0,
        totalRow: 0
      }
    ]);
  }

  ngOnInit() {
//     this.dataSource = this.storyService.fetchData();
    const result = this.storyService.fetchData();
  }

  ngAfterViewChecked() {
    if (this.shouldFocus && this.editInputs.length > 0) {
      this.editInputs.first.nativeElement.focus();
      this.editInputs.first.nativeElement.select();
      this.shouldFocus = false;
    }
  }

  /**
   * Start editing a cell
   */
  startEdit(rowIndex: number, column: string, currentValue: any): void {
    this.editingCell = { rowIndex, column };
    this.editControl.setValue(currentValue);
    this.shouldFocus = true;
  }

  /**
   * Save the edited value
   */
  saveEdit(rowIndex: number, column: string): void {
    const data = this.dataSource.data;
    let newValue = this.editControl.value;

    // For numeric columns, convert empty/null values to 0
    if (column !== 'name' && (newValue === null || newValue === undefined || newValue === '')) {
      newValue = 0;
    }

    data[rowIndex][column] = newValue;
    this.dataSource.data = [...data];
    this.editingCell = null;
    this.calculateTableRow(rowIndex);

    // If user entered a name in the last row and it's not empty, add a new empty row
    if (column === 'name' && newValue && newValue.trim() !== '') {
      const isLastRow = rowIndex === data.length - 1;
      const isLastRowEmpty = this.isRowEmpty(data[data.length - 1]);

      if (isLastRow || !isLastRowEmpty) {
        this.addEmptyRow();
      }
    }
  }

  /**
   * Check if a row is empty (has no name or all values are empty/zero)
   */
  private isRowEmpty(row: any): boolean {
    if (!row.name || row.name.trim() === '') {
      return true;
    }
    return false;
  }

  /**
   * Add a new empty row to the table
   */
  private addEmptyRow(): void {
    const data = this.dataSource.data;
    data.push({
      name: '',
      mo: 0,
      tu: 0,
      we: 0,
      th: 0,
      fr: 0,
      totalRow: 0
    });
    this.dataSource.data = [...data];
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingCell = null;
  }

  /**
   * Display value - show empty string for zero values to improve UX
   */
  displayValue(value: any): string {
    if (value === 0 || value === null || value === undefined) {
      return '';
    }
    return value.toString();
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

  /**
   * Get today's day of week column key (mo, tu, we, th, fr)
   * Returns empty string if today is Saturday or Sunday
   */
  private getTodayColumn(): string {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayMap: { [key: number]: string } = {
      1: 'mo',
      2: 'tu',
      3: 'we',
      4: 'th',
      5: 'fr'
    };
    return dayMap[dayOfWeek] || '';
  }
}
