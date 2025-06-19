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
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const animationRef = useRef<number | null>(null);

  const handleTranspose = (offset: number) => {
    setKeyOffset((prev) => prev + offset);
  };

  useEffect(() => {
    const step = () => {
      const scrollTop = window.scrollY;
      if (scrollSpeed > 0) {
        window.scrollTo(0, scrollTop + scrollSpeed);
        animationRef.current = requestAnimationFrame(step);
      }
    };

    if (isAutoScroll && scrollSpeed > 0) {
      animationRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAutoScroll, scrollSpeed]);

  return (
    <div className="p-8 font-mono min-h-[300vh] bg-black text-white relative">
      <h2 className="text-xl font-bold">{originalSong.title}</h2>
      <h4 className="text-md mb-4">by {originalSong.artist}</h4>

      {/* Control Bar */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => handleTranspose(-1)}
          className="px-2 py-1 bg-gray-200 text-black rounded"
        >
          -
        </button>
        <button
          onClick={() => handleTranspose(1)}
          className="px-2 py-1 bg-gray-200 text-black rounded"
        >
          +
        </button>
        <button
          onClick={() => setPanelOpen((prev) => !prev)}
          className={`px-3 py-1 rounded transition ${
            panelOpen ? "bg-red-600" : "bg-blue-600"
          } text-white hover:brightness-110`}
        >
          {panelOpen ? "Close Auto Scroll" : "Auto Scroll ⚙️"}
        </button>
      </div>

      {/* Lyrics */}
      <Lyric originalSong={originalSong} keyOffset={keyOffset} />

      {/* Auto Scroll Panel */}
      {panelOpen && (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-[#0f1c2e] text-white px-4 py-5 rounded-l-lg shadow-lg z-50 w-[90px]">
          <div className="text-sm mb-2 text-center text-gray-300">Speed</div>
          {[5, 4, 3, 2, 1].map((s) => (
            <div
              key={s}
              className={`w-5 h-5 mx-auto mb-2 cursor-pointer rounded-sm transition ${
                scrollSpeed === s ? "bg-white" : "bg-gray-500 hover:bg-gray-400"
              }`}
              onClick={() => {
                setScrollSpeed(s);
                setIsAutoScroll(true);
              }}
            />
          ))}
          <div
            className="text-center mt-3 text-red-500 text-sm cursor-pointer hover:underline"
            onClick={() => {
              setIsAutoScroll(false);
              setScrollSpeed(0);
            }}
          >
            Stop
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
