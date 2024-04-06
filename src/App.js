import React, { useState } from 'react';
import SettingPicker from './SettingPicker';
import LoreDisplay from './LoreDisplay';


const apiUrl = 'http://127.0.0.1:8000'

function App() {
    const [code, setCode] = useState('');
    const [lores, setLores] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogged, setIsLogged] = useState(false);

    const handleLogin = (email, password) => {
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
    }

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

    const handleCodeSubmit = (newCode, retry=true, tokenToUse=localStorage.getItem("refreshToken")) => {
        setCode(newCode);
        fetch(`${apiUrl}/settings/${code}`, {headers: new Headers({
            Authorization: `Bearer ${tokenToUse}`,
        })})
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
            { isLogged ? ( <SettingPicker
                code={code}
                onCodeChange={setCode}
                onSubmitCode={handleCodeSubmit}
            />
            ) : (
                <LoginButton
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
            /> )}
            <LoreDisplay
                lores={lores}
                displayIndex={displayIndex}
                setDisplayIndex={setDisplayIndex}
            />
        </div>
    );
}

function LoginButton ({handleLogin, email, setEmail, password, setPassword}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password);
    };
    
    return <div><form onSubmit={handleSubmit}  className="settingPickerForm">
    <input 
        type="text" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email">
    </input>
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password">
    </input>
    <button type="submit" className="settingPickerButton">sign in</button>
    </form>
    </div>
}

export default App;