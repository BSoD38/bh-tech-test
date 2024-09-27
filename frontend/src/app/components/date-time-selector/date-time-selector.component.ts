import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-time-selector',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './date-time-selector.component.html',
  styleUrl: './date-time-selector.component.scss',
})
export class DateTimeSelectorComponent implements OnInit {
  @Input() public initDate: Date | undefined;
  @Input() public datepickerLabel = '';
  @Input() public timepickerLabel = '';

  @Output() public dateChange = new EventEmitter<Date>();

  date: Date | undefined;
  displayDate: Date | undefined;
  timeControl = new FormControl(
    '',
    Validators.pattern(/[0-2][0-9]:[0-5][0-9]/),
  );

  private removeTimeZone(date: Date): Date {
    // Removes jank caused by Dates being timezone linked
    // And Angular not handling this very well
    const tzOffset = date.getTimezoneOffset();
    if (tzOffset < 0) {
      date.setHours(12, 0, 0);
    }
    return date;
  }

  ngOnInit() {
    this.timeControl.valueChanges.subscribe((value) => {
      if (!this.timeControl.valid) {
        return;
      }
      this.updateTime(value ?? '');
    });
    if (this.initDate) {
      this.date = this.initDate;
      this.displayDate = this.initDate;
      this.timeControl.setValue(
        `${this.date.getHours().toString().padStart(2, '0')}:${this.date.getMinutes().toString().padStart(2, '0')}`,
      );
    }
  }

  updateTime(value: string) {
    if (!value) {
      return;
    }
    const [hours, minutes] = value.split(':');
    this.date?.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    this.dateChange.emit(this.date);
  }

  updateDate(event: MatDatepickerInputEvent<Date>) {
    if (!event.value) {
      return;
    }
    this.displayDate = this.removeTimeZone(event.value);
    if (this.timeControl.valid) {
      this.updateTime(this.timeControl.value ?? '');
      return;
    } else {
      this.date?.setHours(0, 0, 0, 0);
      this.dateChange.emit(this.date);
    }
  }
}
