import React, { useState } from 'react';
import { PieChartData } from '../../types';

interface PieChartProps {
    data: PieChartData[];
    innerRadius?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, innerRadius = 0 }) => {
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
    const size = 200;
    const radius = 80;
    const cx = size / 2;
    const cy = size / 2;

    const total = data.reduce((sum, d) => sum + d.value, 0);

    const getArcPath = (startAngle: number, endAngle: number, isHovered: boolean) => {
        const currentRadius = isHovered ? radius + 5 : radius;
        const currentInnerRadius = isHovered && innerRadius > 0 ? innerRadius - 5 : innerRadius;

        const start = {
            x: cx + currentRadius * Math.cos(startAngle * Math.PI / 180),
            y: cy + currentRadius * Math.sin(startAngle * Math.PI / 180)
        };
        const end = {
            x: cx + currentRadius * Math.cos(endAngle * Math.PI / 180),
            y: cy + currentRadius * Math.sin(endAngle * Math.PI / 180)
        };
        
        const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

        const d = [
            `M ${start.x} ${start.y}`,
            `A ${currentRadius} ${currentRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
            `L ${cx + currentInnerRadius * Math.cos(endAngle * Math.PI / 180)} ${cy + currentInnerRadius * Math.sin(endAngle * Math.PI / 180)}`,
            `A ${currentInnerRadius} ${currentInnerRadius} 0 ${largeArcFlag} 0 ${cx + currentInnerRadius * Math.cos(startAngle * Math.PI / 180)} ${cy + currentInnerRadius * Math.sin(startAngle * Math.PI / 180)}`,
            'Z'
        ].join(' ');

        return d;
    };
    
    let startAngle = 0;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-full h-full font-sans">
            <div className="relative">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48 transform -rotate-90">
                    {data.map(d => {
                        const angle = (d.value / total) * 360;
                        const endAngle = startAngle + angle;
                        const path = getArcPath(startAngle, endAngle, hoveredSlice === d.label);
                        startAngle = endAngle;

                        return (
                            <path
                                key={d.label}
                                d={path}
                                fill={d.color}
                                onMouseOver={() => setHoveredSlice(d.label)}
                                onMouseOut={() => setHoveredSlice(null)}
                                className="transition-all duration-300 ease-out cursor-pointer"
                            >
                                <title>{`${d.label}: ${d.value.toFixed(1)}%`}</title>
                            </path>
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center max-w-[90%]">
                        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {hoveredSlice ? `${data.find(d=>d.label === hoveredSlice)?.value.toFixed(1)}%` : "Total"}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {hoveredSlice || "100%"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="ml-0 mt-4 md:ml-8 md:mt-0 text-sm">
                {data.map(d => (
                    <div key={d.label} className="flex items-center mb-2" onMouseOver={() => setHoveredSlice(d.label)} onMouseOut={() => setHoveredSlice(null)}>
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                        <span className="text-gray-600 dark:text-gray-300">{d.label}</span>
                        <span className="ml-auto font-medium text-gray-800 dark:text-gray-100">{d.value.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;