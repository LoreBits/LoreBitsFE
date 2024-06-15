import React, { useState, useCallback, useRef, useEffect } from 'react';


const apiUrl = 'http://127.0.0.1:8000'

function App() {
    const [code, setCode] = useState('');
    const [lores, setLores] = useState([]);
    const [displayIndex, setDisplayIndex] = useState(0);
    const [isLogged, setIsLogged] = useState(false);
    const settingRef = useRef();
    const [settingID, setSettingID] = useState("");

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
        .then(data => shuffle(data.lores)).then( shuffledData => {setLores(shuffledData); console.log(shuffledData)})
        .catch(error => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        if (settingID) {
            handleCodeSubmit(settingID);
        }
    }, [settingID]);

    return (
        <div className="App">
            <SettingPicker
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
           { isLogged ? (             
           <SettingCreationForm handleFunction={createSetting}
            />
            ) : (
            <></> 
            )}
           { isLogged ? (             
           <LoreCreationForm handleFunction={createLore}
            />
            ) : (
            <></> 
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
function SettingCreationForm ({handleFunction}) {
    const title = useRef('');
    const handleSubmit = (e) => {
        e.preventDefault();
        handleFunction(title.current);
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

function LoreCreationForm ({handleFunction}) {
    const content = useRef('');
    const settingID = useRef('');
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(content.current, settingID.current)
        handleFunction(content.current, settingID.current);
    };
    const [settings, setSettings] = useState([]);

    // Fetch the setting from the API when the component mounts
    useEffect(() => {
        // Correcting the API call placement and structure
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/settings/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken") }`
                    },
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSettings(data); // Assuming the API returns an array of setting
                settingID.current = data[0].id;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Using useEffect to handle side effects like fetching data

    return <div><form onSubmit={handleSubmit} className="loreCreation">
            <select id="model-dropdown" name="settingID" onChange={(e) => settingID.current = e.target.value}>
                {settings.map(model => (
                    <option key={model.id} value={model.id}>
                        {model.title} {/* Change `name` to whatever field you want to display */}
                    </option>
            ))}
            </select>
    <input 
                    type="text" 
                    onChange={(e) => content.current = e.target.value}
                    name="content">
                </input>    

    <button type="submit" className="settingPickerButton">Add Lore</button>
    </form>
    </div>
}



function SettingPicker() {

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

function LoreDisplay({ lores, displayIndex, setDisplayIndex }) {
    const [animationPhase, setAnimationPhase] = useState('idle'); // 'idle', 'exiting', 'entering'
    const [displayedText, setDisplayedText] = useState('');
    
    const animation_duration = 1000  // the enter animation duration is 1s

    useEffect(() => {
        if (lores.length > 0) {
            setDisplayedText(lores[0]?.content);
            setAnimationPhase('entering');
        }
    }, [lores]);

    useEffect(() => {
        if (animationPhase === 'idle') {
            setDisplayedText(lores[displayIndex]?.content);
        }
    }, [displayIndex, lores]);
    
    useEffect(() => {
        if (animationPhase === 'idle') {
            setDisplayedText(lores[displayIndex]?.content);
        }
    }, [displayIndex, lores]);

    useEffect(() => {
        if (animationPhase === 'exiting') {
            const nextIndex = (displayIndex + 1) % lores.length;
            let timer = setTimeout(() => {
                setDisplayIndex(nextIndex);
                setAnimationPhase('entering');
                setDisplayedText(lores[nextIndex]?.content);
            }, animation_duration);
            return () => clearTimeout(timer);
        }
    }, [animationPhase, displayIndex, lores]);

    useEffect(() => {
        if (animationPhase === 'entering') {
            const timer = setTimeout(() => {
                setAnimationPhase('idle');
            }, animation_duration);

            return () => clearTimeout(timer);
        }
    }, [animationPhase]);

    return (
        <>
        <div> {settingID} </div>
        <div 
            className="skyrimLoading"
            onClick={() => {
                if (animationPhase === 'idle') {
                    setAnimationPhase('exiting');
                }
            }}
        >
            <p 
                className={`skyrimText ${animationPhase}`} 
            >
                {displayedText}
            </p>
        </div>
        </>
    );
}




}

export default App;