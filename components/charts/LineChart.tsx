import React, { useState, useMemo } from 'react';
import { LineChartData } from '../../types';

interface LineChartProps {
    data: LineChartData[];
    color: string;
    strokeStyle?: 'solid' | 'dashed';
}

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
};


const LineChart: React.FC<LineChartProps> = ({ data, color, strokeStyle = 'solid' }) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    const chartHeight = 200;
    const chartWidth = 400;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };

    const { path, points, pathLength, minY, maxY } = useMemo(() => {
        if (data.length === 0) return { path: '', points: [], pathLength: 0, minY: 0, maxY: 0 };
        const maxX = Math.max(...data.map(d => d.x));
        const minX = Math.min(...data.map(d => d.x));
        const maxYVal = Math.max(...data.map(d => d.y));
        const minYVal = Math.min(...data.map(d => d.y));
        const yRange = maxYVal - minYVal;

        const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * (chartWidth - padding.left - padding.right);
        const scaleY = (y: number) => padding.top + ((maxYVal - y) / (yRange || 1)) * (chartHeight - padding.top - padding.bottom);
        
        const scaledPoints = data.map(d => ({ x: scaleX(d.x), y: scaleY(d.y) }));
        
        const pathData = scaledPoints.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');

        // Calculate path length for animation
        let len = 0;
        for (let i = 1; i < scaledPoints.length; i++) {
            const p1 = scaledPoints[i-1];
            const p2 = scaledPoints[i];
            len += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        }

        return { path: pathData, points: scaledPoints, pathLength: len, minY: minYVal, maxY: maxYVal };
    }, [data, padding.top, padding.bottom, padding.left, padding.right, chartHeight, chartWidth]);

    const handleMouseOver = (e: React.MouseEvent, d: LineChartData, p: {x: number, y: number}) => {
        const containerRect = (e.target as SVGCircleElement).closest('svg')?.parentElement?.getBoundingClientRect();
        if(!containerRect) return;

        setTooltip({
            content: `Q${d.x}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.y)}`,
            x: p.x,
            y: p.y - 10
        });
    };

    return (
        <div className="relative w-full h-full font-sans">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                 {/* Axes & Labels */}
                <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} className="stroke-current text-gray-300 dark:text-gray-600" strokeWidth="1" />
                <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} className="stroke-current text-gray-300 dark:text-gray-600" strokeWidth="1" />
                <text x={padding.left - 5} y={padding.top + 5} textAnchor="end" className="text-xs fill-current text-gray-500 dark:text-gray-400">{formatCurrency(maxY)}</text>
                <text x={padding.left - 5} y={chartHeight - padding.bottom} textAnchor="end" className="text-xs fill-current text-gray-500 dark:text-gray-400">{formatCurrency(minY)}</text>


                <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={strokeStyle === 'dashed' ? '5 5' : 'none'}
                    style={{
                        strokeDashoffset: pathLength,
                        strokeDasharray: pathLength
                    }}
                >
                     <animate attributeName="stroke-dashoffset" from={pathLength} to="0" dur="1s" fill="freeze" />
                </path>
                
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill={color}
                        className="opacity-0 cursor-pointer"
                        onMouseOver={(e) => handleMouseOver(e, data[i], p)}
                        onMouseOut={() => setTooltip(null)}
                    >
                         <animate attributeName="opacity" from="0" to="1" dur="0.5s" begin={`${i * 0.05}s`} fill="freeze" />
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

export default LineChart;