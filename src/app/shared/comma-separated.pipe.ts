import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaSeparated',
  standalone: true
})
export class CommaSeparatedPipe implements PipeTransform {

  transform(value: any[]): string {
    if (!value || !Array.isArray(value)) {
      return '';
    }
    return value.join(', ');
  }
}
