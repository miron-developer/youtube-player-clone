import { useCallback, useEffect, useRef } from "react";

import "./styles.css";

export default function TheaterMode({ videoContainterRef }) {
  const ref = useRef(null);

  const toggleTheaterMode = useCallback(() => {
    if (!videoContainterRef.current) return;
    videoContainterRef.current.classList.toggle("theater");
  }, [videoContainterRef]);

  const keydown = useCallback(
    (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();

      if (tagName === "input") return;
      if (e.key.toLowerCase() !== "t") return;

      toggleTheaterMode();
    },
    [toggleTheaterMode]
  );

  // btn event
  useEffect(() => {
    if (!ref.current) return;

    const r = ref.current;
    r.addEventListener("click", toggleTheaterMode);

    return () => {
      r.removeEventListener("click", toggleTheaterMode);
    };
  }, [toggleTheaterMode]);

  // document event
  useEffect(() => {
    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [keydown]);

  return (
    <button ref={ref} className="theater-btn">
      <svg className="tall" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"
        />
      </svg>
      <svg className="wide" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"
        />
      </svg>
    </button>
  );
}
