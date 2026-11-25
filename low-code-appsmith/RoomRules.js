export default {
  MAX_DURATION: 120,
  NOW: "2026-11-25T09:00",
  bookings: [
    { start: "2026-11-26T10:00", end: "2026-11-26T11:00" },
    { start: "2026-11-26T13:00", end: "2026-11-26T14:30" }
  ],
  check() {
    const start = moment(StartInput.selectedDate);
    const now = moment(this.NOW);
    const raw = String(DurationInput.text).trim();
    if (!StartInput.selectedDate || !start.isValid()) return { valid: false, available: false, code: "INVALID_START", message: "Enter a valid start date and time." };
    if (!start.isAfter(now)) return { valid: false, available: false, code: "PAST_START", message: "Start time must be in the future." };
    if (!/^-?\d+$/.test(raw)) return { valid: false, available: false, code: "INVALID_DURATION", message: "Duration must be a whole number of minutes." };
    const d = Number(raw);
    if (d <= 0) return { valid: false, available: false, code: "DURATION_TOO_SHORT", message: "Duration must be greater than 0 minutes." };
    if (d > this.MAX_DURATION) return { valid: false, available: false, code: "DURATION_TOO_LONG", message: "Duration must be at most 120 minutes." };
    if (BlockedSwitch.isSwitchedOn) return { valid: true, available: false, code: "ROOM_BLOCKED", message: "Unavailable: the room is blocked." };
    const end = start.clone().add(d, "minutes");
    const hit = this.bookings.find(b => start.isBefore(moment(b.end)) && end.isAfter(moment(b.start)));
    if (hit) return { valid: true, available: false, code: "OVERLAP", message: "Unavailable: overlaps booking " + hit.start.slice(11) + "-" + hit.end.slice(11) + "." };
    return { valid: true, available: true, code: "OK", message: "Available." };
  }
}
