'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { TRACKS, Track } from '@/data/tracks'

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CompactAudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const currentTrack: Track = TRACKS[currentTrackIndex]

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Initialize Audio instance safely in browser
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    audio.preload = 'metadata'

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setIsLoading(false)
      setHasError(false)
    }
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => {
      setIsLoading(false)
      setIsPlaying(true)
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length)
    }
    const handleError = () => {
      setIsLoading(false)
      setIsPlaying(false)
      setHasError(true)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    audio.src = currentTrack.src

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.src = ''
    }
  }, [])

  // Handle track source update when currentTrackIndex changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setHasError(false)
    setIsLoading(true)
    audio.src = currentTrack.src
    audio.currentTime = 0
    setCurrentTime(0)

    if (isPlaying) {
      audio
        .play()
        .then(() => setIsLoading(false))
        .catch(() => {
          setIsPlaying(false)
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [currentTrackIndex])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      setIsLoading(true)
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setIsLoading(false)
        })
        .catch(() => {
          setIsPlaying(false)
          setIsLoading(false)
          setHasError(true)
        })
    }
  }, [isPlaying])

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1))
  }, [])

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length)
  }, [])

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setIsDropdownOpen(false)
    setIsPlaying(true)
    const audio = audioRef.current
    if (audio) {
      audio.src = TRACKS[index].src
      audio.play().catch(() => setIsPlaying(false))
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    const audio = audioRef.current
    if (!bar || !audio || !duration) return

    const rect = bar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-border/80 bg-card/75 backdrop-blur-md p-4 sm:p-5 shadow-xs transition-all hover:border-foreground/20">
      {/* ── Top Row: Status badge & Dropdown Trigger ── */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Animated audio bars */}
          <div className="flex items-end gap-0.5 h-3.5">
            <span
              className={`w-0.5 bg-foreground/80 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5'
              }`}
            />
            <span
              className={`w-0.5 bg-foreground/80 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-2 animate-bounce' : 'h-1'
              }`}
            />
            <span
              className={`w-0.5 bg-foreground/80 rounded-full transition-all duration-300 ${
                isPlaying ? 'h-3 animate-pulse' : 'h-2'
              }`}
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            Acoustic Workspace
          </span>
        </div>

        {/* Dropdown Selector Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border border-border/70 bg-background/80 text-foreground hover:bg-muted transition-all active:scale-95"
            aria-label="Select track from list"
          >
            <span>Tracks (0{currentTrackIndex + 1}/0{TRACKS.length})</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* ── Dropdown Popover ── */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-lg p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
                Select Track
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto">
                {TRACKS.map((t, idx) => {
                  const isSelected = idx === currentTrackIndex
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTrack(idx)}
                      className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        isSelected
                          ? 'bg-foreground/10 text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="truncate font-medium text-foreground">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{t.artist}</div>
                      </div>
                      <span className="text-[10px] font-mono shrink-0">{t.durationFormatted}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Currently Playing Info & Master Controls ── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Track Title & Artist */}
        <div className="overflow-hidden pr-2">
          <div className="text-sm font-semibold tracking-tight text-foreground truncate">
            {currentTrack.title}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {currentTrack.artist} &nbsp;·&nbsp; {currentTrack.version}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Previous Track */}
          <button
            onClick={prevTrack}
            aria-label="Previous track"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all active:scale-90"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          {/* Master Play/Pause with explicit high-contrast recognizable icon */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause track' : 'Play track'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background shadow-xs transition-all hover:opacity-85 active:scale-90"
          >
            {isLoading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/40 border-t-background" />
            ) : isPlaying ? (
              /* Clearly identifiable Pause Icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="5" x2="8" y2="19" />
                <line x1="16" y1="5" x2="16" y2="19" />
              </svg>
            ) : (
              /* Clearly recognizable crisp white Play Triangle Icon */
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="ml-0.5">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all active:scale-90"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Slim Progress Bar & Timestamp ── */}
      <div className="space-y-1.5">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration || 100}
          className="group relative h-1.5 w-full cursor-pointer rounded-full bg-foreground/[0.08] overflow-hidden transition-all hover:h-2"
        >
          <div
            className="h-full bg-foreground rounded-full transition-[width] duration-150 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          {hasError ? (
            <span className="text-red-500 font-medium">Failed to load</span>
          ) : (
            <span>{formatTime(duration)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
