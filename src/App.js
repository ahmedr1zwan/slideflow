import React from 'react'
import "./output.css";
import { Layout } from './Layout.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { Route, Routes } from 'react-router-dom';
import About from './pages/About.tsx';
import "./scrollbar.css";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
            </Route>
        </Routes>
    )
}

export default App