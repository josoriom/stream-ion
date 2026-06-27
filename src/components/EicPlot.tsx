import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Annotation,
  Annotations,
  Axis,
  LineSeries,
  Plot,
  PlotController,
  useAxisWheelZoom,
  useAxisZoom,
} from "react-plot";
import type { Point } from "../ms/eic";
import type { Peak } from "../ms/peaks";

const plotHeight = 460;
const minWidth = 320;
const lineStyle = { stroke: "#334155", strokeWidth: 1.5 };
const baselineStyle = { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 4" };
const peakFill = "rgba(51, 65, 85, 0.16)";
const peakStroke = "#334155";
const annotateStroke = "#2563eb";

function topIntensity(points: Point[]): number {
  let top = 0;
  for (const point of points) {
    if (point.y > top) top = point.y;
  }
  return top;
}

interface ChartProps {
  points: Point[];
  peaks: Peak[];
  baseline: Point[] | null;
  annotateRt: number | null;
  width: number;
}

function Chart({ points, peaks, baseline, annotateRt, width }: ChartProps) {
  useAxisWheelZoom();
  const zoom = useAxisZoom();
  const top = useMemo(() => topIntensity(points), [points]);

  return (
    <Plot width={width} height={plotHeight}>
      <LineSeries data={points} xAxis="x" yAxis="y" lineStyle={lineStyle} />
      {baseline && <LineSeries data={baseline} xAxis="x" yAxis="y" lineStyle={baselineStyle} />}
      <Axis id="x" position="bottom" label="Time (min)" displayPrimaryGridLines={false} />
      <Axis id="y" position="left" label="Intensity" displayPrimaryGridLines />
      <Annotations>
        {annotateRt !== null && (
          <Annotation.Line
            x1={annotateRt}
            x2={annotateRt}
            y1={0}
            y2={top}
            color={annotateStroke}
            strokeDasharray="5 4"
          />
        )}
        {peaks.flatMap((peak, index) => [
          <Annotation.Rectangle
            key={`box-${index}`}
            x1={peak.from}
            x2={peak.to}
            y1={0}
            y2={peak.intensity}
            color={peakFill}
          />,
          <Annotation.Line
            key={`apex-${index}`}
            x1={peak.rt}
            x2={peak.rt}
            y1={0}
            y2={peak.intensity}
            color={peakStroke}
            strokeDasharray="3 3"
          />,
        ])}
        {zoom.annotations}
      </Annotations>
    </Plot>
  );
}

interface EicPlotProps {
  points: Point[];
  peaks: Peak[];
  baseline: Point[] | null;
  annotateRt: number | null;
}

export const EicPlot = memo(function EicPlot({
  points,
  peaks,
  baseline,
  annotateRt,
}: EicPlotProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const node = wrap.current;
    if (!node) return undefined;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width;
      if (measured) setWidth(Math.max(minWidth, Math.floor(measured)));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasPoints = points.length > 0;
  return (
    <div ref={wrap} className="plot-wrap">
      {hasPoints ? (
        <PlotController>
          <Chart
            points={points}
            peaks={peaks}
            baseline={baseline}
            annotateRt={annotateRt}
            width={width}
          />
        </PlotController>
      ) : (
        <div className="plot-empty">No signal in this range</div>
      )}
    </div>
  );
});
