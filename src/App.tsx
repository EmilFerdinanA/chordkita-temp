import React, { useState } from "react";

// Song data
const song = {
  capo: "",
  sections: [
    {
      title: "Intro ",
      lines: [
        { chord: "G..  Cmaj7..  Bm..", lyric: "" },
        { chord: "Am7   Em   D", lyric: "" },
      ],
    },
    {
      title: "",
      lines: [
        {
          chord: "G        Cmaj7         Gmaj7",
          lyric: "Suatu malam adam bercerita",
        },
        {
          chord: "G        Cmaj7         D",
          lyric: "Hawanya tak lagi di jalur yang sama",
        },
        {
          chord: "Am7      Em           Gmaj7",
          lyric: "Bacaan dan doa yang mulai berbeda",
        },
        {
          chord: "Am7      Em           D",
          lyric: "Ego dan air mata kita bicara",
        },
      ],
    },
    {
      title: "",
      lines: [
        { chord: "reff:", lyric: "" },
        { chord: "G           Dm", lyric: "Gila tak masuk logika" },
        { chord: "Am7", lyric: "Termangu hatiku" },
        {
          chord: "Em         D        G",
          lyric: "Kau menggenggam kumenadahnya",
        },
      ],
    },
    {
      title: "",
      lines: [
        {
          chord: "G        Cmaj7         Gmaj7",
          lyric: "Berdamai dengan apa yang terjadi",
        },
        {
          chord: "G        Cmaj7         D",
          lyric: "Kunci dari semua masalah ini",
        },
        {
          chord: "Am7      Em           Gmaj7",
          lyric: "Jujur tak mudah untuk melangkah pergi",
        },
        {
          chord: "Am7      Em           D",
          lyric: "Ini soal hati bukan yang diyakini",
        },
      ],
    },
    {
      title: "",
      lines: [
        { chord: "G           Dm", lyric: "Gila tak masuk logika" },
        { chord: "Am7", lyric: "Termangu hatiku" },
        {
          chord: "Em         D        G",
          lyric: "Kau menggenggam kumenadahnya",
        },
        { chord: "G           Dm", lyric: "Gila ini tak biasa" },
        { chord: "Am7", lyric: "Tertegun hatiku" },
        { chord: "Em         D", lyric: "Kau menggenggam kumenadahnya" },
      ],
    },
    {
      title: "interlude ",
      lines: [
        { chord: "Am..   Em   G   D", lyric: "" },
        { chord: "Am..   Em   G   D", lyric: "" },
      ],
    },
    {
      title: "",
      lines: [
        { chord: "Am        Em", lyric: "Jangan salahkan paham ku kini" },
        { chord: "G         D", lyric: "Tertuju oooo" },
        { chord: "Am        Em", lyric: "Siapa yang tahu siapa yang mau" },
        { chord: "G         D", lyric: "Kau di sana aku di seberangmu" },
        { chord: "Am        Em", lyric: "Cerita kita sulit dicerna" },
        { chord: "G         D", lyric: "Tak lagi sama cara berdoa" },
        { chord: "Am        Em", lyric: "Cerita kita sulit diterka" },
        { chord: "G         D", lyric: "Tak lagi sama arah kiblatnya" },
      ],
    },
  ],
};

// List of valid chord roots in sharp format
const CHORDS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Enharmonic map for flats and rare cases
const enharmonicMap: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
  "E#": "F",
  "B#": "C",
};

// Transpose a single chord
function transposeSingleChord(chord: string, steps: number): string {
  // Remove trailing dots like "G.."
  let cleanChord = chord.replace(/\.+$/, "");
  const parts = cleanChord.split("/");

  const transposePart = (part: string) => {
    const match = part.match(/^([A-G])([b#]?)(.*)$/);
    if (!match) return part;

    let [_, root, accidental, suffix] = match;
    let rootNote = root + accidental;

    // Normalize to sharps
    if (enharmonicMap[rootNote]) {
      rootNote = enharmonicMap[rootNote];
    }

    const index = CHORDS.indexOf(rootNote);
    if (index === -1) return part;

    const newIndex =
      (((index + steps) % CHORDS.length) + CHORDS.length) % CHORDS.length;
    return CHORDS[newIndex] + suffix;
  };

  if (parts.length === 1) {
    return transposePart(parts[0]);
  } else if (parts.length === 2) {
    return `${transposePart(parts[0])}/${transposePart(parts[1])}`;
  } else {
    return chord;
  }
}

// Transpose an entire line
function transposeChord(line: string, steps: number): string {
  if (!line || !line.trim()) return line;
  return line
    .trim()
    .split(/\s+/)
    .map((chord) => transposeSingleChord(chord, steps))
    .join(" ");
}

// Main chord viewer component
function ChordViewer({ song }: { song: typeof song }) {
  const [transpose, setTranspose] = useState(0);

  return (
    <div className="p-6 text-white bg-black font-mono min-h-screen">
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-xl text-yellow-300">Mangu ♪ {song.capo}</h1>
        <button
          onClick={() => setTranspose((t) => t - 1)}
          className="bg-gray-700 px-2 rounded hover:bg-gray-600"
        >
          - Transpose
        </button>
        <button
          onClick={() => setTranspose((t) => t + 1)}
          className="bg-gray-700 px-2 rounded hover:bg-gray-600"
        >
          + Transpose
        </button>
        <span className="text-sm text-gray-400">({transpose})</span>
      </div>

      {song.sections.map((section, i) => (
        <div key={i} className="mb-6 text-justify">
          {section.title && (
            <h2 className="text-green-300 mb-2">{section.title}</h2>
          )}
          <div>
            {section.lines.map((line, j) => (
              <pre key={j} className="mb-2">
                <div className="text-green-400 whitespace-pre-wrap">
                  {transposeChord(line.chord, transpose)}
                </div>
                <div>{line.lyric}</div>
              </pre>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return <ChordViewer song={song} />;
}
