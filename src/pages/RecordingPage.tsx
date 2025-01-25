import React, { useEffect, useCallback } from 'react';
import SpeechRecognition from '../components/SpeechRecognition.tsx';
import PDFViewerComponent from '../components/PDFViewerComponent.jsx';

// Import both the context and the plugin if needed
import { PDFProvider, usePDF } from '../components/PDFContext.jsx';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export const RecordingPage = () => {

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            console.log("ArrowDown");
            // goToNextPage();
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <div>
            <p className="text-3xl font-bold border">Recording Page</p>
            <SpeechRecognition />
            <PDFViewerComponent plugin={defaultLayoutPlugin()} />
        </div>

    )
}
export default RecordingPage;