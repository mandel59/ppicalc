import React, { useEffect, useState, useCallback } from "react";

export type Props = {
  size?: number;
  width?: number;
  height?: number;
};

const inch2mm = 25.4;

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
            onChange={useCallback((ev) => setSize(Number(ev.target.value)), [])}
          />
        </label>
        <label>
          Width [pixels]
          <input
            type="number"
            id="width"
            name="width"
            value={width}
            onChange={useCallback(
              (ev) => setWidth(Number(ev.target.value)),
              []
            )}
          />
        </label>
        <label>
          Height [pixels]
          <input
            type="number"
            id="height"
            name="height"
            value={height}
            onChange={useCallback(
              (ev) => setHeight(Number(ev.target.value)),
              []
            )}
          />
        </label>
        <div className="grid">
          <button onClick={useCallback(() => setResolution(1280, 720), [])}>
            HD
          </button>
          <button onClick={useCallback(() => setResolution(1920, 1080), [])}>
            FHD
          </button>
          <button onClick={useCallback(() => setResolution(2560, 1440), [])}>
            QHD
          </button>
          <button onClick={useCallback(() => setResolution(3840, 2160), [])}>
            4K
          </button>
        </div>
      </div>
      <div>
        <label>
          Dimension:{" "}
          <output htmlFor="size width height">
            {widthmm.toFixed(1)} mm × {heightmm.toFixed(1)} mm
          </output>
        </label>
        <label>
          Area:{" "}
          <output htmlFor="size width height">{area.toFixed(1)} cm²</output>
        </label>
        <label>
          Pixel count:{" "}
          <output htmlFor="width height">
            {width * height} pixels ={" "}
            {((width * height) / 1_000_000).toFixed(2)} megapixels
          </output>
        </label>
        <label>
          Pixel density:{" "}
          <output htmlFor="size width height">{ppi.toFixed(2)} ppi</output>
        </label>
      </div>
    </div>
  );
}
