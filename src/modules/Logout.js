import React from 'react';

function Logout({setIsLogged}) {
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.setItem("isLogged", false)
        setIsLogged(false)
      };
    
    return (

        <form onSubmit={handleLogout}>
            <button className="settingPickerButton" type="submit">
                Logout
            </button>
        </form>
    );
}

export default Logout;