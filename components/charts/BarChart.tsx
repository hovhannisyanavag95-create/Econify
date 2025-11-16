import React, { useState } from 'react';
import { BarChartData } from '../../types';

// Helper to format large numbers into a compact currency format (e.g., $1.2M)
const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
};


interface BarChartProps {
    data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);
    const chartHeight = 200;
    const chartWidth = 400;
    const barWidth = 30;
    const barMargin = 15;
    const chartPadding = { top: 20, right: 20, bottom: 50, left: 50 }; // Increased bottom & left padding

    const maxValue = Math.max(...data.map(d => d.value), 0);
    const minValue = Math.min(...data.map(d => d.value), 0);
    const valueRange = maxValue - minValue;
    
    const scaleY = (value: number) => chartPadding.top + ((maxValue - value) / (valueRange || 1)) * (chartHeight - chartPadding.top - chartPadding.bottom);
    const zeroLine = scaleY(0);

    const handleMouseOver = (e: React.MouseEvent, d: BarChartData) => {
        const rect = (e.target as SVGRectElement).getBoundingClientRect();
        const containerRect = (e.target as SVGRectElement).closest('svg')?.parentElement?.getBoundingClientRect();
        if(!containerRect) return;

        setTooltip({
            content: `${d.label}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(d.value)}`,
            x: rect.x - containerRect.left + rect.width / 2,
            y: rect.y - containerRect.top - 10,
        });
    };

    return (
        <div className="relative w-full h-full font-sans">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Y-Axis */}
                <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartHeight - chartPadding.bottom} className="stroke-current text-gray-300 dark:text-gray-600" strokeWidth="1" />
                <line x1={chartPadding.left} y1={zeroLine} x2={chartWidth - chartPadding.right} y2={zeroLine} className="stroke-current text-gray-300 dark:text-gray-600" strokeWidth="1" strokeDasharray="2" />
                <text x={chartPadding.left - 5} textAnchor="end" y={chartPadding.top + 5} className="text-xs fill-current text-gray-500 dark:text-gray-400">{formatCurrency(maxValue)}</text>
                <text x={chartPadding.left - 5} textAnchor="end" y={chartHeight - chartPadding.bottom} className="text-xs fill-current text-gray-500 dark:text-gray-400">{formatCurrency(minValue)}</text>

                {data.map((d, i) => {
                    const x = chartPadding.left + i * (barWidth + barMargin) + barMargin;
                    const y = d.value >= 0 ? scaleY(d.value) : zeroLine;
                    const height = Math.abs(scaleY(d.value) - zeroLine);

                    return (
                        <g key={d.label}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                fill={d.color}
                                onMouseOver={(e) => handleMouseOver(e, d)}
                                onMouseOut={() => setTooltip(null)}
                                className="transition-all duration-300 ease-out"
                            >
                                <animate attributeName="height" from="0" to={height} dur="0.5s" fill="freeze" />
                                <animate attributeName="y" from={zeroLine} to={y} dur="0.5s" fill="freeze" />
                            </rect>
                            <text 
                                x={x + barWidth / 2} 
                                y={chartHeight - chartPadding.bottom + 10} 
                                textAnchor="end" 
                                className="text-xs fill-current text-gray-500 dark:text-gray-400"
                                transform={`rotate(-45 ${x + barWidth / 2} ${chartHeight - chartPadding.bottom + 10})`}
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
            {tooltip && (
                <div
                    className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default BarChart;