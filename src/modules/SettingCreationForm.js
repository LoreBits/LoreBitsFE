import React, { useRef } from 'react';

function SettingCreationForm({ handleFunction }) {
    const title = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(title.current);
        title.current = "";
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <label className="block mb-4 text-sm font-bold">
                    Setting Title
                    <input 
                        type="text" 
                        className="w-full mt-2 p-2 border rounded-md" 
                        onChange={(e) => title.current = e.target.value} 
                        name="title"
                    />
                </label>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add Setting
                </button>
            </form>
        </div>
    );
}

export default SettingCreationForm;
