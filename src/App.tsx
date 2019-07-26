import React from 'react'

import { AthomCloudAPI, HomeyAPI } from 'athom-api'
import Dashboard from './Dashboard';


const App = () => {

  const [homeyAPI, setHomeyAPI] = React.useState<null | HomeyAPI>(null);

  AthomCloudAPI.setConfig({
    clientId: "5a8d4ca6eb9f7a2c9d6ccf6d",
    clientSecret: "e3ace394af9f615857ceaa61b053f966ddcfb12a",
    autoRefreshTokens: true,
  });
  
  const cloudAPI = new AthomCloudAPI({
    redirectUrl: 'http://localhost'
  });

  const login = async () => {
    if(!await cloudAPI.isLoggedIn()) {
      if(cloudAPI.hasAuthorizationCode()) {
        await cloudAPI.authenticateWithAuthorizationCode();
      } else {
        window.location.href = cloudAPI.getLoginUrl({
          scopes: [
            'account.homeys.readonly',
            'homey.manager.flows.readonly',
            'homey.insights.readonly',
          ]
        });
      }
    }

    const user = await cloudAPI.getAuthenticatedUser();
    console.info('User', user, 'Authenticated');

    //Get the first homey of this user
    const homey = user.getFirstHomey();

    //Start a session on this Homey
    console.info('Logging in to:', homey.resourceId);
    const homeyAPI = await homey.authenticate();

    console.info('homeyAPI created', homeyAPI);

    setHomeyAPI(homeyAPI);
  }

  if(!homeyAPI) login();

  return (
    <>
    {homeyAPI ? (
      <Dashboard homeyAPI={homeyAPI} />
    ) : (
      <p>Starting up...</p>
    )
    } 
    </>
  )
}

export default App
