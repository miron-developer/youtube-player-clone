import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function VideoComponent({ videoRef, videoContainterRef }) {
  const ref = useRef(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    return videoRef.current[videoRef.current.paused ? "play" : "pause"]();
  }, [videoRef]);

  const play = useCallback(() => {
    videoContainterRef.current?.classList.remove("paused");
  }, [videoContainterRef]);

  const pause = useCallback(() => {
    videoContainterRef.current?.classList.add("paused");
  }, [videoContainterRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === "input") return;

      const k = e.key.toLowerCase();
      if (k !== "k" && k !== " ") return;

      e.preventDefault();
      togglePlay();
    },
    [togglePlay]
  );

  // btn events
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("click", togglePlay);

    return () => {
      r.removeEventListener("click", togglePlay);
    };
  }, [togglePlay]);

  // video events
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    video.addEventListener("play", play);
    video.addEventListener("pause", pause);
    video.addEventListener("click", togglePlay);

    return () => {
      video.removeEventListener("play", play);
      video.removeEventListener("pause", pause);
      video.removeEventListener("click", togglePlay);
    };
  }, [videoRef, play, pause, togglePlay]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <button ref={ref} className="play-pause-btn">
      <svg className="play-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
      </svg>
      <svg className="pause-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
      </svg>
    </button>
  );
}
