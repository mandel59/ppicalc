import "@picocss/pico";
import { render } from "preact";
import { PPICalc } from "./ppicalc";

render(<PPICalc />, document.getElementById("approot")!);
