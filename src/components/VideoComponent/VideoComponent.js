import { useRef } from "react";

import {
  Timeline,
  PlayPause,
  Volume,
  Duration,
  Captions,
  Speed,
  MiniPlayerMode,
  TheaterMode,
  FullscreenMode,
} from ".";

import "./styles.css";

export default function VideoComponent() {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const thumbnailRef = useRef(null);

  return (
    <>
      <div
        ref={videoContainerRef}
        className="video-container paused"
        data-volume-level="high"
      >
        <img ref={thumbnailRef} className="thumbnail-img" alt="thumb" />

        <div className="video-controls-container">
          <Timeline
            thumbnailRef={thumbnailRef}
            videoContainterRef={videoContainerRef}
            videoRef={videoRef}
          />

          <div className="controls">
            <PlayPause
              videoContainterRef={videoContainerRef}
              videoRef={videoRef}
            />

            <Volume
              videoContainterRef={videoContainerRef}
              videoRef={videoRef}
            />

            <Duration videoRef={videoRef} />

            <Captions
              videoContainterRef={videoContainerRef}
              videoRef={videoRef}
            />

            <Speed videoRef={videoRef} />

            <MiniPlayerMode
              videoContainterRef={videoContainerRef}
              videoRef={videoRef}
            />

            <TheaterMode videoContainterRef={videoContainerRef} />

            <FullscreenMode videoContainterRef={videoContainerRef} />
          </div>
        </div>

        <video ref={videoRef} src="/video/Video.mp4">
          <track kind="captions" srcLang="en" src="/subtitles.vtt" />
        </video>
      </div>
    </>
  );
}
