import React from "react";

export type Props = {
  size?: number;
  width?: number;
  height?: number;
};

export type State = {
  size: number;
  width: number;
  height: number;
};

export class PPICalc extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      size: props.size ?? 27,
      width: props.width ?? 1920,
      height: props.height ?? 1080,
    };
  }
  setResolution(width: number, height: number) {
    this.setState({ width, height });
  }
  dpi() {
    return (
      Math.sqrt(this.state.width ** 2 + this.state.height ** 2) /
      this.state.size
    );
  }
  componentDidMount() {
    const hash = location.hash;
    if (hash.startsWith("#")) {
      const params = new URLSearchParams(hash.slice(1));
      const size = params.get("size");
      const width = params.get("width");
      const height = params.get("height");
      if (size) this.setState({ size: Number(size) });
      if (width) this.setState({ width: Number(width) });
      if (height) this.setState({ height: Number(height) });
    }
  }
  componentDidUpdate() {
    const hash =
      "#" +
      new URLSearchParams(
        Object.entries(this.state).map<[string, string]>(([k, v]) => [
          k,
          String(v),
        ])
      ).toString();
    history.replaceState(null, "", new URL(hash, location.href).href);
  }
  render() {
    return (
      <div className="grid">
        <div>
          <label>
            Size [inches]
            <input
              type="number"
              id="size"
              name="size"
              value={this.state.size}
              onChange={(ev) =>
                this.setState({ size: Number(ev.target.value) })
              }
            />
          </label>
          <label>
            Width [pixels]
            <input
              type="number"
              id="width"
              name="width"
              value={this.state.width}
              onChange={(ev) =>
                this.setState({ width: Number(ev.target.value) })
              }
            />
          </label>
          <label>
            Height [pixels]
            <input
              type="number"
              id="height"
              name="height"
              value={this.state.height}
              onChange={(ev) =>
                this.setState({ height: Number(ev.target.value) })
              }
            />
          </label>
          <div className="grid">
            <button onClick={() => this.setResolution(1280, 720)}>HD</button>
            <button onClick={() => this.setResolution(1920, 1080)}>FHD</button>
            <button onClick={() => this.setResolution(2560, 1440)}>QHD</button>
            <button onClick={() => this.setResolution(3840, 2160)}>4K</button>
          </div>
        </div>
        <label>
          Resolution{" "}
          <output htmlFor="size width height">
            {this.dpi().toFixed(2)} ppi
          </output>
        </label>
      </div>
    );
  }
}
