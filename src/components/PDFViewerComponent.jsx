// /src/components/PDFViewerComponent.jsx
import { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function PDFViewerComponent({ plugin, pdfFile }) {

    return (
        <div className="container">
            <h5></h5>
            <div className="viewer" style={{ height: '750px' }}>
                {pdfFile ? (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <Viewer fileUrl={pdfFile} plugins={[plugin]} />
                    </Worker>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

export default PDFViewerComponent;
