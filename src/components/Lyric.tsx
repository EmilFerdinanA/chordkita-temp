import { transpose } from "chord-transposer";

interface IProps {
  originalSong: any;
  keyOffset: any;
}

const Lyric: React.FC<IProps> = ({ keyOffset, originalSong }) => {
  const semitoneOffset = ((keyOffset % 12) + 12) % 12;

  return originalSong.lyrics.map((section: any, index: number) => {
    const chord = transpose(section.line)
      .up(semitoneOffset)
      .toString()
      .replace(/([A-G])b/g, (_, note) => {
        const map = {
          A: "G#",
          B: "A#",
          D: "C#",
          E: "D#",
          G: "F#",
          C: "B", // Cb -> B
          F: "E", // Fb -> E
        };
        return map[note] || note + "#";
      });

    return (
      <div key={index} style={{ marginBottom: 16 }}>
        <pre className="m-0 whitespace-pre-wrap font-bold">{chord}</pre>
        <pre className="m-0 whitespace-pre-wrap">{section.lyric}</pre>
      </div>
    );
  });
};

export default Lyric;
