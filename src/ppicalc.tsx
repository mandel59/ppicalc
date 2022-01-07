import React, { useEffect, useState } from "react";

export type Props = {
  size?: number;
  width?: number;
  height?: number;
};

export function PPICalc(props: Props) {
  const [size, setSize] = useState(props.size ?? 27);
  const [width, setWidth] = useState(props.width ?? 1920);
  const [height, setHeight] = useState(props.height ?? 1080);
  useEffect(() => {
    const hash = location.hash;
    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.slice(1));
      const size = params.get("size");
      const width = params.get("width");
      const height = params.get("height");
      if (size) setSize(Number(size));
      if (width) setWidth(Number(width));
      if (height) setHeight(Number(height));
    }
  }, []);
  useEffect(() => {
    const hash =
      "#" +
      new URLSearchParams([
        ["size", String(size)],
        ["width", String(width)],
        ["height", String(height)],
      ]).toString();
    history.replaceState(null, "", new URL(hash, location.href).href);
  }, [size, width, height]);
  const setResolution = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  };
  const ppi = Math.sqrt(width ** 2 + height ** 2) / size;
  return (
    <div className="grid">
      <div>
        <label>
          Size [inches]
          <input
            type="number"
            id="size"
            name="size"
            value={size}
            onChange={(ev) => setSize(Number(ev.target.value))}
          />
        </label>
        <label>
          Width [pixels]
          <input
            type="number"
            id="width"
            name="width"
            value={width}
            onChange={(ev) => setWidth(Number(ev.target.value))}
          />
        </label>
        <label>
          Height [pixels]
          <input
            type="number"
            id="height"
            name="height"
            value={height}
            onChange={(ev) => setHeight(Number(ev.target.value))}
          />
        </label>
        <div className="grid">
          <button onClick={() => setResolution(1280, 720)}>HD</button>
          <button onClick={() => setResolution(1920, 1080)}>FHD</button>
          <button onClick={() => setResolution(2560, 1440)}>QHD</button>
          <button onClick={() => setResolution(3840, 2160)}>4K</button>
        </div>
      </div>
      <label>
        Resolution{" "}
        <output htmlFor="size width height">{ppi.toFixed(2)} ppi</output>
      </label>
    </div>
  );
}
