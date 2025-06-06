import { useEffect, useRef, useState } from "react";

// Song data
const song = {
  capo: "D",
  tempo: "4/4",
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
          chord: "G/B        Cmaj7         Gmaj7",
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
      title: "Reff",
      lines: [
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
          chord: "Am7          Em           Gmaj7",
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
      title: "Interlude ",
      lines: [
        { chord: "Am..   Em...  G..   D", lyric: "" },
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

function transposeSingleChord(chord: string, steps: number): string {
  const dotMatch = chord.match(/(\.*)$/);
  const trailingDots = dotMatch ? dotMatch[0] : "";
  const cleanChord = chord.replace(/\.*$/, "");
  const parts = cleanChord.split("/");

  const transposePart = (part: string) => {
    const match = part.match(/^([A-G])([b#]?)(.*)$/);
    if (!match) return part;
    const [, root, accidental, suffix] = match;
    let rootNote = root + accidental;
    if (enharmonicMap[rootNote]) rootNote = enharmonicMap[rootNote];
    const index = CHORDS.indexOf(rootNote);
    if (index === -1) return part;
    const newIndex =
      (((index + steps) % CHORDS.length) + CHORDS.length) % CHORDS.length;
    return CHORDS[newIndex] + suffix;
  };

  if (parts.length === 1) return transposePart(parts[0]) + trailingDots;
  if (parts.length === 2)
    return `${transposePart(parts[0])}/${transposePart(
      parts[1]
    )}${trailingDots}`;
  return chord;
}

function transposeChordPreserveSpace(line: string, steps: number): string {
  return line.replace(/([^\s]+)/g, (chord) =>
    transposeSingleChord(chord, steps)
  );
}

function renderChordWithSpaces(chordLine: string) {
  return chordLine
    .split("")
    .map((char, idx) =>
      char === " " ? (
        <span key={idx}>&nbsp;</span>
      ) : (
        <span key={idx}>{char}</span>
      )
    );
}

function ChordViewer({ song }: any) {
  const [transpose, setTranspose] = useState(0);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: number | undefined;

    if (autoScroll) {
      interval = window.setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += scrollSpeed;
        }
      }, 100); // every 30ms
    }

    return () => clearInterval(interval);
  }, [autoScroll, scrollSpeed]);

  return (
    <div className="p-6 text-white bg-black font-mono min-h-screen">
      <div className="mb-4 flex flex-col gap-3">
        <h1 className="text-xl">420 Mangu Chord Mudah ♪</h1>
        <div>DO Original = {song.capo}</div>
        <div>Tempo: {song.tempo}</div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setTranspose((t) => t - 1)}
              className="bg-gray-700 px-2 rounded hover:bg-gray-600 text-2xl"
            >
              -
            </button>
            <button
              onClick={() => setTranspose((t) => t + 1)}
              className="bg-gray-700 px-2 rounded hover:bg-gray-600 text-2xl"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setAutoScroll((prev) => !prev)}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            {autoScroll ? "Stop" : "Start"}
          </button>

          <div className="flex items-center gap-2">
            <label>Speed:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={scrollSpeed}
              onChange={(e) => setScrollSpeed(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-y-auto max-h-[70vh] pr-4 pt-8">
        {song.sections.map((section: any, i: number) => (
          <div key={i} className="mb-6">
            {section.title && <h2 className="mb-2">{section.title}</h2>}
            <div>
              {section.lines.map((line: any, j: number) => (
                <div key={j} className="mb-4">
                  <pre className="text-yellow-200 overflow-x-auto">
                    {renderChordWithSpaces(
                      transposeChordPreserveSpace(line.chord, transpose)
                    )}
                  </pre>
                  <div>{line.lyric}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <ChordViewer song={song} />;
}
