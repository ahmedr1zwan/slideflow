import React, { useEffect, useCallback, useState } from 'react';
import SpeechRecognition from '../components/SpeechRecognition.tsx';
import PDFViewerComponent from '../components/PDFViewerComponent.jsx';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import PDFNavigationContext from '../contexts/PDFNavigationContext.jsx';
import Step0 from '../components/Step0.tsx';
import Step1 from '../components/Step1.tsx';

export const RecordingPage = () => {

    // Initialize the defaultLayoutPlugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const { toolbarPluginInstance } = defaultLayoutPluginInstance;
    const { pageNavigationPluginInstance } = toolbarPluginInstance;
    const [step, setStep] = useState(0);
    const [role, setRole] = useState('');

    // State for PDF file and errors
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState('');

    return (
        <PDFNavigationContext.Provider value={pageNavigationPluginInstance}>
            <div>
                <p className="text-3xl font-bold border">Get started</p>
                {step === 0 && <Step0 setRole={setRole} setStep={setStep} />}
                {step === 1 && <Step1 setStep={setStep} pdfError={pdfError} setPdfError={setPdfError} setPdfFile={setPdfFile} />}
                {step === 2 && <SpeechRecognition />}
                <PDFViewerComponent plugin={defaultLayoutPluginInstance} pdfFile={pdfFile} pdfError={pdfError} />
            </div>
        </PDFNavigationContext.Provider>

    )
}
export default RecordingPage;