import React, { useState, useRef, useEffect, useContext } from 'react';
import PDFNavigationContext from '../contexts/PDFNavigationContext';
import axios from 'axios';

const SpeechRecognition = ({ pdfTotalPages, pdfRoutes, setStep }) => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const pageNavigation = useContext(PDFNavigationContext);

  const [isOn, setIsOn] = useState(false);
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
            if (match) {
              const command = pattern.source;
              const phrase = match[0];
              // Handle the command accordingly
              console.log(`Command: ${command}`);
              if (commandPatterns.indexOf(pattern) === 0) {
                pageNavigation.jumpToNextPage();
              } else if (commandPatterns.indexOf(pattern) === 1) {
                pageNavigation.jumpToPreviousPage();
              } else if (commandPatterns.indexOf(pattern) === 2) {
                pageNavigation.jumpToPage(0);
              } else if (commandPatterns.indexOf(pattern) === 3) {
                pageNavigation.jumpToPage(pdfTotalPages - 1);
              } else {
                const filepath = pdfRoutes[pdfRoutes.length - 1]; // Replace with actual logic to get PDF path
                console.log(pdfRoutes);
                const filetype = filepath.split('.').pop();
                // call axios with promise at this endpoint `http://127.0.0.1:5000/${filetype}/search`,
                axios
                  .post(`http://127.0.0.1:5000/${filetype}/search`, {
                    file_path: filepath,
                    phrase: phrase,
                  })
                  .then((response) => {
                    console.log("Searching response:", response.data.result.page_number);
                    if (response.data.result) {
                      pageNavigation.jumpToPage(response.data.result.page_number - 1);
                    }
                  })
                  .catch((error) => {
                    console.error('Error navigating to slide:', error);
                  });
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
      <div className="flex flex-row items-center justify-around w-1/2 mx-auto">
        {/* Zeroth button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              setStep(1);
            }}
            className={`bg-gradient-to-r from-[#b3d12d] to-[#c8720f] 
                                    font-montserrat p-6 rounded-full mx-auto hover:cursor-pointer`}
          >
            <img
              src="/images/backbutton.svg"
              alt="Microphone Icon"
              className="w-8 h-8 select-none"
              draggable="false"
            />
          </button>
          <p className="font-montserrat text-white mt-2">
            BACK
          </p>
        </div>
        {/* First button */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => {
              setIsOn(prev => !prev);
              handleStart();
            }}
            disabled={listening}
            className={`bg-gradient-to-r from-[#38bdf8] to-[#34d399] 
                                    font-montserrat p-6 rounded-full mx-auto 
                                    ${listening ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
          >
            <img
              src="/images/micBlack.svg"
              alt="Microphone Icon"
              className="w-8 h-8 select-none"
              draggable="false"
            />
          </button>
          <p className="font-montserrat text-white mt-2">
            START
          </p>
        </div>

        {/* Second button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleStop}
            disabled={!listening}
            className={`bg-gradient-to-r from-[#f87171] to-[#facc15] 
                                    font-montserrat p-6 rounded-full mx-auto 
                                    ${!listening ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
          >
            <img
              src="/images/square.svg"
              alt="Stop Icon"
              className="w-8 h-8 select-none scale-80"
              draggable="false"
            />
          </button>
          <p className="font-montserrat text-white mt-2">
            STOP
          </p>
        </div>
      </div>


      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }} className="text-white/50 font-quicksand">
        Transcript: {transcript}
      </p>
    </div>
  );
};

export default SpeechRecognition;
