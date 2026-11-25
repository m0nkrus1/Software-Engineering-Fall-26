# Appsmith setup (low-code track)

Status: configuration specification. NOT executed on a live Appsmith instance by the author of this file; it must be built and screenshotted by the student. Observed results must come from the real run.

1. Create a free-plan Appsmith app "Smart Campus Room Checker". Do not buy anything.
2. Widgets (names must match the JSObject):
   - StartInput: DatePicker, Date format `YYYY-MM-DDTHH:mm`, Default date `2026-11-26T11:30`, time precision Minute
   - DurationInput: Input, type Text, Default value `60`
   - BlockedSwitch: Switch, label "Room is blocked", default off
   - CheckButton: Button, onClick `{{ResultStore.check()}}` or `storeValue("result", RoomRules.check())`
   - ResultText: Text, Text `{{appsmith.store.result ? (appsmith.store.result.valid ? (appsmith.store.result.available ? "Available" : "Unavailable") : "Invalid input") + " - " + appsmith.store.result.message + " [" + appsmith.store.result.code + "]" : ""}}`
   - BookingsTable: Table, Table data `{{RoomRules.bookings}}`
3. Add JSObject `RoomRules` (file RoomRules.js). Bookings are inline fictional data: no datasource, no credentials, no connectors.
4. Run T1-T8 through the UI. T8: the Table data must be identical after every check (check() does not write).
5. Deploy: Share -> keep the app private or "public" only for the demo; Deploy -> copy URL.
6. Export: app menu -> Export application (JSON) and commit to the repo.
7. Record separately: setup min, implementation min, debugging min, testing min.
