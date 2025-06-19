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
  const [scrollSpeed, setScrollSpeed] = useState(0); // ⬅️ default: no select
  const [panelOpen, setPanelOpen] = useState(true);
  const animationRef = useRef<number | null>(null);

  const handleTranspose = (offset: number) => {
    setKeyOffset((prev) => prev + offset);
  };

  useEffect(() => {
    const step = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.scrollHeight;

      if (scrollTop + windowHeight < bodyHeight - 1 && scrollSpeed > 0) {
        window.scrollTo(0, scrollTop + scrollSpeed);
        animationRef.current = requestAnimationFrame(step);
      } else {
        setIsAutoScroll(false);
        setPanelOpen(false);
        setScrollSpeed(0); // ⬅️ reset ke "no select"
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
    <div className="p-8 font-mono min-h-[300vh]">
      <h2 className="text-xl font-bold">{originalSong.title}</h2>
      <h4 className="text-md mb-4">by {originalSong.artist}</h4>

      <div className="mb-4">
        <button
          onClick={() => handleTranspose(-1)}
          className="mr-2 px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <button
          onClick={() => handleTranspose(1)}
          className="mr-2 px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      <Lyric originalSong={originalSong} keyOffset={keyOffset} />

      {/* === Control Panel Kanan === */}
      {panelOpen && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 flex items-center z-50">
          {/* Tombol vertikal untuk tutup */}
          <div
            className="mr-2 transform -rotate-90 origin-left text-xs cursor-pointer"
            onClick={() => setPanelOpen(false)}
          >
            tutup auto scroll
          </div>

          {/* Panel isi */}
          <div className="flex flex-col items-center">
            <div className="text-sm mb-1">high</div>
            {[5, 4, 3, 2, 1].map((s) => (
              <div
                key={s}
                className={`w-6 h-4 mb-1 cursor-pointer ${
                  scrollSpeed === s ? "bg-white" : "bg-gray-500"
                }`}
                onClick={() => {
                  setScrollSpeed(s);
                  setIsAutoScroll(true);
                }}
              />
            ))}
            <div
              className="text-red-500 text-sm mt-1 cursor-pointer"
              onClick={() => {
                setIsAutoScroll(false);
                setScrollSpeed(0); // ⬅️ reset juga kalau pencet stop
              }}
            >
              stop
            </div>
          </div>
        </div>
      )}

      {/* Tombol buka panel kalau panel tertutup */}
      {!panelOpen && (
        <div
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 text-xs cursor-pointer rotate-90 z-50"
          onClick={() => setPanelOpen(true)}
        >
          auto scroll
        </div>
      )}
    </div>
  );
};

export default App;
