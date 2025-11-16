import React, { useState, useMemo } from 'react';
import { ScatterPlotData } from '../../types';

interface ScatterPlotProps {
    data: ScatterPlotData[];
    color: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, color }) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    const chartHeight = 200;
    const chartWidth = 400;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    const { points, minX, maxX, minY, maxY, midX, midY } = useMemo(() => {
        if (data.length === 0) {
            return { points: [], minX: 0, maxX: 0, minY: 0, maxY: 0, midX: 0, midY: 0 };
        }

        const allX = data.map(d => d.x);
        const allY = data.map(d => d.y);
        const maxXVal = Math.max(...allX);
        const minXVal = Math.min(...allX);
        const maxYVal = Math.max(...allY);
        const minYVal = Math.min(...allY);
        
        const xRange = maxXVal - minXVal;
        const yRange = maxYVal - minYVal;

        const scaleX = (x: number) => padding.left + ((x - minXVal) / (xRange || 1)) * (chartWidth - padding.left - padding.right);
        const scaleY = (y: number) => padding.top + ((maxYVal - y) / (yRange || 1)) * (chartHeight - padding.top - padding.bottom);
        
        return { 
            points: data.map(d => ({ ...d, cx: scaleX(d.x), cy: scaleY(d.y) })),
            minX: minXVal,
            maxX: maxXVal,
            minY: minYVal,
            maxY: maxYVal,
            midX: scaleX(minXVal + xRange / 2),
            midY: scaleY(minYVal + yRange / 2)
        };
    }, [data]);

    const handleMouseOver = (e: React.MouseEvent, d: ScatterPlotData & { cx: number, cy: number }) => {
        const containerRect = (e.target as SVGCircleElement).closest('svg')?.parentElement?.getBoundingClientRect();
        if(!containerRect) return;

        setTooltip({
            content: `${d.label}: (Comp: ${d.x.toFixed(1)}, Innov: ${d.y.toFixed(1)})`,
            x: d.cx,
            y: d.cy - d.size - 5
        });
    };
    
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                Generating chart data...
            </div>
        );
    }

    return (
        <div className="relative w-full h-full font-sans">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Quadrant Labels */}
                <text x={midX + 5} y={padding.top + 10} className="text-xs font-semibold fill-current text-gray-400 dark:text-gray-500" dominantBaseline="hanging">Leaders</text>
                <text x={padding.left + 5} y={padding.top + 10} className="text-xs font-semibold fill-current text-gray-400 dark:text-gray-500" dominantBaseline="hanging">Innovators</text>
                <text x={padding.left + 5} y={chartHeight - padding.bottom - 5} className="text-xs font-semibold fill-current text-gray-400 dark:text-gray-500">Challengers</text>
                <text x={midX + 5} y={chartHeight - padding.bottom - 5} className="text-xs font-semibold fill-current text-gray-400 dark:text-gray-500">Established</text>

                {/* Axes and Grid Lines */}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} className="stroke-current text-gray-300 dark:text-gray-700" strokeWidth="1" />
                <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} className="stroke-current text-gray-300 dark:text-gray-700" strokeWidth="1" />
                <line x1={midX} y1={padding.top} x2={midX} y2={chartHeight - padding.bottom} className="stroke-current text-gray-300 dark:text-gray-700" strokeWidth="1" strokeDasharray="2" />
                <line x1={padding.left} y1={midY} x2={chartWidth - padding.right} y2={midY} className="stroke-current text-gray-300 dark:text-gray-700" strokeWidth="1" strokeDasharray="2" />

                {/* Axis Labels and Ticks */}
                <text x={(chartWidth + padding.left - padding.right) / 2} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-current text-gray-500 dark:text-gray-400">Competitiveness Score</text>
                <text x={-(padding.top + (chartHeight - padding.top - padding.bottom) / 2)} y="15" textAnchor="middle" transform="rotate(-90)" className="text-xs fill-current text-gray-500 dark:text-gray-400">Innovation Score</text>
                
                <text x={padding.left} y={chartHeight - padding.bottom + 12} textAnchor="middle" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">{minX.toFixed(1)}</text>
                <text x={chartWidth - padding.right} y={chartHeight - padding.bottom + 12} textAnchor="middle" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">{maxX.toFixed(1)}</text>
                <text x={padding.left - 8} y={chartHeight - padding.bottom} textAnchor="end" dominantBaseline="middle" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">{minY.toFixed(1)}</text>
                <text x={padding.left - 8} y={padding.top} textAnchor="end" dominantBaseline="middle" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">{maxY.toFixed(1)}</text>

                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.cx}
                        cy={p.cy}
                        r={p.size}
                        fill={color}
                        fillOpacity={0.6}
                        stroke={color}
                        strokeOpacity={1}
                        strokeWidth="1"
                        onMouseOver={(e) => handleMouseOver(e, p)}
                        onMouseOut={() => setTooltip(null)}
                        className="cursor-pointer transition-transform duration-200 hover:scale-125"
                    >
                         <animate attributeName="r" from="0" to={p.size} dur="0.5s" begin={`${i * 0.02}s`} fill="freeze" />
                    </circle>
                ))}
            </svg>
            {tooltip && (
                <div
                    className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default ScatterPlot;
