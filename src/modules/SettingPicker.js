import React, {useRef} from 'react';


function SettingPicker({setSettingID}) {
    const settingRef = useRef();

    const handleFetchSetting = (event) => {
        event.preventDefault();
        const settingID = settingRef.current.value
        setSettingID(settingID);
      };
    


    return (
        <form onSubmit={handleFetchSetting} className="settingPickerForm">
            <label>
                Setting code:
                <input 
                    type="text" 
                    ref={settingRef} 
                    className="settingPickerInput"
                />
            </label>
            <button className="settingPickerButton" type="submit">
                Go
            </button>
        </form>
    );
}


export default SettingPicker;