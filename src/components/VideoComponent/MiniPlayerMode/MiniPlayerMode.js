import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function MiniPlayerMode({ videoRef, videoContainterRef }) {
  const ref = useRef(null);

  const toggleMiniPlayerMode = useCallback(() => {
    if (videoContainterRef.current?.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      videoRef.current?.requestPictureInPicture();
    }
  }, [videoRef, videoContainterRef]);

  const enterPictureInPicture = useCallback(() => {
    if (!videoContainterRef.current) return;
    videoContainterRef.current.classList.add("mini-player");
  }, [videoContainterRef]);

  const leavePictureInPicture = useCallback(() => {
    if (!videoContainterRef.current) return;
    videoContainterRef.current.classList.remove("mini-player");
  }, [videoContainterRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();

      if (tagName === "input") return;
      if (e.key.toLowerCase() !== "i") return;

      toggleMiniPlayerMode();
    },
    [toggleMiniPlayerMode]
  );

  // btn event
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("click", toggleMiniPlayerMode);

    return () => {
      r.removeEventListener("click", toggleMiniPlayerMode);
    };
  }, [toggleMiniPlayerMode]);

  // video events
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.addEventListener("enterpictureinpicture", enterPictureInPicture);
    video.addEventListener("leavepictureinpicture", leavePictureInPicture);

    return () => {
      video.removeEventListener("enterpictureinpicture", enterPictureInPicture);
      video.removeEventListener("leavepictureinpicture", leavePictureInPicture);
    };
  }, [videoRef, enterPictureInPicture, leavePictureInPicture]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <button ref={ref} className="mini-player-btn">
      <svg viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
        />
      </svg>
    </button>
  );
}
