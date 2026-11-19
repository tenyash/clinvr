import React, { useEffect, useRef, useState } from 'react';

/**
 * Optional one-shot speech input for browsers that expose Web Speech API.
 * The browser asks for microphone permission only after the user presses the button.
 * Final recognized text is passed to onTranscript; interim text is not submitted.
 */
export default function VoiceInput({ onTranscript, disabled = false, lang = 'en-US' }) {
  const recognitionRef = useRef(null);
  const mountedRef = useRef(true);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    mountedRef.current = true;
    setSupported(typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => {
      mountedRef.current = false;
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        try { recognition.abort(); } catch { /* The browser may already have stopped it. */ }
      }
    };
  }, []);

  const startListening = () => {
    if (disabled || listening || typeof window === 'undefined') return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSupported(false);
      setMessage('Speech input is not available in this browser.');
      return;
    }

    let recognition;
    try {
      recognition = new Recognition();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
      setMessage('Listening…');
      setListening(true);

      recognition.onresult = (event) => {
        const finalText = Array.from(event.results || [])
          .filter((result) => result.isFinal)
          .map((result) => result[0]?.transcript?.trim() || '')
          .filter(Boolean)
          .join(' ');
        if (finalText) {
          onTranscript?.(finalText);
          if (mountedRef.current) setMessage('Speech added.');
        }
      };
      recognition.onerror = (event) => {
        if (!mountedRef.current) return;
        const errors = {
          'not-allowed': 'Microphone access was denied. Allow it in browser site settings to use speech input.',
          'service-not-allowed': 'The browser speech service is unavailable or blocked.',
          'audio-capture': 'No microphone was found. Check your microphone and try again.',
          'no-speech': 'No speech was detected. Try again when you are ready.',
          network: 'Speech recognition needs a network connection. You can still type your question.',
          aborted: 'Speech input stopped.',
        };
        setMessage(errors[event.error] || 'Speech input could not start. You can type your question instead.');
      };
      recognition.onend = () => {
        if (!mountedRef.current) return;
        recognitionRef.current = null;
        setListening(false);
        setMessage((current) => current === 'Listening…' ? 'No speech was detected. Try again when you are ready.' : current);
      };
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      if (mountedRef.current) {
        setListening(false);
        setMessage(error?.name === 'NotAllowedError'
          ? 'Microphone access was denied. Allow it in browser site settings to use speech input.'
          : 'Speech input could not start. You can type your question instead.');
      }
    }
  };

  if (!supported) return <span role="status" style={{ fontSize: 11, color: '#8b9991' }}>Speech input is unavailable here; you can type your question.</span>;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        className="link-button"
        onClick={startListening}
        disabled={disabled || listening}
        aria-label={listening ? 'Listening for speech' : 'Speak your question'}
        aria-pressed={listening}
        title={listening ? 'Listening…' : 'Use speech input'}
      >
        {listening ? 'Listening…' : 'Use voice'}
      </button>
      <span style={{ fontSize: 11, color: '#71857a' }}>Your browser may send audio to its speech service.</span>
      {message && <span role="status" aria-live="polite" style={{ fontSize: 11, color: '#71857a' }}>{message}</span>}
    </span>
  );
}
