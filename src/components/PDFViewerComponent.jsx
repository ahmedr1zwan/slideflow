// /src/components/PDFViewerComponent.jsx
import { useState, useEffect, useContext } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PDFNavigationContext from '../contexts/PDFNavigationContext';

function PDFViewerComponent({ plugin, pdfFile, role, resultIndex, results, setResultIndex }) {

    const pageNavigation = useContext(PDFNavigationContext);

    function handleButtonChange(index) {
        if (index < 0) {
            index = 0;
        }
        if (index > results.length - 1) {
            index = 0;
        }
        setResultIndex(index);
        pageNavigation.jumpToPage(results[index].page_number - 1);
    }

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
            {
                <div className='w-full flex justify-between'>
                    <button className="text-white" onClick={() => handleButtonChange(resultIndex - 1)}>
                        Previous Result
                    </button>
                    <button className='text-white' onClick={() => handleButtonChange(resultIndex + 1)}>
                        Next Result
                    </button>
                </div>

            }
        </div>
    );
}

export default PDFViewerComponent;
