import React, { useState, useRef, useEffect, useContext } from 'react';
import PDFNavigationContext from '../contexts/PDFNavigationContext';

const SpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const pageNavigation = useContext(PDFNavigationContext);
  // TODO: Consider defining a variable that keeps track of the transcript from beginning to now

  const commandPatterns = [
    /next slide$/i,
    /previous slide$/i,
    /to( the)? first slide$/i,
    /to( the)? last slide$/i,
    /to the slide with the (.+)$/i,
    /to the slide titled (.+)$/i,
    /search for (.+)$/i,
  ];

  document.addEventListener('keydown', () => {
    console.log("testing");
    // pageNavigation.jumpToNextPage();
  });

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support SpeechRecognition. Try Chrome or Edge.');
      return;
    }

    // Create a new recognition instance
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;     // Keep capturing speech until stopped
    recognition.interimResults = true; // Show interim transcripts

    // Handle the result event
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Loop through the results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment;
          // TODO: The "finalTranscript" sometimes is cut off in the middle so commands are not captured
          // Potential Solution: Create a variable that keeps track of ALL the speech so far, and check the last 20 words or so

          for (const pattern of commandPatterns) {
            const match = finalTranscript.match(pattern);
            console.log(finalTranscript + " did (not?) match to " + pattern);
            if (match) {
              const command = pattern.source;
              const parameter = match[1] || null;
              // Handle the command accordingly
              console.log(`Command: ${command}`, parameter ? `Parameter: ${parameter}` : '');

              // TODO: Implement Corresponding behaviour based on the command
              // "next slide" -> the down key in the embedded PDF
              // "previous slide" -> the up key in the embedded PDF
              // "go to the first slide" -> 1 + Enter in the embedded PDF
              // "go to the last slide" -> will require calculating the n, + enter in the embedded PDF
              // "go to the slide with the (.+)" -> will search through the slide, find the number + enter in the embedded PDF

              // "search for (.+)" -> will search for the text in the embedded PDF
              if (commandPatterns.indexOf(pattern) === 0) {
                pageNavigation.jumpToNextPage();
              } else if (commandPatterns.indexOf(pattern) === 1) {
                pageNavigation.jumpToPreviousPage();
              } else if (commandPatterns.indexOf(pattern) === 2) {
                pageNavigation.jumpToPage(0);
              } else if (commandPatterns.indexOf(pattern) === 3) {
                pageNavigation.jumpToLastPage();
              }

              break;
            }
          }
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      // Update the state with whatever is available (final or interim)
      setTranscript(finalTranscript || interimTranscript);
    };

    // Inform the user that the recognition has started
    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    // When recognition ends (automatically or via stop), update state
    recognition.onend = () => {
      console.log('Speech recognition ended');
      setListening(false);
    };

    // Store the recognition instance in a ref so we can start/stop it later
    recognitionRef.current = recognition;
  }, []);

  // Start recognition
  const handleStart = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  // Stop recognition
  const handleStop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      // The onend event will set listening=false for us
    }
  };

  return (
    <div style={{ padding: '2rem' }} id="speech-recognition">
      <h1 className="text-3xl">Web Speech API in React</h1>
      <div className="flex items-center font-bold">
        <button onClick={handleStart} disabled={listening} className="bg-red-200">
          Start
        </button>
        <button onClick={handleStop} disabled={!listening} className="bg-green-200">
          Stop
        </button>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        Transcript: {transcript}
      </p>

    </div>
  );
};

export default SpeechRecognition;