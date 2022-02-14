import "@picocss/pico";
import { render } from "preact";
import { PPICalc } from "./ppicalc";

render(
  <main className="container">
    <h1>PPI Calc</h1>
    <PPICalc />
  </main>,
  document.getElementById("approot")!
);
