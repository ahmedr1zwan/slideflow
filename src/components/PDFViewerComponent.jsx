// /src/components/PDFViewerComponent.jsx
import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFViewerComponent({ plugin }) {
    // // Initialize the defaultLayoutPlugin
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // State for PDF file and errors
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState('');

    // Handle file selection
    const allowedFiles = ['application/pdf'];
    const handleFile = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (allowedFiles.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onloadend = (e) => {
                    setPdfError('');
                    setPdfFile(e.target.result);
                };
            } else {
                setPdfError('Not a valid PDF: Please select only PDF');
                setPdfFile('');
            }
        } else {
            console.log('Please select a PDF');
        }
    };

    return (
        <div className="container">
            <form>
                <label><h5>Upload PDF</h5></label>
                <br />
                <input type='file' className="form-control" onChange={handleFile} />
                {pdfError && <span className='text-danger'>{pdfError}</span>}
            </form>

            <h5>View PDF</h5>
            <div className="viewer" style={{ border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px' }}>
                {pdfFile ? (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfFile} plugins={[plugin]} />
                    </Worker>
                ) : (
                    <>No file is selected yet</>
                )}
            </div>
        </div>
    );
}

export default PDFViewerComponent;
