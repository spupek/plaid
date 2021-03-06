import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Calendar} from '../../../../helpers/calendar';

/**
 * Dumb component, responsible for presenting current date on a dropdown calendar, currently selected date and
 * delegating change in date selection.
 */
@Component({
  selector: 'plaid-date-picker-cloud',
  templateUrl: './date-picker-cloud.component.html',
  styleUrls: ['./date-picker-cloud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerCloudComponent {
  _month: Date;
  today: Date;
  days: Date[][];
  _open = false;

  @Input()
  selectedDate: Date;

  @Output()
  selectedDateChange = new EventEmitter<Date>();

  /**
   * Open or close the calendar. Opening it will set the month to one which the selected date belongs to.
   */
  @Input()
  set open(open: boolean) {
    this._open = open;
    if (open) {
      const month = new Date(this.selectedDate);
      month.setDate(1);
      this.month = month;
      const curTime: Date = new Date();
      this.today = new Date(curTime.getFullYear(), curTime.getMonth(), curTime.getDate());
      addEventListener('keydown', this.onKeydown);
    } else {
      removeEventListener('keydown', this.onKeydown);
    }
  }
  get open(): boolean {
    return this._open;
  }

  @Input()
  flipped = false;

  @Input()
  selectableDaysStart: number;

  @Input()
  selectableDaysEnd: number;

  @Output()
  openChange = new EventEmitter<boolean>();

  /**
   * Whether keyboard navigation should be disabled due to modal or another cloud being open.
   */
  @Input()
  keysDisabled: boolean;

  readonly months: string[] = Calendar.monthsShort;

  readonly weekdays: string[] = Calendar.weekdaysShort;

  set month(month: Date) {
    this._month = month;
    this.days = Calendar.getDaysOfMonth(month);
  }
  get month(): Date {
    return this._month;
  }

  /**
   * When the cloud is open, changes the selected date after user presses an arrow key on their keyboard.
   */
  onKeydown: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {
    if (!this.keysDisabled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const newDate = new Date(this.selectedDate);
      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + (event.key === 'ArrowUp' ? -7 : 7));
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          do {
            newDate.setDate(newDate.getDate() + (event.key === 'ArrowLeft' ? -1 : 1));
          } while (newDate.getDay() < this.selectableDaysStart || newDate.getDay() > this.selectableDaysEnd);
          break;
      }
      this.selectDate(newDate, false);
      const month = new Date(newDate);
      month.setDate(1);
      this.month = month;
    }
  }

  decrementMonth(): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
  }

  incrementMonth(): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
  }

  selectDate(date: Date, close: boolean = true): void {
    if (this.isDateSelectable(date)) {
      this.selectedDate = date;
      this.selectedDateChange.emit(date);
      if (close) {
        this.open = false;
        this.openChange.emit(false);
      }
    }
  }

  isDateSelectable(date: Date): boolean {
    return date.getDay() >= this.selectableDaysStart && date.getDay() <= this.selectableDaysEnd;
  }
}
