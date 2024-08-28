import React, {useRef} from 'react';

function UserDataForm ({handleFunction, isRegistration, setIsLogged}) {
    const email = useRef('');
    const password = useRef('');
    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(email.current, password.current);
    };
    const className = isRegistration ? "registrationForm" : "loginForm"
    const buttonText = isRegistration ? "sign up" : "sign in" 
    
    return <div><form onSubmit={handleSubmit} className={className}>
    <input 
                    type="text" 
                    onChange={(e) => email.current = e.target.value}
                    name="email">
                </input>
                <input 
                    type="password" 
                    onChange={(e) => password.current = e.target.value}
                    name="password">
                </input>
    <button type="submit" className="settingPickerButton">{buttonText}</button>
    </form>
    </div>
}

export default UserDataForm;