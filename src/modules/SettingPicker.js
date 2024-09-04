import React, { useRef } from 'react';

function SettingPicker({ setSettingID }) {
    const settingRef = useRef();

    const handleFetchSetting = (event) => {
        event.preventDefault();
        const settingID = settingRef.current.value;
        setSettingID(settingID);
    };

    return (
        <form onSubmit={handleFetchSetting} className="bg-white p-6 rounded-lg shadow-md flex">
            <label className="mr-2 text-sm font-bold">
                Setting Code:
                <input 
                    type="text" 
                    ref={settingRef} 
                    className="ml-2 p-2 border rounded-md"
                />
            </label>
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ml-4" type="submit">
                Go
            </button>
        </form>
    );
}

export default SettingPicker;
