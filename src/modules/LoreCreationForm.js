import React, { useRef, useEffect } from 'react';

const apiUrl = 'http://127.0.0.1:8000';

function LoreCreationForm({ handleFunction, setSettings, settings }) {
    const content = useRef('');
    const settingID = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(content.current, settingID.current);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/settings/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSettings(data);
                settingID.current = data[0]?.id || '';
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [setSettings]);

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <label className="block mb-2 text-sm font-bold">
                    Select Setting
                    <select 
                        id="model-dropdown" 
                        name="settingID" 
                        className="block w-full mt-2 p-2 border rounded-md" 
                        onChange={(e) => settingID.current = e.target.value}
                    >
                        {settings.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.title}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="block mb-4 text-sm font-bold">
                    Lore Content
                    <input 
                        type="text" 
                        className="w-full mt-2 p-2 border rounded-md" 
                        onChange={(e) => content.current = e.target.value} 
                        name="content"
                    />
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Lore
                </button>
            </form>
        </div>
    );
}

export default LoreCreationForm;
