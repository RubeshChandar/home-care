import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string | number): string {
    // Convert string input to number
    let numericValue: number;

    if (typeof value === 'string') {
      numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        return ''; // Return empty string if conversion fails
      }
    } else {
      numericValue = value;
    }

    // Handle case when value is null or not a valid number
    if (numericValue == null || isNaN(numericValue)) {
      return '';
    }

    const hours = Math.floor(numericValue);
    const minutes = Math.round((numericValue - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight and 12 to 12 for noon

    // Format the minutes to always have two digits
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${adjustedHours}:${formattedMinutes} ${period}`;
  }
}
