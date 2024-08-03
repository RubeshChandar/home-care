import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Requests } from '../../models/requests.model';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.css'
})
export class DateTimePickerComponent {
  times: string[] = [];
  startTimes: string[] = [];
  endTimes: string[] = [];
  warn = false;
  notes = "";
  @Output() dandT: EventEmitter<Requests> = new EventEmitter();

  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;
  selectedDate: string | null = null;

  constructor() {
    this.generateTimeOptions();
    this.startTimes = [...this.times]; // Initially, startTimes includes all times
  }

  generateTimeOptions() {
    const startHour = 0; // 00:00
    const endHour = 24;  // 24:00
    const interval = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += interval) {
        const time = this.formatTime(hour, minutes);
        this.times.push(time);
      }
    }
  }

  formatTime(hour: number, minutes: number): string {
    const formattedHour = hour < 10 ? '0' + hour : hour.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${formattedHour}:${formattedMinutes}`;
  }

  onStartTimeChange() {
    if (this.selectedStartTime) {
      const startIndex = this.times.indexOf(this.selectedStartTime);
      // Set endTimes to be times after the selected start time
      this.endTimes = this.times.slice(startIndex + 1);
      this.selectedEndTime = null; // Reset the end time when start time changes
    } else {
      this.endTimes = [];
    }
  }
  onSubmit() {
    if ((this.selectedDate && this.selectedStartTime && this.selectedEndTime) === null) {
      this.warn = true;
    }

    if ((this.selectedDate && this.selectedStartTime && this.selectedEndTime) !== null) {
      this.warn = false;

      this.dandT.emit({
        date: this.selectedDate!,
        startTime: this.selectedStartTime!,
        endTime: this.selectedEndTime!,
        notes: this.notes
      });
    }
  }
}
