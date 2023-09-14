import React, { useState } from 'react';
import SettingPicker from './SettingPicker';
import LoreDisplay from './LoreDisplay';

function App() {
    const [code, setCode] = useState('');
    const [lores, setLores] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);


    const shuffle = arr => arr.sort(() => Math.random() - 0.5)

    const handleCodeSubmit = (newCode) => {
        setCode(newCode);
        fetch(`http://127.0.0.1:8000/settings/${code}`)
        .then(response => response.json())
        .then(data => setLores(shuffle(data.lores)))
        .catch(error => console.error("Error fetching data:", error));
    };
    

    return (
        <div className="App">
            <SettingPicker 
                code={code} 
                onCodeChange={setCode} 
                onSubmitCode={handleCodeSubmit} 
            />
            <LoreDisplay lores={lores} displayIndex={displayIndex} setDisplayIndex={setDisplayIndex} />
        </div>
    );
}

export default App;