import { useState } from "react";
import Lyric from "./components/Lyric";

const originalSong = {
  title: "Contoh Lagu",
  artist: "Emil & The Chords",
  lyrics: [
    {
      line: "G        C           Am7            C        D7       G",
      lyric: "Saying I love you is not the words I want to hear from you",
    },
    {
      line: "Em        Am7         D7        G       C       G/B    Am",
      lyric: "It’s not that I want you not to say but if you only knew",
    },
  ],
};

const App = () => {
  const [keyOffset, setKeyOffset] = useState(0);

  const handleTranspose = (offset: any) => {
    setKeyOffset((prev) => prev + offset);
  };

  return (
    <div className="p-8 font-mono">
      <h2>{originalSong.title}</h2>
      <h4>by {originalSong.artist}</h4>

      <div className="my-5 mx-0">
        <button onClick={() => handleTranspose(-1)} className="mr-2.5">
          -
        </button>
        <button onClick={() => handleTranspose(1)}>+</button>
      </div>

      <div>
        <Lyric originalSong={originalSong} keyOffset={keyOffset} />
      </div>
    </div>
  );
};

export default App;
