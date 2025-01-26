import React, { useState } from 'react';

export const Step0 = ({ setRole, setStep }) => {
    return (
        // This is the step where the user selects their role (Presenter or Audience)
        <div>
            <p className="text-4xl font-bold text-white text-center mt-16">You're the:</p>
            {/* Or make this a toggle + confirm tbh */}
            <div className="flex justify-center mt-8 gap-12">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl" onClick={() => { setRole('Presenter'); setStep(1); }}>Presenter</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl" onClick={() => { setRole('Audience'); setStep(1); }}>Audience</button>
            </div>

        </div>
    );
}

export default Step0;