import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function Volume({ videoRef, videoContainterRef }) {
  const muteRef = useRef(null);
  const volumeRef = useRef(null);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  }, [videoRef]);

  const volumeChangeValue = useCallback(
    (value) => {
      if (!videoRef.current) return;
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
    },
    [videoRef]
  );

  const volumeChangeBySlider = useCallback(
    (e) => {
      volumeChangeValue(e.target.value);
    },
    [volumeChangeValue]
  );

  const volumeChange = useCallback(() => {
    const video = videoRef.current;
    const videoContainer = videoContainterRef.current;

    volumeRef.current.value = video.volume;

    let volumeLevel;
    if (video.muted || video.volume === 0) {
      volumeRef.current.value = 0;
      volumeLevel = "muted";
    } else if (video.volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
  }, [videoRef, videoContainterRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === "input") return;

      const k = e.key.toLowerCase();
      if (!["m", "arrowup", "arrowdown"].includes(k)) return;
      e.preventDefault();

      switch (k) {
        case "m":
          return toggleMute();
        case "arrowup":
          return volumeChangeValue(
            Math.round(Math.min(videoRef.current.volume + 0.1, 1) * 100) / 100
          );
        default:
          return volumeChangeValue(
            Math.round(Math.max(videoRef.current.volume - 0.1, 0) * 100) / 100
          );
      }
    },
    [videoRef, volumeChangeValue, toggleMute]
  );

  // mute btn events
  useEffect(() => {
    if (!muteRef.current) return;

    const m = muteRef.current;
    m.addEventListener("click", toggleMute);

    return () => {
      m.removeEventListener("click", toggleMute);
    };
  }, [toggleMute]);

  // volume slider events
  useEffect(() => {
    if (!volumeRef.current) return;

    const v = volumeRef.current;
    v.addEventListener("input", volumeChangeBySlider);

    return () => {
      v.removeEventListener("input", volumeChangeBySlider);
    };
  }, [volumeChangeBySlider]);

  // video events
  useEffect(() => {
    if (!videoRef.current) return;

    const v = videoRef.current;
    v.addEventListener("volumechange", volumeChange);

    return () => {
      v.removeEventListener("volumechange", volumeChange);
    };
  }, [videoRef, volumeChange]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <div className="volume-container">
      <button ref={muteRef} className="mute-btn">
        <svg className="volume-high-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
          />
        </svg>
        <svg className="volume-low-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
          />
        </svg>
        <svg className="volume-muted-icon" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
          />
        </svg>
      </button>

      <input
        ref={volumeRef}
        className="volume-slider"
        type="range"
        min="0"
        max="1"
        step="any"
        defaultValue="1"
      />
    </div>
  );
}
