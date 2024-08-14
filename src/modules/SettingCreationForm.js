import React, {useRef} from 'react';

function SettingCreationForm ({handleFunction}) {
    const title = useRef('');
    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(title.current);
        title.current = ""
    };

    return <div><form onSubmit={handleSubmit} className="settingCreation">
    <input 
                    type="text" 
                    onChange={(e) => title.current = e.target.value}
                    name="title">
                </input>
    <button type="submit" className="settingPickerButton">Add Setting</button>
    </form>
    </div>
}

export default SettingCreationForm;