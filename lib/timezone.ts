// Local timezone utilities - works with user's local timezone
export function getLocalDate(): Date {
  return new Date();
}

export function getLocalDateString(): string {
  const now = new Date();
  return now.getFullYear() + '-' + 
         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
         String(now.getDate()).padStart(2, '0');
}

export function formatDateForLocal(date: Date): string {
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
}

export function isToday(dateStr: string): boolean {
  return dateStr === getLocalDateString();
}

export function isPastDate(dateStr: string): boolean {
  return dateStr < getLocalDateString();
}

// Create a datetime from date string and time string in user's local timezone
export function createLocalDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

// Check if a session time is currently active in user's local timezone
export function isSessionActive(dateStr: string, startTime: string, endTime: string): boolean {
  const now = new Date();
  const sessionStart = createLocalDateTime(dateStr, startTime);
  const sessionEnd = createLocalDateTime(dateStr, endTime);
  return now >= sessionStart && now <= sessionEnd;
}

// Check if a session has ended in user's local timezone
export function hasSessionEnded(dateStr: string, endTime: string): boolean {
  const now = new Date();
  const sessionEnd = createLocalDateTime(dateStr, endTime);
  return now > sessionEnd;
}

// Format time for display in user's local timezone
export function formatTimeForDisplay(timeStr: string): string {
  return timeStr; // Already in HH:MM format
}

// Format date for display in user's local timezone
export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString();
}
