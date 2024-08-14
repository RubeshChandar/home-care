import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  // transform(value: string): string {
  //   if (!value) return '';

  //   const [year, month, day] = value.split('-').map(Number);

  //   const monthNames = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ];

  //   // Format the date as "7 August 2024"
  //   // return day + " " + monthNames[month - 1] + "\n" + year;
  //   return `${day} ${monthNames[month - 1]} ${year}`;
  // }

  transform(value: string): string {
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year.slice(-2)}`;
  }

}
