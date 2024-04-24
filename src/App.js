import React, { useState, useCallback, useRef } from 'react';
import SettingPicker from './SettingPicker';
import LoreDisplay from './LoreDisplay';


const apiUrl = 'http://127.0.0.1:8000'

function App() {
    const [code, setCode] = useState('');
    const [lores, setLores] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [isLogged, setIsLogged] = useState(false);

    const handleLogin = useCallback((email, password) => {
        fetch(`${apiUrl}/api/token/`, 
            {
                headers: {'Content-Type': 'application/json'},
                method: "POST", 
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        )
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("accessToken", data.access)
            localStorage.setItem("refreshToken", data.refresh)
            setIsLogged(true)
        })
        .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleRegistration = useCallback((registerEmail, registerPassword) => {
        fetch(`${apiUrl}/create-user/`, 
        {
            headers: {'Content-Type': 'application/json'},
            method: "POST", 
            body: JSON.stringify({
                email: registerEmail,
                password: registerPassword
            })
        }
    )
    .then(response => response.json())
    .catch(error => console.error("Error fetching data:", error));
}, []);
    

    const shuffle = arr => arr.sort(() => Math.random() - 0.5)

    const refreshAccessToken = () => {
        return fetch(`${apiUrl}/api/token/refresh/`, {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ refresh: localStorage.getItem("refreshToken") })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.access) {
                throw new Error('No access token returned');
            }
            localStorage.setItem("accessToken", data.access)
            localStorage.setItem("refreshToken", data.refresh)
            return data.access
            }
        )
        .catch(error => console.error("Error refreshing token:", error));
    };

    const handleCodeSubmit = (newCode, retry=true, tokenToUse=localStorage.getItem("accessToken")) => {
        setCode(newCode);
        let headers;
        if (tokenToUse) {
            headers = new Headers({
                Authorization: `Bearer ${tokenToUse}`,
            })
        } else {
            headers = new Headers()
        }
        fetch(`${apiUrl}/settings/${code}`, {headers: headers})
        .then(response => {
            if (!response.ok && response.status === 401) {
                if (retry) {
                    return refreshAccessToken().then(newToken =>
                        handleCodeSubmit(newCode, retry=false, tokenToUse=newToken)
                    );
                } else {
                    localStorage.removeItem("accessToken")
                    localStorage.removeItem("refreshToken")
                    throw new Error('Unable to refresh token');
                }
            }
            return response.json()
        })
        .then(data => setLores(shuffle(data.lores)))
        .catch(error => console.error("Error fetching data:", error));
    };

    return (
        <div className="App">
            <SettingPicker
                code={code}
                onCodeChange={setCode}
                onSubmitCode={handleCodeSubmit}
            />
        { isLogged ? ( <></> 
            ) : (
                <UserDataForm
                handleFunction={handleLogin}
                isRegistration={false}
            /> )}
            <LoreDisplay
                lores={lores}
                displayIndex={displayIndex}
                setDisplayIndex={setDisplayIndex}
            />
            { isLogged ? ( <></> 
            ) : (
            <UserDataForm
                handleFunction={handleRegistration}
                isRegistration={true}
            />
            )}
        </div>
    );

function UserDataForm ({handleFunction, isRegistration}) {
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
}

export default App;