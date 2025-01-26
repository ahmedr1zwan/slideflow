import React, { useEffect, useCallback } from 'react';
import SpeechRecognition from '../components/SpeechRecognition.tsx';
import PDFViewerComponent from '../components/PDFViewerComponent.jsx';

// Import both the context and the plugin if needed
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import PDFNavigationContext from '../contexts/PDFNavigationContext.jsx';

export const RecordingPage = () => {

    // Initialize the defaultLayoutPlugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const { toolbarPluginInstance } = defaultLayoutPluginInstance;
    const { pageNavigationPluginInstance } = toolbarPluginInstance;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            console.log("ArrowDown");
        }
    }, []);

    return (
        <PDFNavigationContext.Provider value={pageNavigationPluginInstance}>
            <div>
                <p className="text-3xl font-bold border">Recording Page</p>
                <SpeechRecognition />
                <PDFViewerComponent plugin={defaultLayoutPluginInstance} />
            </div>
        </PDFNavigationContext.Provider>

    )
}
export default RecordingPage;