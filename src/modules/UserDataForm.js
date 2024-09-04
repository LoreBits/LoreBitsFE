import React, { useRef } from 'react';

function UserDataForm({ handleFunction, isRegistration, setIsLogged }) {
    const email = useRef('');
    const password = useRef('');

    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(email.current, password.current);
    };

    const buttonText = isRegistration ? "Sign Up" : "Sign In";

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <label className="block mb-4 text-sm font-bold">
                    Email:
                    <input 
                        type="email" 
                        className="w-full mt-2 p-2 border rounded-md" 
                        onChange={(e) => email.current = e.target.value} 
                        name="email"
                    />
                </label>
                <label className="block mb-4 text-sm font-bold">
                    Password:
                    <input 
                        type="password" 
                        className="w-full mt-2 p-2 border rounded-md" 
                        onChange={(e) => password.current = e.target.value} 
                        name="password"
                    />
                </label>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {buttonText}
                </button>
            </form>
        </div>
    );
}

export default UserDataForm;
