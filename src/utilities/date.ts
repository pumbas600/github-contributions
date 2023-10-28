export function daysBeforeToday(days: number): Date {
    const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    asStartOfDay(date);
    return date;
}

export function asStartOfDay(date: Date): void {
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
}
