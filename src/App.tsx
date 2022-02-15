import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { AuthorizationService } from "./services/AuthorizationService";
import { UserInformation } from "./models/UserInformation";
import axiosClientInstance from "./services/AxiosClient";

function App() {
  const [userInformation, setUserInformation] =
    React.useState<UserInformation | null>(null);

  React.useEffect(() => {
    AuthorizationService.GetCurrentUserInformation().then((userInfo) => {
      setUserInformation(userInfo);
      axiosClientInstance.get("Your API url").then((response) => {
        /*Do something*/
      });
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {userInformation && <p>Hello {userInformation.userId}</p>}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
