import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

let isScrubbing = false;
let wasPaused;

export default function Timeline({
  thumbnailRef,
  videoRef,
  videoContainterRef,
}) {
  const previewRef = useRef(null);
  const ref = useRef(null);

  const handleTimelineUpdate = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();

      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

      const previewImgNumber = Math.max(
        1,
        Math.floor((percent * videoRef.current?.duration) / 10)
      );

      const previewImgSrc = `/previews/preview${previewImgNumber}.jpg`;
      previewRef.current.src = previewImgSrc;
      ref.current?.style.setProperty("--preview-position", percent);

      if (isScrubbing) {
        e.preventDefault();
        thumbnailRef.current.src = previewImgSrc;
        ref.current?.style.setProperty("--progress-position", percent);
      }
    },
    [videoRef, thumbnailRef]
  );

  const toggleScrubbing = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      isScrubbing = (e.buttons & 1) === 1;
      videoContainterRef.current?.classList.toggle("scrubbing", isScrubbing);
      if (isScrubbing) {
        wasPaused = videoRef.current?.paused;
        videoRef.current?.pause();
      } else {
        videoRef.current.currentTime = percent * videoRef.current?.duration;
        if (!wasPaused) videoRef.current?.play();
      }

      handleTimelineUpdate(e);
    },
    [videoRef, videoContainterRef, handleTimelineUpdate]
  );

  const mouseup = useCallback(
    (e) => {
      if (isScrubbing) toggleScrubbing(e);
    },
    [toggleScrubbing]
  );

  const mousemove = useCallback(
    (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    },
    [handleTimelineUpdate]
  );

  // timeline event
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("mousemove", handleTimelineUpdate);
    r.addEventListener("mousedown", toggleScrubbing);

    return () => {
      r.removeEventListener("mousemove", handleTimelineUpdate);
      r.removeEventListener("mousedown", toggleScrubbing);
    };
  }, [handleTimelineUpdate, toggleScrubbing]);

  // document event
  useEffect(() => {
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousemove", mousemove);

    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousemove", mousemove);
    };
  }, [mouseup, mousemove]);

  return (
    <div ref={ref} className="timeline-container">
      <div className="timeline">
        <img ref={previewRef} className="preview-img" alt="preview" />
        <div className="thumb-indicator"></div>
      </div>
    </div>
  );
}
