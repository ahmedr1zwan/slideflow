import React, { useState } from 'react';
import { motion } from "framer-motion";

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
            setStep(2);
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
        <div className="p-4 w-1/2 mx-auto">
            <form className="space-y-4">
                <label className="text-lg font-semibold block font-quicksand text-white">
                    Upload PDF or PPTX:
                </label>
                <div className="relative w-full">
                    {/* Hidden native file input */}
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFile}
                        accept=".pdf,.pptx"
                    />
                    {/* Custom styled button */}
                    <motion.label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-[#38bdf8] to-[#34d399] hover:cursor-pointer text-black font-montserrat rounded-lg cursor-pointer focus:outline-none"
                        initial={{
                            scale: 1
                        }}
                        whileHover={{
                            scale: 1.03,
                            transition: {
                                duration: 0.25
                            }
                        }}
                        whileTap={{
                            scale: 0.98,
                            transition: {
                                duration: 0.125
                            }  
                        }}
                    >
                        {/* Image Icon */}
                        <img
                            src="/images/uploadBlack.svg"
                            alt="Upload"
                            className="w-6 h-6 mr-2"
                        />
                        <span>Upload File</span>
                    </motion.label>
                </div>
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