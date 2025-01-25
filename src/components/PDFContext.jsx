// /src/contexts/PDFContext.jsx
import React, { createContext, useContext } from 'react';

const PDFContext = createContext();

export const usePDF = () => useContext(PDFContext);

export const PDFProvider = ({ children, pluginHandle }) => {
    // Navigation Methods using pluginHandle
    const goToNextPage = () => {
        if (pluginHandle && pluginHandle.current) {
            pluginHandle.current.nextPage();
        }
    };

    const goToPrevPage = () => {
        if (pluginHandle && pluginHandle.current) {
            pluginHandle.current.previousPage();
        }
    };

    const goToFirstPage = () => {
        if (pluginHandle && pluginHandle.current) {
            pluginHandle.current.jumpToPage(1);
        }
    };

    const goToLastPage = () => {
        if (pluginHandle && pluginHandle.current) {
            pluginHandle.current.jumpToPage(pluginHandle.current.getPagesCount());
        }
    };

    const goToPage = (pageNumber) => {
        if (pluginHandle && pluginHandle.current) {
            pluginHandle.current.jumpToPage(pageNumber);
        }
    };

    const value = {
        goToNextPage,
        goToPrevPage,
        goToFirstPage,
        goToLastPage,
        goToPage,
    };

    return (
        <PDFContext.Provider value={value}>
            {children}
        </PDFContext.Provider>
    );
};
