import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

const formatDuration = (time) => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const times = [
    hours,
    leadingZeroFormatter.format(minutes),
    leadingZeroFormatter.format(seconds),
  ];

  if (hours <= 0) times.shift();
  return times.join(":");
};

export default function Duration({ videoRef }) {
  const currentTimeRef = useRef(null);
  const totalTimeRef = useRef(null);

  const skip = useCallback(
    (duration) => {
      if (!videoRef.current) return;
      videoRef.current.currentTime += duration;
    },
    [videoRef]
  );

  const loadeddata = useCallback(() => {
    totalTimeRef.current.textContent = formatDuration(
      videoRef.current?.duration
    );
  }, [videoRef]);

  const timeupdate = useCallback(() => {
    const timelineContainer = document.querySelector(".timeline-container");
    const video = videoRef.current;

    currentTimeRef.current.textContent = formatDuration(video?.currentTime);
    const percent = video?.currentTime / video?.duration;

    timelineContainer.style.setProperty("--progress-position", percent);
  }, [videoRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName === "input") return;

      const k = e.key.toLowerCase();
      if (k === "j" || k === "arrowleft") return skip(-5);
      if (k === "l" || k === "arrowright") return skip(5);
    },
    [skip]
  );

  // video events
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.addEventListener("loadeddata", loadeddata);
    video.addEventListener("timeupdate", timeupdate);

    return () => {
      video.removeEventListener("loadeddata", loadeddata);
      video.removeEventListener("timeupdate", timeupdate);
    };
  }, [videoRef, loadeddata, timeupdate]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <div className="duration-container">
      <div ref={currentTimeRef} className="current-time">
        0:00
      </div>
      /<div ref={totalTimeRef} className="total-time"></div>
    </div>
  );
}
