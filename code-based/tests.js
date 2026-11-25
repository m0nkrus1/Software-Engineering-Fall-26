var E = require('./engine.js');
var NOW = '2026-11-25T09:00';
var room = { name: 'Room A-204', blocked: false, bookings: [
  { start: '2026-11-26T10:00', end: '2026-11-26T11:00' },
  { start: '2026-11-26T13:00', end: '2026-11-26T14:30' }
] };
var blockedRoom = { name: room.name, blocked: true, bookings: room.bookings };
var before = JSON.stringify(room);
var cases = [
  ['T1', 'valid free interval', { start: '2026-11-26T11:30', duration: 60 }, room, true, 'OK'],
  ['T2', 'overlap with existing booking', { start: '2026-11-26T10:30', duration: 60 }, room, false, 'OVERLAP'],
  ['T3', 'blocked room', { start: '2026-11-26T11:30', duration: 60 }, blockedRoom, false, 'ROOM_BLOCKED'],
  ['T4', 'duration = 0', { start: '2026-11-26T11:30', duration: 0 }, room, false, 'DURATION_TOO_SHORT'],
  ['T5', 'duration = 121', { start: '2026-11-26T11:30', duration: 121 }, room, false, 'DURATION_TOO_LONG'],
  ['T6', 'past start time', { start: '2026-11-25T08:00', duration: 60 }, room, false, 'PAST_START'],
  ['T7', 'adjacent interval', { start: '2026-11-26T11:00', duration: 60 }, room, true, 'OK']
];
var pass = 0, total = 0;
cases.forEach(function (c) {
  var r = E.checkAvailability(c[2], c[3], NOW);
  var ok = r.available === c[4] && r.code === c[5];
  total++; if (ok) pass++;
  console.log(c[0] + ' | ' + c[1] + ' | expected ' + (c[4] ? 'Available' : 'Unavailable') + '/' + c[5] + ' | observed ' + (r.available ? 'Available' : 'Unavailable') + '/' + r.code + ' | "' + r.message + '" | ' + (ok ? 'PASS' : 'FAIL'));
});
var ok8 = JSON.stringify(room) === before;
total++; if (ok8) pass++;
console.log('T8 | booking data unchanged | expected unchanged | observed ' + (ok8 ? 'unchanged' : 'CHANGED') + ' | ' + (ok8 ? 'PASS' : 'FAIL'));
var extra = [
  [{ start: '2026-11-26T09:00', duration: 60 }, 'OK'],
  [{ start: '2026-11-26T09:00', duration: 61 }, 'OVERLAP'],
  [{ start: '', duration: 60 }, 'INVALID_START'],
  [{ start: '2026-11-26T11:30', duration: '' }, 'INVALID_DURATION'],
  [{ start: '2026-11-26T11:30', duration: 1.5 }, 'INVALID_DURATION'],
  [{ start: '2026-11-26T11:00', duration: 120 }, 'OK'],
  [{ start: '<img src=x onerror=alert(1)>', duration: 60 }, 'INVALID_START']
];
extra.forEach(function (x, i) {
  var r = E.checkAvailability(x[0], room, NOW);
  console.log('X' + (i + 1) + ' | extra | expected ' + x[1] + ' | observed ' + r.code + ' | ' + (r.code === x[1] ? 'PASS' : 'FAIL'));
});
console.log('SUMMARY ' + pass + '/' + total + ' acceptance tests passed');
process.exit(pass === total ? 0 : 1);
