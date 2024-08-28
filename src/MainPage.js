import React, { useState, useCallback, useEffect } from 'react';
import LoreCreationForm from './modules/LoreCreationForm';
import LoreDisplay from './modules/LoreDisplay';
import SettingCreationForm from './modules/SettingCreationForm';
import SettingPicker from './modules/SettingPicker';
import Logout from './modules/Logout';
import UserDataForm from './modules/UserDataForm';

const apiUrl = 'http://127.0.0.1:8000'

function MainPage() {
    const [code, setCode] = useState('');
    const [lores, setLores] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [isLogged, setIsLogged] = useState(localStorage.getItem("isLogged"));
    const [settingID, setSettingID] = useState("");
    const [settings, setSettings] = useState([]);

    const apiUrl = 'http://127.0.0.1:8000'

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
            localStorage.setItem("isLogged", true)
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
    

    const createSetting = useCallback((settingTitle) => {
        fetch(`${apiUrl}/settings/`, 
        {
            headers: {'Content-Type': 'application/json' ,'Authorization':`Bearer ${localStorage.getItem("accessToken")}`  },
            method: "POST", 
            body: JSON.stringify({
                title: settingTitle
            })
        }
        )
        .then(response => response.json())
        .catch(error => console.error("Error fetching data:", error));
        }, []);        
    
const createLore = useCallback((content, settingID) => {
    fetch(`${apiUrl}/lores/`, 
    {
        headers: {'Content-Type': 'application/json' ,'Authorization':`Bearer ${localStorage.getItem("accessToken")}`  },
        method: "POST", 
        body: JSON.stringify({
            content: content,
            setting: settingID
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
        fetch(`${apiUrl}/settings/${newCode}`, {headers: headers})
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
            let responseJson = response.json()
            console.log(responseJson)
            return responseJson
        })
        .then(data => shuffle(data.lores)).then( shuffledData => {setLores(shuffledData); console.log(shuffledData)})
        .catch(error => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        if (settingID) {
            handleCodeSubmit(settingID);
        }
        else {setLores([])}
    }, [settingID]);

    return (
        <div className="App">
            <SettingPicker
            setSettingID={setSettingID}
            />
        { !isLogged ? (<></>) : (<Logout setIsLogged={setIsLogged}/>)}
        { isLogged ? ( <></> 
            ) : (
                <UserDataForm
                handleFunction={handleLogin}
                setIsLogged={setIsLogged}
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
                setIsLogged={setIsLogged}
                isRegistration={true}
            />
            )}
           { isLogged ? (             
           <SettingCreationForm handleFunction={createSetting}
            />
            ) : (
            <></> 
            )}
           { isLogged ? (             
           <LoreCreationForm handleFunction={createLore} setSettings={setSettings} settings={settings}
            />
            ) : (
            <></> 
            )}
        </div>
    );



}

export default MainPage;