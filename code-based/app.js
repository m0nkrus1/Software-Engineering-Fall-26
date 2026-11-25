(function () {
  var NOW = '2026-11-25T09:00';
  var room = { name: 'Room A-204 (fictional)', blocked: false, bookings: [
    { start: '2026-11-26T10:00', end: '2026-11-26T11:00' },
    { start: '2026-11-26T13:00', end: '2026-11-26T14:30' }
  ] };
  var $ = function (id) { return document.getElementById(id); };

  function renderBookings() {
    var ul = $('bookings');
    ul.textContent = '';
    room.bookings.forEach(function (b) {
      var li = document.createElement('li');
      li.textContent = b.start.replace('T', ' ') + ' to ' + b.end.slice(11);
      ul.appendChild(li);
    });
  }

  function show(r) {
    var box = $('result');
    box.className = r.valid ? (r.available ? 'ok' : 'bad') : 'warn';
    box.textContent = r.valid ? (r.available ? 'Available' : 'Unavailable') : 'Invalid input';
    var s = document.createElement('small');
    s.textContent = r.message + ' [' + r.code + ']';
    box.appendChild(s);
  }

  function run() {
    room.blocked = $('blocked').checked;
    var before = JSON.stringify(room.bookings);
    show(RoomEngine.checkAvailability({ start: $('start').value, duration: $('duration').value }, room, $('now').value));
    if (JSON.stringify(room.bookings) !== before) throw new Error('bookings mutated');
  }

  $('now').value = NOW;
  $('start').value = '2026-11-26T11:30';
  $('duration').value = '60';
  $('room').textContent = room.name;
  renderBookings();
  $('check').addEventListener('click', run);
})();
