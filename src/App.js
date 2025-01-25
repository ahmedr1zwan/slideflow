import React from 'react'
import "./output.css";
import { Layout } from './Layout.tsx';
import { RecordingPage } from './pages/RecordingPage.tsx';
import { Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<RecordingPage />} />
            </Route>
        </Routes>
    )
}

export default App