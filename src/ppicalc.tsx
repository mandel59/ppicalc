import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export type Props = {
  size?: number;
  width?: number;
  height?: number;
  distance?: number;
};

const inch2mm = 25.4;
const rad2deg = 180 / Math.PI;

const resolutions: [name: string, width: number, height: number][] = [
  ["HD", 1280, 720],
  ["FHD", 1920, 1080],
  ["QHD", 2560, 1440],
  ["4K", 3840, 2160],
  ["8K", 7680, 4320],
];

export function PPICalc(props: Props) {
  const [size, setSize] = useState(props.size ?? 27);
  const [width, setWidth] = useState(props.width ?? 1920);
  const [height, setHeight] = useState(props.height ?? 1080);
  const [distance, setDistance] = useState(props.distance ?? 50);
  useEffect(() => {
    const hash = location.hash;
    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.slice(1));
      const size = params.get("size");
      const width = params.get("width");
      const height = params.get("height");
      const distance = params.get("distance");
      if (size) setSize(Number(size));
      if (width) setWidth(Number(width));
      if (height) setHeight(Number(height));
      if (distance) setDistance(Number(distance));
    }
  }, []);
  useEffect(
    useDebouncedCallback(() => {
      const hash =
        "#" +
        new URLSearchParams([
          ["size", String(size)],
          ["width", String(width)],
          ["height", String(height)],
          ["distance", String(distance)],
        ]).toString();
      history.replaceState(null, "", new URL(hash, location.href).href);
    }, 100),
    [size, width, height, distance]
  );
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
  const ppmm = ppi / inch2mm;
  const mmpp = 1 / ppmm;
  const distancemm = distance * 10;
  const radpp = mmpp / distancemm;
  const minpp = radpp * rad2deg * 60;
  const viewangle = 2 * Math.atan2(widthmm / 2, distancemm) * rad2deg;
  return (
    <div className="grid">
      <div>
        <label>
          Size [inches]
          <input
            type="number"
            id="size"
            name="size"
            min="0"
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
            min="0"
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
            min="0"
            value={height}
            onChange={(ev) => setHeight(Number(ev.target.value))}
          />
        </label>
        <label>
          Distance [cm]
          <input
            type="number"
            id="distance"
            name="distance"
            min="0"
            value={distance}
            onChange={(ev) => setDistance(Number(ev.target.value))}
          />
        </label>
        <div className="grid">
          {resolutions.map(([name, width, height]) => (
            <button onClick={() => setResolution(width, height)}>{name}</button>
          ))}
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
          Horizontal angle of view:{" "}
          <output htmlFor="size width height distance">
            {viewangle.toFixed(1)}°
          </output>
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
          <output htmlFor="size width height">
            {ppi.toFixed(2)} ppi = {ppmm.toFixed(2)} pixels/mm
          </output>
        </label>
        <label>
          Pixel pitch:{" "}
          <output htmlFor="size width height">
            {(mmpp * 1000).toFixed(1)} μm
          </output>
        </label>
        <label>
          Pixel angle:{" "}
          <output htmlFor="size width height distance">
            {minpp.toFixed(2)}′ = {(minpp / 60).toFixed(4)}°
          </output>
        </label>
        <label>
          Equivalent eyesight:{" "}
          <output htmlFor="size width height distance">
            {(1 / minpp).toFixed(2)}
          </output>
        </label>
      </div>
    </div>
  );
}
