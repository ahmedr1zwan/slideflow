// import React, { useState, useRef, useEffect } from 'react';

// const SpeechRecognitionExample = () => {
//   const [transcript, setTranscript] = useState('');
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     // Check if the browser supports SpeechRecognition
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Your browser does not support SpeechRecognition. Try Chrome or Edge.');
//       return;
//     }

//     // Create a new recognition instance
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.continuous = true;     // Keep capturing speech until stopped
//     recognition.interimResults = true; // Show interim transcripts

//     // Handle the result event
//     recognition.onresult = (event) => {
//       let interimTranscript = '';
//       let finalTranscript = '';

//       // Loop through the results
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const { transcript: text, confidence } = event.results[i][0];
//         if (event.results[i].isFinal) {
//           finalTranscript += text;
//           console.log(`Final: ${text} (Confidence: ${confidence})`);
//         } else {
//           interimTranscript += text;
//         }
//       }

//       // Update the state with whatever is available (final or interim)
//       setTranscript(finalTranscript || interimTranscript);
//     };

//     // Inform the user that the recognition has started
//     recognition.onstart = () => {
//       console.log('Speech recognition started');
//     };

//     // Handle errors
//     recognition.onerror = (event) => {
//       console.error('Speech recognition error', event.error);
//     };

//     // When recognition ends (automatically or via stop), update state
//     recognition.onend = () => {
//       console.log('Speech recognition ended');
//       setListening(false);
//     };

//     // Store the recognition instance in a ref so we can start/stop it later
//     recognitionRef.current = recognition;
//   }, []);

//   // Start recognition
//   const handleStart = () => {
//     if (recognitionRef.current && !listening) {
//       recognitionRef.current.start();
//       setListening(true);
//     }
//   };

//   // Stop recognition
//   const handleStop = () => {
//     if (recognitionRef.current && listening) {
//       recognitionRef.current.stop();
//       // The onend event will set listening=false for us
//     }
//   };






//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Web Speech API in React</h1>
//       <div>
//         <button onClick={handleStart} disabled={listening}>
//           Start
//         </button>
//         <button onClick={handleStop} disabled={!listening}>
//           Stop
//         </button>
//       </div>

//       <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
//         Transcript: {transcript}
//       </p>
//     </div>
//   );
// };

// export default SpeechRecognitionExample;


// import React, { useState, useRef, useEffect } from 'react';

// function SpeechRecognitionExample() {
//   const [transcript, setTranscript] = useState('');
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//     // Check if the browser supports Web Speech API
//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert('Your browser does not support SpeechRecognition. Try Chrome or Edge.');
//       return;
//     }

//     // Create a new recognition instance
//     const recognition = new SpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.continuous = true;     // Keep capturing speech until stopped
//     recognition.interimResults = true; // Show partial results

//     recognition.onresult = (event) => {
//       let interimTranscript = '';
//       let finalTranscript = '';

//       // Process speech results
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const { transcript: text } = event.results[i][0];
//         if (event.results[i].isFinal) {
//           finalTranscript += text;
//         } else {
//           interimTranscript += text;
//         }
//       }

//       // Update the transcript (display)
//       const currentTranscript = (finalTranscript || interimTranscript).toLowerCase();
//       setTranscript(currentTranscript);

//       // ---- COMMAND DETECTION ----
//       if (currentTranscript.includes('next slide')) {
//         simulateKeyPress('ArrowRight'); // Right arrow
//         simulateKeyPress('')
//       } else if (currentTranscript.includes('last slide')) {
//         simulateKeyPress('ArrowLeft');  // Left arrow
//       }
//     };

//     recognition.onstart = () => {
//       console.log('Speech recognition started');
//     };

//     recognition.onend = () => {
//       console.log('Speech recognition ended');
//       setListening(false);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   // Helper function to simulate a key press
//   const simulateKeyPress = (key) => {
//     // Create a KeyboardEvent with the given key
//     const event = new KeyboardEvent('keydown', {
//       key: key,
//       code: key,
//       keyCode: key === 'ArrowRight' ? 39 : 37, // older browsers
//       which: key === 'ArrowRight' ? 39 : 37,   // older browsers
//       bubbles: true,
//     });
//     // Dispatch it on the document (or whichever element needs to receive it)
//     document.dispatchEvent(event);
//   };

//   // Start and Stop
//   const handleStart = () => {
//     if (recognitionRef.current && !listening) {
//       recognitionRef.current.start();
//       setListening(true);
//     }
//   };

//   const handleStop = () => {
//     if (recognitionRef.current && listening) {
//       recognitionRef.current.stop();
//       // onend event will set listening = false
//     }
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h1>Speech Recognition Demo</h1>
//       <button onClick={handleStart} disabled={listening}>Start</button>
//       <button onClick={handleStop} disabled={!listening}>Stop</button>
      
//       <p style={{ marginTop: '1rem' }}>
//         <strong>Transcript:</strong> {transcript}
//       </p>
//     </div>
//   );
// }

// export default SpeechRecognitionExample;


// LAST WORKING

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// IMPORTANT: Setup the pdf worker (version may vary)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

function SpeechRecognitionX() {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // PDF page tracking
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    // Check if the browser supports the API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support SpeechRecognition. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const { transcript: text } = event.results[i][0];
        if (event.results[i].isFinal) {
          finalTranscript += text;
        } else {
          interimTranscript += text;
        }
      }

      const currentTranscript = (finalTranscript || interimTranscript).toLowerCase();
      setTranscript(currentTranscript);

      // Only do the "next slide" / "previous slide" action 
      // on the final portion to avoid repeated triggers
      if (finalTranscript.toLowerCase().includes('next slide')) {
        setPageNumber((prev) => (prev + 1));
      } else if (finalTranscript.toLowerCase().includes('previous slide')) {
        setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Start/Stop handlers
  const handleStart = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleStop = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Speech Recognition + PDF Slides</h1>
      <button onClick={handleStart} disabled={listening}>
        Start
      </button>
      <button onClick={handleStop} disabled={!listening}>
        Stop
      </button>

      <p>
        <strong>Transcript:</strong> {transcript}
      </p>
      <p>
        <strong>Current Page:</strong> {pageNumber} of {numPages}
      </p>

      <Document
        file="/ExamplePresentation.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}

export default SpeechRecognitionX;
