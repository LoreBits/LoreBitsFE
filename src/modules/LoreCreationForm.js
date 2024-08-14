import React, {useRef, useEffect} from 'react';

const apiUrl = 'http://127.0.0.1:8000'

function LoreCreationForm ({handleFunction, setSettings, settings}) {
    const content = useRef('');
    const settingID = useRef('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(content.current, settingID.current)
        handleFunction(content.current, settingID.current);
        };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/settings/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken") }`
                    },
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSettings(data);
                settingID.current = data[0].id;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Using useEffect to handle side effects like fetching data

    return <div><form onSubmit={handleSubmit} className="loreCreation">
            <select id="model-dropdown" name="settingID" onChange={(e) => settingID.current = e.target.value}>
                {settings.map(model => (
                    <option key={model.id} value={model.id}>
                        {model.title}
                    </option>
            ))}
            </select>
            <input 
                    type="text" 
                    onChange={(e) => content.current = e.target.value}
                    name="content">
                </input>    

    <button type="submit" className="settingPickerButton">Add Lore</button>
    </form>
    </div>
}

export default LoreCreationForm;