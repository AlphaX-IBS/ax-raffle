import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <IntlProvider locale="en">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </IntlProvider>,
  document.getElementById("root")
);
registerServiceWorker();
