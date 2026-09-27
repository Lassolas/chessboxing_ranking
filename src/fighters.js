// Known fighters shown in the "Fighters" section and in the opponent picker.
// The section stays hidden while this list is empty.
//
//   name:  display name
//   elo:   chess ELO (800–2400)
//   box:   boxing level 0–5 (0 Novice … 5 Professional), e.g. 2.3
//   weight: optional weight category, any text (e.g. 'Lightweight', '-75 kg').
//           People can filter the list by it to find opponents their size.
//   note:  optional short text, e.g. the source of the evaluation.
//
// Example:
//   { name: 'Jane Doe', elo: 1520, box: 2.3, weight: 'Middleweight', note: 'Official evaluation 2026' },

export const FIGHTERS = [
  { name: 'Dogukan Cinar', elo: 1520, box: 4, note: 'Test' },
  { name: 'Paul Sergent', elo: 1950, box: 3.4, note: 'Test' },
  { name: 'Carl Strugnell', elo: 2200, box: 2.8, note: 'Test' },
];
