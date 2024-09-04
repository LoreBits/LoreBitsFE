import React from 'react';

function Logout({ setIsLogged }) {
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.setItem("isLogged", false);
        setIsLogged(false);
    };

    return (
        <form onSubmit={handleLogout}>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" type="submit">
                Logout
            </button>
        </form>
    );
}

export default Logout;
