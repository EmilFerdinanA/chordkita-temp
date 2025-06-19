import { useEffect, useRef, useState } from "react";
import Lyric from "./components/Lyric";

const originalSong = {
  title: "Contoh Lagu",
  artist: "Emil & The Chords",
  lyrics: Array(40).fill({
    line: "G        C           Am7            C        D7       G",
    lyric: "Saying I love you is not the words I want to hear from you",
  }),
};

const App = () => {
  const [keyOffset, setKeyOffset] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(false);
  const animationRef = useRef<number | null>(null);

  const handleTranspose = (offset: number) => {
    setKeyOffset((prev) => prev + offset);
  };

  useEffect(() => {
    const scrollSpeed = 1;

    const scrollStep = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight < bodyHeight - 1) {
        window.scrollTo(0, scrollTop + scrollSpeed);
        animationRef.current = requestAnimationFrame(scrollStep);
      } else {
        setIsAutoScroll(false);
      }
    };

    if (isAutoScroll) {
      animationRef.current = requestAnimationFrame(scrollStep);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScroll]);

  return (
    <div className="p-8 font-mono">
      <h2>{originalSong.title}</h2>
      <h4>by {originalSong.artist}</h4>

      <div className="my-5 mx-0">
        <button onClick={() => handleTranspose(-1)} className="mr-2.5">
          -
        </button>
        <button onClick={() => handleTranspose(1)}>+</button>
        <button
          onClick={() => setIsAutoScroll((prev) => !prev)}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          {isAutoScroll ? "Stop Scroll" : "Auto Scroll"}
        </button>
      </div>

      <div>
        <Lyric originalSong={originalSong} keyOffset={keyOffset} />
      </div>
    </div>
  );
};

export default App;
