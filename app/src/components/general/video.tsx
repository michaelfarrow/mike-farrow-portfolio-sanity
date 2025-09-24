'use client';

import clsx from 'clsx';
import {
  PiPause as PauseIcon,
  PiPlay as PlayIcon,
  PiSpinnerGap as SpinnerIcon,
} from 'react-icons/pi';
import ReactPlayer from 'react-player';
import { useTimeout } from 'react-timing-hooks';

import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { EventBus } from '@app/lib/events';
import { memo } from '@app/lib/react';
import { styleWithVars } from '@app/lib/style';

import { Conditional } from '@app/components/general/conditional';
import VideoProgress from '@app/components/general/video-progress';

import styles from './video.module.css';

export interface VideoProps extends React.ComponentPropsWithoutRef<'div'> {
  src: string;
  native?: boolean;
  title?: string;
  width?: number;
  height?: number;
  timeout?: number;
  poster?: (info: { playing: boolean }) => React.JSX.Element | null;
}

const ReactPlayerMemo = memo(ReactPlayer, {
  ignoreFunctions: true,
  deep: true,
});

export function Video({
  className,
  style,
  src,
  native,
  title,
  width = 1920,
  height = 1080,
  timeout = 1,
  poster,
  ...rest
}: VideoProps) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [controlsInteracting, setControlsInteracting] = useState(false);
  const [interactionTimeout, setInteractionTimeout] = useState<
    number | NodeJS.Timeout
  >();

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const handlePlayPause = () => {
    if (playing && duration - progress < 1) return;
    setPlaying(!playing);
  };

  // const handleStop = () => {
  //   setState((prevState) => ({ ...prevState, playing: false }));
  // };

  const handlePause = useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
  };

  const handlePlay = () => {
    EventBus.dispatch('videos:pause');
    setPlaying(true);
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;
    setDuration(player.duration);
  };

  const handleTimeUpdate: ReactEventHandler<HTMLVideoElement> = () => {
    const player = playerRef.current;
    if (!player || seeking) return;
    if (!player.duration) return;
    if (!playing) return;
    setProgress(player.currentTime);
    setDuration(player.duration);
  };

  // const handleSeeking = () => {
  //   setSeeking(true);
  // };

  // const handleSeeked = () => {
  //   setSeeking(false);
  // };

  const handleSeek = (t: number) => {
    if (playerRef.current) playerRef.current.currentTime = duration * t;
    handlePlay();
  };

  const clearInteractionTimeout = () => {
    if (interactionTimeout !== undefined) {
      clearTimeout(interactionTimeout);
    }
    setInteractionTimeout(undefined);
  };

  const delayedClearInteractionTimeout = useTimeout(() => {
    clearInteractionTimeout();
  }, timeout * 1000);

  const handleInteractionEnd = () => {
    clearInteractionTimeout();
  };

  const handleInteractionStart = () => {
    clearInteractionTimeout();
    setInteractionTimeout(delayedClearInteractionTimeout());
  };

  const onControlEnter = () => {
    setControlsInteracting(true);
  };

  const onControlLeave = () => {
    setControlsInteracting(false);
  };

  useEffect(() => {
    EventBus.on('videos:pause', handlePause);
    return () => {
      EventBus.off('videos:pause', handlePause);
    };
  }, [handlePause]);

  return (
    <div
      {...rest}
      style={styleWithVars(style, {
        '--video-width': width,
        '--video-height': height,
      })}
      className={clsx(
        styles.video,
        playing ? styles.playing : progress ? styles.paused : styles.stopped,
        interactionTimeout !== undefined || controlsInteracting
          ? styles.interacting
          : null,
        className
      )}
      onMouseMove={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
    >
      <ReactPlayerMemo
        ref={setPlayerRef}
        className={styles.inner}
        src={src}
        controls={native}
        width={undefined}
        height={undefined}
        title={title}
        playing={playing}
        onPause={handlePause}
        onEnded={handleEnded}
        onPlay={handlePlay}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        config={{
          youtube: {
            color: 'white',
          },
          vimeo: {
            color: 'ffffff',
          },
          spotify: {
            preferVideo: true,
          },
          tiktok: {
            fullscreen_button: true,
            progress_bar: true,
            play_button: true,
            volume_control: true,
            timestamp: false,
            music_info: false,
            description: false,
            rel: false,
            native_context_menu: true,
            closed_caption: false,
          },
        }}
      />
      {(!native && (
        <>
          <div className={styles.poster}>
            <Conditional value={poster}>
              {(poster) => poster({ playing })}
            </Conditional>
          </div>
          <button
            className={styles.button}
            onClick={handlePlayPause}
            onFocus={handleInteractionStart}
            onBlur={handleInteractionEnd}
          >
            <div className={styles.icon}>
              <PlayIcon className={styles.play} />
              {playing && !progress ? (
                <SpinnerIcon className={styles.spinner} />
              ) : (
                <PauseIcon className={styles.pause} />
              )}
            </div>
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          <VideoProgress
            className={styles.progress}
            progress={progress}
            duration={duration}
            onSeek={handleSeek}
            onMouseEnter={onControlEnter}
            onMouseLeave={onControlLeave}
          />
        </>
      )) ||
        null}
    </div>
  );
}
