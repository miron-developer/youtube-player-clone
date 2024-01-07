import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function FullscreenMode({ videoContainterRef }) {
  const ref = useRef(null);

  const toggleFullScreenMode = useCallback(() => {
    if (document.fullscreenElement == null) {
      videoContainterRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [videoContainterRef]);

  const toggleFullScreenModeInVideo = useCallback(() => {
    if (!videoContainterRef.current) return;

    videoContainterRef.current.classList.toggle(
      "full-screen",
      document.fullscreenElement
    );
  }, [videoContainterRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();

      if (tagName === "input") return;
      if (e.key.toLowerCase() !== "f") return;

      toggleFullScreenMode();
    },
    [toggleFullScreenMode]
  );

  // btn event
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("click", toggleFullScreenMode);

    return () => {
      r.removeEventListener("click", toggleFullScreenMode);
    };
  }, [toggleFullScreenMode]);

  // fullscreen events
  useEffect(() => {
    document.addEventListener("fullscreenchange", toggleFullScreenModeInVideo);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        toggleFullScreenModeInVideo
      );
    };
  }, [toggleFullScreenModeInVideo]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <button ref={ref} className="full-screen-btn">
      <svg className="open" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
        />
      </svg>
      <svg className="close" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
        />
      </svg>
    </button>
  );
}
