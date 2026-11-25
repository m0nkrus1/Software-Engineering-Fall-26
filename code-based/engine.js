(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RoomEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var MAX_DURATION = 120;

  function parseLocal(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(s || ''));
    if (!m) return NaN;
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime();
  }

  function validate(input, now) {
    var start = parseLocal(input.start);
    if (isNaN(start)) return { ok: false, code: 'INVALID_START', message: 'Enter a valid start date and time.' };
    if (start <= parseLocal(now)) return { ok: false, code: 'PAST_START', message: 'Start time must be in the future.' };
    var d = input.duration;
    if (d === '' || d === null || d === undefined || typeof d === 'boolean' || isNaN(Number(d)) || !isFinite(Number(d)) || Math.floor(Number(d)) !== Number(d))
      return { ok: false, code: 'INVALID_DURATION', message: 'Duration must be a whole number of minutes.' };
    d = Number(d);
    if (d <= 0) return { ok: false, code: 'DURATION_TOO_SHORT', message: 'Duration must be greater than 0 minutes.' };
    if (d > MAX_DURATION) return { ok: false, code: 'DURATION_TOO_LONG', message: 'Duration must be at most ' + MAX_DURATION + ' minutes.' };
    return { ok: true, start: start, end: start + d * 60000 };
  }

  function findOverlap(start, end, bookings) {
    for (var i = 0; i < bookings.length; i++) {
      var bs = parseLocal(bookings[i].start), be = parseLocal(bookings[i].end);
      if (start < be && end > bs) return bookings[i];
    }
    return null;
  }

  function checkAvailability(input, room, now) {
    var v = validate(input, now);
    if (!v.ok) return { valid: false, available: false, code: v.code, message: v.message };
    if (room.blocked) return { valid: true, available: false, code: 'ROOM_BLOCKED', message: 'Unavailable: the room is blocked.' };
    var hit = findOverlap(v.start, v.end, room.bookings);
    if (hit) return { valid: true, available: false, code: 'OVERLAP', message: 'Unavailable: overlaps booking ' + hit.start.slice(11) + '-' + hit.end.slice(11) + '.' };
    return { valid: true, available: true, code: 'OK', message: 'Available.' };
  }

  return { MAX_DURATION: MAX_DURATION, parseLocal: parseLocal, validate: validate, findOverlap: findOverlap, checkAvailability: checkAvailability };
});
