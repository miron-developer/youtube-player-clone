import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function Speed({ videoRef }) {
  const ref = useRef(null);

  const changePlaybackSpeed = useCallback(() => {
    let newPlaybackRate = videoRef.current?.playbackRate + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;

    videoRef.current.playbackRate = newPlaybackRate;
    ref.current.textContent = `${newPlaybackRate}x`;
  }, [videoRef]);

  // btn event
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("click", changePlaybackSpeed);

    return () => {
      r.removeEventListener("click", changePlaybackSpeed);
    };
  }, [changePlaybackSpeed]);

  return (
    <button ref={ref} className="speed-btn wide-btn">
      1x
    </button>
  );
}
