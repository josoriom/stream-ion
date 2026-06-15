import { useEffect, useRef, useState } from 'react';
import {
  Annotations,
  Axis,
  LineSeries,
  Plot,
  PlotController,
  useAxisWheelZoom,
  useAxisZoom,
} from 'react-plot';
import type { Point } from '../ms/eic';

const plot_height = 460;
const min_width = 320;
const line_style = { stroke: '#6366f1', strokeWidth: 1.5 };

interface ChartProps {
  points: Point[];
  width: number;
}

function Chart({ points, width }: ChartProps) {
  useAxisWheelZoom();
  const zoom = useAxisZoom();

  return (
    <Plot width={width} height={plot_height}>
      <LineSeries data={points} xAxis="x" yAxis="y" lineStyle={line_style} />
      <Axis
        id="x"
        position="bottom"
        label="Time (min)"
        displayPrimaryGridLines={false}
      />
      <Axis id="y" position="left" label="Intensity" displayPrimaryGridLines />
      <Annotations>{zoom.annotations}</Annotations>
    </Plot>
  );
}

interface EicPlotProps {
  points: Point[];
}

export function EicPlot({ points }: EicPlotProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, set_width] = useState(800);

  useEffect(() => {
    const node = wrap.current;
    if (!node) return undefined;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      if (measured) set_width(Math.max(min_width, Math.floor(measured)));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const has_points = points.length > 0;
  return (
    <div ref={wrap} className="plot-wrap">
      {has_points ? (
        <PlotController>
          <Chart points={points} width={width} />
        </PlotController>
      ) : (
        <div className="plot-empty">No signal in this range</div>
      )}
    </div>
  );
}
