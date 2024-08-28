import {React, useState, useEffect} from 'react';

function SettingPanel() {
    const apiUrl = 'http://127.0.0.1:8000'
    const [settings, setSettings] = useState([]);
    // const [settingID, setSettingID] = useState("");

    useEffect(() => {
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
                setSettings(data);
                // settingID.current = data[0].id;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Using useEffect to handle side effects like fetching data
    

    const handleDelete = async (loreId, settingTitle) => {
        try {
          const response = await fetch(`${apiUrl}/lores/${loreId}/destroy`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken") }`
            },
          });
    
          if (response.ok) {
            setSettings(prevSettings =>
              prevSettings.map(setting =>
                setting.title === settingTitle
                  ? { ...setting, lores: setting.lores.filter(lore => lore.id !== loreId) }
                  : setting
              )
            );
          } else {
            console.error('Failed to delete the lore.');
          }
        } catch (error) {
          console.error('There was an error deleting the lore!', error);
        }
      };

  return (
    <div>
  {settings.map(setting => (
    <div key={setting.title}>
      <h2>{setting.title}</h2>
      <ol>
        {setting.lores.map((lore, index) => (
            <li key={lore.id}>
              {lore.content}
              <button onClick={() => handleDelete(lore.id, setting.title)}>Usuń</button>
            </li>

        ))}
      </ol>
    </div>
  ))}
</div>
  );
}

export default SettingPanel;