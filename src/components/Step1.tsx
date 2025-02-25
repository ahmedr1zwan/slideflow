import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';

export const Step1 = ({ setStep, setPdfFile, pdfError, setPdfError, pdfTotalPages, setPdfTotalPages, pdfRoutes, setPdfRoutes }) => {
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

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            // When the file is read, set the PDF file and upload it to the server
            reader.onloadend = async () => {
                if (reader.result) {
                    setPdfFile(reader.result as string);
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    try {
                        const response = await axios.post(
                            'http://127.0.0.1:5000/pdf/upload',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }
                        );
                        // Log the response to check if the API call was successful
                        console.log('File upload response:', response.data);
                        setPdfRoutes((prev) => [...prev, response.data.path]);

                        const response2 = await axios.post(
                            'http://127.0.0.1:5000/pdf/analyze',
                            {
                                file_path: response.data.path, // Send the path directly in JSON format
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json', // Set the content type to JSON
                                },
                            }
                        );
                        console.log('Analyze response:', response2.data);

                        // Check whether `slide_number` or `pages` is present in the response
                        if (response2.data.slide_number !== undefined) {
                            setPdfTotalPages(response2.data.slide_number);
                        } else if (Array.isArray(response2.data.data.pages)) {
                            setPdfTotalPages(response2.data.data.pages.length);
                        } else {
                            console.error('Unexpected response format:', response2.data);
                        }
                        setStep(2);
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            };
        } else if (selectedFile.type ===
            'application/vnd.openxmlformats-officedocument.presentationml.presentation') {

            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);

            // When the file is read, set the PDF file and upload it to the server
            reader.onloadend = async () => {
                if (reader.result) {
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    console.log("File successful set, attempting to upload pptx file");
                    const response = await axios.post(
                        'http://127.0.0.1:5000/pptx_to_pdf/convert',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    console.log('File convert response:', response.data);

                    setPdfFile(response.data);

                }
            };

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