import React from 'react';

function SettingPicker({ code, onCodeChange, onSubmitCode }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitCode(code);
    };

    return (
        <form onSubmit={handleSubmit} className="settingPickerForm">
            <label>
                Setting code:
                <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => onCodeChange(e.target.value)} 
                    className="settingPickerInput"
                />
            </label>
            <button type="submit" className="settingPickerButton">
                Go
            </button>
        </form>
    );
}

export default SettingPicker;