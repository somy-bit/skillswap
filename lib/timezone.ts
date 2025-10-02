// Vancouver timezone utilities
const VANCOUVER_TZ = 'America/Vancouver';

export function getVancouverDate(): Date {
  return new Date(new Date().toLocaleString("en-US", {timeZone: VANCOUVER_TZ}));
}

export function getVancouverDateString(): string {
  return getVancouverDate().toISOString().split('T')[0];
}

export function formatDateForVancouver(date: Date): string {
  return date.toLocaleDateString('en-CA', {timeZone: VANCOUVER_TZ});
}

export function isToday(dateStr: string): boolean {
  return dateStr === getVancouverDateString();
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getVancouverDateString();
}
