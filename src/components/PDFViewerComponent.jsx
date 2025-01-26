// /src/components/PDFViewerComponent.jsx
import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFViewerComponent({ plugin, pdfFile }) {

    return (
        <div className="container">
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
