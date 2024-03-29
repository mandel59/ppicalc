import { useEffect, useState } from "preact/hooks";
import { useDebouncedCallback } from "use-debounce-preact";

export type Props = {
  size?: number;
  width?: number;
  height?: number;
  distance?: number;
  projectionDistance?: number;
  luminance?: number;
};

// 1in = 2.54cm = 96px
// https://www.w3.org/TR/css-values-3/
const inch2mm = 25.4;
const rad2deg = 180 / Math.PI;
const inch2px = 96;
// The reference pixel is the visual angle of one pixel
// on a device with a device pixel density of 96dpi
// and a distance from the reader of an arm’s length.
// https://www.w3.org/TR/css-values-3/
// Therefore the visual angle of one pixel is calculated as:
// 96px = (1 / 28) rad
// 1px = (1 / (28 * 96)) rad
// assuming the arm’s is 28in.
const armsLength = 28;
const pixelunit = 1 / (armsLength * inch2px);

function gcd(x: number, y: number) {
  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (x < y) {
    const t = y;
    y = x;
    x = t;
  }
  while (y > 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function ratio(x: number, y: number) {
  const d = gcd(x, y);
  return [x / d, y / d];
}

function useNumberInput(id: string, label: any, initialState: number) {
  const [value, setValue] = useState(String(initialState));
  const element = (
    <label>
      {label}
      <input
        type="number"
        id={id}
        name={id}
        min="0"
        value={value}
        onInput={(ev) => setValue((ev.target as HTMLInputElement).value)}
      />
    </label>
  );
  return [Number(value), setValue, element] as const;
}

export function PPICalc(props: Props) {
  const [size, setSize, sizeInput] = useNumberInput(
    "size",
    "Size [inches]",
    props.size ?? 27
  );
  const [width, setWidth, widthInput] = useNumberInput(
    "width",
    "Width [pixels]",
    props.width ?? 1920
  );
  const [height, setHeight, heightInput] = useNumberInput(
    "height",
    "Height [pixels]",
    props.height ?? 1080
  );
  const [distance, setDistance, distanceInput] = useNumberInput(
    "distance",
    "Viewing distance [cm]",
    props.distance ?? 80
  );
  const [luminance, setLuminance, luminanceInput] = useNumberInput(
    "luminance",
    "Peak luminance [cd/m²]",
    props.luminance ?? 200
  );
  useEffect(() => {
    const hash = location.hash;
    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.slice(1));
      const size = params.get("size");
      const width = params.get("width");
      const height = params.get("height");
      const distance = params.get("distance");
      const luminance = params.get("luminance");
      if (size) setSize(size);
      if (width) setWidth(width);
      if (height) setHeight(height);
      if (distance) setDistance(distance);
      if (luminance) setLuminance(luminance);
    }
  }, []);
  const [updateHash] = useDebouncedCallback(
    () => {
      const hash =
        "#" +
        new URLSearchParams([
          ["size", String(size)],
          ["width", String(width)],
          ["height", String(height)],
          ["distance", String(distance)],
          ["luminance", String(luminance)],
        ]).toString();
      history.replaceState(null, "", new URL(hash, location.href).href);
    },
    100,
    [size, width, height, distance, luminance]
  );
  useEffect(updateHash, [size, width, height, distance, luminance]);
  const setResolution = (width: number, height: number) => {
    setWidth(String(width));
    setHeight(String(height));
  };
  const aspectRatio = ratio(width, height);
  const a2 = width ** 2;
  const b2 = height ** 2;
  const c2 = a2 + b2;
  const c = Math.sqrt(c2);
  const widthinch = (size * width) / c;
  const heightinch = (size * height) / c;
  const widthmm = widthinch * inch2mm;
  const heightmm = heightinch * inch2mm;
  const area = (widthmm * heightmm) / 100;
  const ppi = c / size;
  const ppmm = ppi / inch2mm;
  const ppcm = ppmm * 10;
  const mmpp = 1 / ppmm;
  const distancemm = distance * 10;
  const radpp = mmpp / distancemm;
  const dpp = radpp * rad2deg;
  const minpp = dpp * 60;
  const ppd = 1 / dpp;
  const viewangle = 2 * Math.atan2(widthmm / 2, distancemm) * rad2deg;
  const verticalViewangle = 2 * Math.atan2(heightmm / 2, distancemm) * rad2deg;
  const illuminance = Math.PI * luminance;
  const luminousPower = illuminance * (area / 10000);
  const pixelRatio = pixelunit / radpp;
  return (
    <main className="container">
      <h1>PPI Calc</h1>
      <div className="grid">
        <div>
          {sizeInput}
          {widthInput}
          {heightInput}
          <button
            onClick={() =>
              setResolution(
                screen.width * devicePixelRatio,
                screen.height * devicePixelRatio
              )
            }
          >
            Set the width and height of this screen
          </button>
          {distanceInput}
          {luminanceInput}
        </div>
        <div>
          <label>
            Dimensions:{" "}
            <output htmlFor="size width height">
              {widthmm.toFixed(1)} mm × {heightmm.toFixed(1)} mm
            </output>
          </label>
          <label>
            Area:{" "}
            <output htmlFor="size width height">{area.toFixed(1)} cm²</output>
          </label>
          <label>
            Aspect ratio:{" "}
            <output htmlFor="width height">
              {aspectRatio[0]}:{aspectRatio[1]} ≈ {(width / height).toFixed(2)}
            </output>
          </label>
          <label>
            Horizontal angle of view:{" "}
            <output htmlFor="size width height distance">
              {viewangle.toFixed(1)}°
            </output>
          </label>
          <label>
            Vertical angle of view:{" "}
            <output htmlFor="size width height distance">
              {verticalViewangle.toFixed(1)}°
            </output>
          </label>
          <label>
            Pixel count:{" "}
            <output htmlFor="width height">
              {width * height} pixels ≈{" "}
              {((width * height) / 1_000_000).toFixed(2)} megapixels
            </output>
          </label>
          <label>
            Pixel density:{" "}
            <output htmlFor="size width height">
              {ppi.toFixed(1)} ppi ≈ {ppcm.toFixed(1)} pixels/cm
            </output>
          </label>
          <label>
            Pixel pitch:{" "}
            <output htmlFor="size width height">
              {(mmpp * 1000).toFixed(1)} μm
            </output>
          </label>
          <label>
            Angular pixel density:{" "}
            <output htmlFor="size width height distance">
              {ppd.toFixed(2)} ppd
            </output>
          </label>
          <label>
            Pixel angle:{" "}
            <output htmlFor="size width height distance">
              {minpp.toFixed(2)}′ ≈ {(minpp / 60).toFixed(4)}° ≈{" "}
              {(radpp / pixelunit).toFixed(2)} px
            </output>
          </label>
          <label>
            Device pixel ratio:{" "}
            <output htmlFor="size width height distance">
              {pixelRatio.toFixed(2)} pixels/px
            </output>
          </label>
          <label>
            Equivalent visual acuity:{" "}
            <output htmlFor="size width height distance">
              {(1 / minpp).toFixed(2)}
            </output>
          </label>
          <label>
            Equivalent illuminance:{" "}
            <output htmlFor="luminance">{illuminance.toFixed(0)} lx</output>
          </label>
          <label>
            Equivalent luminous power:{" "}
            <output htmlFor="size width height luminance">
              {luminousPower.toFixed(0)} lm
            </output>
          </label>
        </div>
      </div>
    </main>
  );
}
