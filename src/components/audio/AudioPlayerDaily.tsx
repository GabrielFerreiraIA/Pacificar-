import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, FileText, Check, Headphones } from 'lucide-react';

interface AudioPlayerDailyProps {
  dayNumber: number;
  audioTitle: string;
  audioDuration: string;
  audioSummary: string;
  audioTranscript: string;
  speakerName?: string;
  onAudioCompleted?: () => void;
}

/** Alturas fixas — a onda não deve tremer a cada render. */
const BAR_HEIGHTS = [
  32, 48, 74, 92, 61, 42, 70, 100, 86, 52, 66, 94, 79, 56, 71, 89, 62, 41, 76, 84, 60, 50, 81, 96,
  69, 46, 36, 26
];

export const AudioPlayerDaily: React.FC<AudioPlayerDailyProps> = ({
  dayNumber,
  audioTitle,
  audioDuration,
  audioSummary,
  audioTranscript,
  speakerName = 'Ana Carla Nesi',
  onAudioCompleted
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [rate, setRate] = useState<1 | 1.25 | 1.5>(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [completed, setCompleted] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const totalSeconds = useRef(130);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Reinicia o player ao trocar de dia
  useEffect(() => {
    const match = audioDuration.match(/(\d+)\s*min\s*(\d+)?/);
    totalSeconds.current = match
      ? (parseInt(match[1], 10) || 1) * 60 + (parseInt(match[2] || '0', 10) || 0)
      : 120;
    setProgress(0);
    setCurrentTime('0:00');
    setIsPlaying(false);
    setCompleted(false);
    window.speechSynthesis?.cancel();
  }, [dayNumber, audioDuration]);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.speechSynthesis?.cancel();
    },
    []
  );

  const speak = (playbackRate: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioTranscript);
    utterance.lang = 'pt-BR';
    utterance.rate = playbackRate * 0.95;
    utterance.pitch = 1.05;
    const ptVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;
    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setCompleted(true);
      onAudioCompleted?.();
    };
    window.speechSynthesis.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
    } else {
      speak(rate);
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / totalSeconds.current) * rate;
        setCurrentTime(formatTime((Math.min(next, 100) / 100) * totalSeconds.current));
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
          setCompleted(true);
          onAudioCompleted?.();
          return 100;
        }
        return next;
      });
    }, 1000);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    window.speechSynthesis?.cancel();
    setProgress(0);
    setCurrentTime('0:00');
    setIsPlaying(false);
  };

  const cycleRate = () => {
    const next: 1 | 1.25 | 1.5 = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1;
    setRate(next);
    if (isPlaying) speak(next);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    setCurrentTime(formatTime((value / 100) * totalSeconds.current));
  };

  const bars = useMemo(
    () =>
      BAR_HEIGHTS.map((h, i) => ({
        h,
        threshold: (i / BAR_HEIGHTS.length) * 100,
        delay: `${(i % 7) * 90}ms`
      })),
    []
  );

  return (
    <article className="overflow-hidden rounded-bloom bg-leaf-800 text-leaf-50 shadow-leaf-lg">
      <div className="space-y-5 p-5 sm:p-6">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-ochre-200">
              <Headphones className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leaf-200">
                Áudio do dia <span className="tnum">{String(dayNumber).padStart(2, '0')}</span>
              </p>
              <p className="mt-0.5 truncate text-[12.5px] text-leaf-100/80">{speakerName}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-leaf-700 px-2.5 py-1 text-[11px] font-semibold text-leaf-100">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                Ouvido
              </span>
            )}
            <button
              onClick={cycleRate}
              aria-label={`${rate}× · velocidade de reprodução. Toque para alterar.`}
              className="tap press tnum rounded-full bg-leaf-700 px-3 py-1.5 text-[12px] font-bold text-leaf-50 hover:bg-leaf-600"
            >
              {rate}×
            </button>
          </div>
        </header>

        <div>
          <h3 className="font-display text-[21px] leading-snug text-white">{audioTitle}</h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-leaf-100/85">{audioSummary}</p>
        </div>

        {/* Onda + scrubber */}
        <div className="space-y-2.5">
          <div className="flex h-10 items-center justify-between gap-[3px]" aria-hidden="true">
            {bars.map((bar, i) => {
              const active = progress >= bar.threshold;
              return (
                <span
                  key={i}
                  className={`w-full max-w-[5px] flex-1 rounded-full transition-colors duration-300 ${
                    active ? 'bg-ochre-300' : 'bg-leaf-700'
                  } ${isPlaying && active ? 'breathe' : ''}`}
                  style={{ height: `${bar.h}%`, animationDelay: bar.delay }}
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={seek}
            aria-label="Posição do áudio"
            className="range-tap -my-3 w-full"
          />

          <div className="tnum flex justify-between text-[11.5px] text-leaf-100/70">
            <span>{currentTime}</span>
            <span>{audioDuration}</span>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setShowTranscript(v => !v)}
            aria-expanded={showTranscript}
            className="tap press inline-flex items-center gap-2 rounded-full bg-leaf-700 px-4 py-2.5 text-[12.5px] font-semibold text-leaf-50 hover:bg-leaf-600"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {showTranscript ? 'Ocultar texto' : 'Ler transcrição'}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={reset}
              aria-label="Reiniciar áudio"
              className="tap press flex h-11 w-11 items-center justify-center rounded-full text-leaf-100 hover:bg-leaf-700"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
              className="tap press flex h-14 w-14 items-center justify-center rounded-full bg-ochre-300 text-leaf-900 shadow-leaf hover:bg-ochre-200"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" aria-hidden="true" />
              ) : (
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {showTranscript && (
          <div className="rise border-t border-leaf-700 pt-4">
            <p className="font-display text-[14.5px] italic leading-relaxed text-leaf-50/90">
              “{audioTranscript}”
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
