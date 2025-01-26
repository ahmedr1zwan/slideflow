import React from 'react'
import "./output.css";
import { Layout } from './Layout.tsx';
import { RecordingPage } from './pages/RecordingPage.tsx';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About.tsx';
import "./scrollbar.css";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
                <Route path="get-started" element={<RecordingPage />} />
            </Route>
        </Routes>
    )
}

export default App