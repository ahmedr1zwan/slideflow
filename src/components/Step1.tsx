import React, { useState } from 'react';
import axios from 'axios';

export const Step1 = ({ setStep, setPdfFile, pdfError, setPdfError }) => {
    const [loading, setLoading] = useState(false);

    // Only accept PDF and PPTX
    const allowedFiles = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    const handleFile = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) {
            alert('Please upload a file.');
            return;
        }

        // Check MIME type
        if (!allowedFiles.includes(selectedFile.type)) {
            setPdfError('Invalid file type. Please upload a PDF or PPTX file.');
            setPdfFile('');
            return;
        }

        // Clear any previous error
        setPdfError('');

        if (selectedFile.type === 'application/pdf') {
            // We already have a PDF, just convert to base64 or store the blob URL.
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = () => {
                if (reader.result) {
                    setPdfFile(reader.result as string);
                }
            };
        } else if (
            selectedFile.type ===
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('File', selectedFile);

                // The backend endpoint will handle .pptx to .pdf conversions

                // Currently does not work
                // Try ?Secret=... if ?auth=... doesn’t work
                // const response = await axios.post(
                //     'https://v2.convertapi.com/convert/pptx/to/pdf?Secret=secret_6r2cLaES5Deas1F2',
                //     formData,
                //     {
                //         headers: {
                //             'Content-Type': 'multipart/form-data',
                //         },
                //     }
                // );

            } catch (error) {
                console.error(error);
                setPdfError('Error converting PPTX to PDF. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="p-4">
            <form className="space-y-4">
                <label className="text-lg font-semibold block">
                    Upload PDF or PPTX
                </label>
                <input
                    type="file"
                    className="form-control file-input file-input-bordered w-full"
                    onChange={handleFile}
                    accept=".pdf,.pptx"
                />
                {loading && (
                    <p className="text-blue-500">
                        Converting PPTX to PDF. Please wait...
                    </p>
                )}
                {pdfError && <p className="text-red-500">{pdfError}</p>}
            </form>
        </div>
    );
};

export default Step1;