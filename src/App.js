import React, { useState } from 'react';
import SettingPicker from './SettingPicker';
import LoreDisplay from './LoreDisplay';

function App() {
    const [code, setCode] = useState('');
    const [fetchTrigger, setFetchTrigger] = useState(false);

    const handleCodeSubmit = (newCode) => {
        setCode(newCode);
        setFetchTrigger(prev => !prev);  // Toggle the fetchTrigger
    };

    return (
        <div className="App">
            <SettingPicker 
                code={code} 
                onCodeChange={setCode} 
                onSubmitCode={handleCodeSubmit} 
            />
            <LoreDisplay code={code} fetchTrigger={fetchTrigger} />
        </div>
    );
}

export default App;