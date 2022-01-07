import "@picocss/pico";
import React from "react";
import ReactDom from "react-dom";
import { PPICalc } from "./ppicalc";

ReactDom.render(
  <React.StrictMode>
    <main className="container">
      <h1>PPI Calc</h1>
      <PPICalc />
    </main>
  </React.StrictMode>,
  document.getElementById("approot")
);
