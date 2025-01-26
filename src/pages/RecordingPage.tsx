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
    const [pdfTotalPages, setPdfTotalPages] = useState(0);
    const [pdfRoutes, setPdfRoutes] = useState([]);

    return (
        <PDFNavigationContext.Provider value={pageNavigationPluginInstance}>
            <div className=" w-5/6 mx-auto mt-32 min-h-screen">
                <p className="text-5xl font-montserrat font-bold bg-gradient-to-r from-[#38bdf8] to-[#34d399] bg-clip-text text-transparent w-fit mx-auto">Let's Get Started</p>
                <div className="border-b border-b-gray-500/70 my-4 w-1/2 mx-auto" />
                {step === 0 && <Step0 setRole={setRole} setStep={setStep} />}
                {step === 1 && <Step1 setStep={setStep} pdfError={pdfError} setPdfError={setPdfError} setPdfFile={setPdfFile} pdfTotalPages={pdfTotalPages} setPdfTotalPages={setPdfTotalPages} pdfRoutes={pdfRoutes} setPdfRoutes={setPdfRoutes} />}
                {step === 2 && <SpeechRecognition pdfTotalPages={pdfTotalPages} pdfRoutes={pdfRoutes} />}
                <PDFViewerComponent plugin={defaultLayoutPluginInstance} pdfFile={pdfFile} />
            </div>
        </PDFNavigationContext.Provider>

    )
}
export default RecordingPage;