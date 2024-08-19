/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import { firestore } from "./index";

export function timeStringToNumber(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString);
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return daysOfWeek[date.getDay()];
}

export async function getAvailability(date: string) {
  const carers = await firestore.collection("carer").get();
  const day = getDayName(date);

  carers.forEach((carer) => {
    const data = carer.data();
    const schedule = data.schedule[day];
    const id = carer.id;
    if (schedule && schedule.length > 0) {
      firestore.collection(`requests/${date}/schedule`).doc(id)
        .set({
          startTime: schedule[0],
          endTime: schedule[1],
        });
    }
  });
  console.info(`Schedule for ${date} (${day}) has been created`);
}

export function isTimeOutsideRange(a: number, b: number, s: number, e: number): boolean {
  // Normalize the time range
  const [start, end] = s <= e ? [s, e] : [e, s];
  const [timeA, timeB] = a <= b ? [a, b] : [b, a];

  // Check if [a, b] falls completely outside [s, e]
  return timeB < start || timeA > end;
}
