





import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import ScatterPlot from '../components/charts/ScatterPlot';
import { SparklesIcon, Cog6ToothIcon, DocumentTextIcon, ArrowUpTrayIcon, CloseIcon, SpinnerIcon } from '../components/Icons';
// Fix: Imported 'generateResponse' to be used for chart analysis.
import { generateDataFromText, analyzeGeneratedChartData, generateResponse } from '../services/geminiService';
import { fileToGenerativePart } from '../utils/helpers';
import { AllChartData, BarChartData, LineChartData, PieChartData, ScatterPlotData } from '../types';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">{title}</h3>
        <div className="h-64 flex items-center justify-center">
            {children}
        </div>
    </div>
);

const CustomizationSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 first:pt-0 first:border-t-0">
        <h3 className="font-semibold mb-3 text-lg text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const CustomizationInput: React.FC<{label: string, type: 'text'|'color'|'range'|'select', name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, options?: {value: string, label: string}[], min?: number, max?: number, step?: number}> = ({ label, type, name, value, onChange, options, min, max, step }) => (
    <div className="flex items-center justify-between gap-4">
        <label htmlFor={name} className="text-sm text-gray-600 dark:text-gray-300 flex-shrink-0">{label}</label>
        {type === 'color' ? (
             <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-9 h-9 p-0 border-none rounded-md bg-transparent cursor-pointer"/>
        ) : type === 'range' ? (
            <div className="flex items-center gap-2 w-full sm:w-2/3">
                <input type="range" id={name} name={name} value={value} min={min} max={max} step={step} onChange={onChange} className="w-full" />
                <span className="text-xs w-8 text-right">{value}</span>
            </div>
        ) : type === 'text' ? (
            <input type="text" id={name} name={name} value={value} onChange={onChange} className="w-full sm:w-2/3 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-1 focus:ring-econify-blue focus:outline-none" />
        ) : (
             <select id={name} name={name} value={value} onChange={onChange} className="w-full sm:w-2/3 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md focus:ring-1 focus:ring-econify-blue focus:outline-none">
                {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        )}
    </div>
);

const ModeButton: React.FC<{isActive: boolean, onClick: () => void, children: React.ReactNode, title: string, description: string}> = ({isActive, onClick, children, title, description}) => (
    <button onClick={onClick} className={`flex flex-col md:flex-row items-center text-left p-4 rounded-lg border-2 transition-all duration-200 ${isActive ? 'bg-econify-blue/10 border-econify-blue' : 'bg-white/50 dark:bg-gray-800/50 border-transparent hover:border-econify-blue/50'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${isActive ? 'bg-econify-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
            {children}
        </div>
        <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
    </button>
);

const ChartSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-56 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
);


const DataVizPage: React.FC = () => {
    const [mode, setMode] = useState<'DATA_TO_CHART' | 'CHART_TO_DATA'>('DATA_TO_CHART');
    const [dataToChartInput, setDataToChartInput] = useState<string>("Create a dashboard for a tech startup: 📈 Monthly recurring revenue (MRR) for the past year. 🍰 A pie chart of our top 5 marketing expense categories. 🚀 A line chart showing user growth over 12 months.");
    const [uploadedChart, setUploadedChart] = useState<File | null>(null);
    const [uploadedChartPreview, setUploadedChartPreview] = useState<string | null>(null);
    const [chartData, setChartData] = useState<AllChartData | null>(null);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCustomizing, setIsCustomizing] = useState(false);

    const chartsContainerRef = useRef<HTMLDivElement>(null);
    const analysisRef = useRef<HTMLDivElement>(null);
    
    const [chartOptions, setChartOptions] = useState({
        barChart: { title: 'Sales Comparison by Product', positiveColor: '#2D6CF6', negativeColor: '#FF3A3A' },
        lineChart: { title: 'Monthly Revenue Over Time', color: '#1EC8C8', strokeStyle: 'solid' as 'solid' | 'dashed' },
        pieChart: { title: 'Expense Breakdown by Category', colors: ['#2D6CF6', '#1EC8C8', '#FF7A3D', '#FFC107', '#673AB7'], innerRadius: 50 },
        scatterPlot: { title: 'Marketing Spend and User Sign-ups', color: '#2D6CF6' },
    });

    const resetForNewAction = () => {
        setAnalysis(null);
        setError(null);
    };

    const handleModeChange = (newMode: 'DATA_TO_CHART' | 'CHART_TO_DATA') => {
        setMode(newMode);
        resetForNewAction();
        setChartData(null);
        setUploadedChart(null);
        setUploadedChartPreview(null);
    };

    const handleGenerateCharts = async () => {
        if (!dataToChartInput.trim()) {
            setError("Please enter a description to generate charts.");
            return;
        }
        setIsGenerating(true);
        setChartData(null);
        resetForNewAction();

        setTimeout(() => {
            chartsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        try {
            const result = await generateDataFromText(dataToChartInput);
            const fullBarData: BarChartData[] = result.barData.map(d => ({...d, color: ''}));
            const fullPieData: PieChartData[] = result.pieData.map(d => ({...d, color: ''}));

            setChartData({...result, barData: fullBarData, pieData: fullPieData});
        } catch (err) {
            console.error("Chart generation failed:", err);
            setError(err instanceof Error ? err.message : "An error occurred while generating charts.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleAnalyzeChart = async () => {
        if (!uploadedChart) {
            setError("Please upload a chart image to analyze.");
            return;
        }
        setIsAnalyzing(true);
        resetForNewAction();
        
        setTimeout(() => {
            analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        try {
            const imagePart = await fileToGenerativePart(uploadedChart);
            const prompt = "Analyze this chart image in detail. Describe the type of chart, the data it represents, any discernible trends, key takeaways, and potential implications.";
            const response = await generateResponse(prompt, [], 'image', imagePart);
            setAnalysis(response.text);
        } catch (err) {
            console.error("Chart analysis failed:", err);
            setError("An error occurred during analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyzeGeneratedData = useCallback(async () => {
        if (!chartData) return;
        setIsAnalyzing(true);
        resetForNewAction();

        setTimeout(() => {
            analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        try {
            // Fix: Added the missing 'chartOptions' argument to the function call.
             const result = await analyzeGeneratedChartData(chartData, chartOptions);
            setAnalysis(result);
        } catch (err) {
            console.error("Analysis failed:", err);
            setError("An error occurred while generating the analysis. Please check your API key or network and try again.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [chartData, chartOptions]);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedChart(file);
            setUploadedChartPreview(URL.createObjectURL(file));
            setAnalysis(null);
            setError(null);
        }
    };

    const handleOptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [chart, option] = name.split('.');
        const parsedValue = e.target.type === 'range' ? parseInt(value, 10) : value;

        setChartOptions(prev => ({
            ...prev,
            [chart]: { ...prev[chart as keyof typeof prev], [option]: parsedValue },
        }));
    }, []);

    const handlePieColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const index = parseInt(name.split('.')[2], 10);
        
        setChartOptions(prev => {
            const newColors = [...prev.pieChart.colors];
            newColors[index] = value;
            return { ...prev, pieChart: { ...prev.pieChart, colors: newColors } };
        });
    }, []);

    const barData = chartData?.barData.map(d => ({ ...d, color: d.value >= 0 ? chartOptions.barChart.positiveColor : chartOptions.barChart.negativeColor })) || [];
    const pieData = chartData?.pieData.map((d, i) => ({ ...d, color: chartOptions.pieChart.colors[i] || '#8A99A6' })) || [];

    return (
        <div className="py-12 md:py-20 animate-fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">AI-Powered Data Viz 📊</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Turn text into stunning charts or get instant analysis on your chart images.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto">
                    <ModeButton isActive={mode === 'DATA_TO_CHART'} onClick={() => handleModeChange('DATA_TO_CHART')} title="Data to Charts" description="Describe data and let AI create charts.">
                        <DocumentTextIcon className="w-6 h-6"/>
                    </ModeButton>
                    <ModeButton isActive={mode === 'CHART_TO_DATA'} onClick={() => handleModeChange('CHART_TO_DATA')} title="Chart to Data" description="Upload a chart image for AI analysis.">
                        <ArrowUpTrayIcon className="w-6 h-6"/>
                    </ModeButton>
                </div>

                {mode === 'DATA_TO_CHART' ? (
                    <div className="mt-8">
                        <div className="max-w-4xl mx-auto">
                            <textarea
                                value={dataToChartInput}
                                onChange={(e) => setDataToChartInput(e.target.value)}
                                placeholder="e.g., 'Chart the GDP growth for USA and China for the last 5 years'..."
                                className="w-full p-4 text-base bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:ring-2 focus:ring-econify-blue focus:outline-none resize-vertical min-h-[100px]"
                                rows={4}
                                disabled={isGenerating || isAnalyzing}
                            />
                            <button onClick={handleGenerateCharts} disabled={isGenerating || isAnalyzing} className="mt-4 w-full flex items-center justify-center gap-2 bg-econify-blue text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isGenerating ? <><SpinnerIcon className="w-5 h-5" /> Generating...</> : 'Generate Charts'}
                            </button>
                        </div>

                        <div ref={chartsContainerRef}>
                            {isGenerating && (
                                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <ChartSkeleton />
                                    <ChartSkeleton />
                                    <ChartSkeleton />
                                    <ChartSkeleton />
                                </div>
                            )}
                            {chartData && (
                                <>
                                    <div className="text-center mt-8 flex flex-wrap justify-center items-center gap-4">
                                         <button onClick={handleAnalyzeGeneratedData} disabled={isGenerating || isAnalyzing} className="inline-flex items-center gap-2 bg-ai-teal text-white font-semibold px-6 py-2 rounded-full hover:bg-teal-600 transition-all duration-300 disabled:bg-gray-400">
                                            {isAnalyzing ? <SpinnerIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                                            {isAnalyzing ? 'Analyzing...' : 'Generate AI Analysis'}
                                        </button>
                                         <button onClick={() => setIsCustomizing(!isCustomizing)} className="inline-flex items-center gap-2 bg-gray-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-600 transition-all">
                                            <Cog6ToothIcon className="w-5 h-5" />
                                            Customize Charts
                                        </button>
                                    </div>
                                    {isCustomizing && (
                                        <div className="mt-8 max-w-5xl mx-auto bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg animate-fade-in-up">
                                            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Chart Customization</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                <CustomizationSection title="Sales Chart">
                                                    <CustomizationInput label="Title" type="text" name="barChart.title" value={chartOptions.barChart.title} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Positive Color" type="color" name="barChart.positiveColor" value={chartOptions.barChart.positiveColor} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Negative Color" type="color" name="barChart.negativeColor" value={chartOptions.barChart.negativeColor} onChange={handleOptionChange} />
                                                </CustomizationSection>
                                                <CustomizationSection title="Revenue Chart">
                                                    <CustomizationInput label="Title" type="text" name="lineChart.title" value={chartOptions.lineChart.title} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Line Color" type="color" name="lineChart.color" value={chartOptions.lineChart.color} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Line Style" type="select" name="lineChart.strokeStyle" value={chartOptions.lineChart.strokeStyle} onChange={handleOptionChange} options={[{value: 'solid', label: 'Solid'}, {value: 'dashed', label: 'Dashed'}]} />
                                                </CustomizationSection>
                                                <CustomizationSection title="Expenses Chart">
                                                    <CustomizationInput label="Title" type="text" name="pieChart.title" value={chartOptions.pieChart.title} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Inner Radius" type="range" name="pieChart.innerRadius" value={chartOptions.pieChart.innerRadius} min={0} max={60} step={5} onChange={handleOptionChange} />
                                                    {pieData.map((slice, index) => (
                                                         <CustomizationInput key={slice.label} label={`${slice.label} Color`} type="color" name={`pieChart.colors.${index}`} value={chartOptions.pieChart.colors[index]} onChange={handlePieColorChange} />
                                                    ))}
                                                </CustomizationSection>
                                                <CustomizationSection title="Marketing Chart">
                                                    <CustomizationInput label="Title" type="text" name="scatterPlot.title" value={chartOptions.scatterPlot.title} onChange={handleOptionChange} />
                                                    <CustomizationInput label="Point Color" type="color" name="scatterPlot.color" value={chartOptions.scatterPlot.color} onChange={handleOptionChange} />
                                                </CustomizationSection>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <ChartCard title={chartOptions.barChart.title}><BarChart data={barData} /></ChartCard>
                                        <ChartCard title={chartOptions.lineChart.title}><LineChart data={chartData.lineData} color={chartOptions.lineChart.color} strokeStyle={chartOptions.lineChart.strokeStyle} /></ChartCard>
                                        <ChartCard title={chartOptions.pieChart.title}><PieChart data={pieData} innerRadius={chartOptions.pieChart.innerRadius} /></ChartCard>
                                        <ChartCard title={chartOptions.scatterPlot.title}><ScatterPlot data={chartData.scatterData} color={chartOptions.scatterPlot.color}/></ChartCard>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : ( // CHART_TO_DATA mode
                    <div className="mt-8 max-w-4xl mx-auto">
                         <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center bg-white/50 dark:bg-gray-800/50">
                             <input type="file" id="chart-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                             {!uploadedChartPreview ? (
                                <>
                                    <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400" />
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">Click to upload or drag and drop a chart image.</p>
                                    <button onClick={() => document.getElementById('chart-upload')?.click()} className="mt-4 bg-econify-blue text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700">
                                        Select File
                                    </button>
                                </>
                             ) : (
                                <div className="relative inline-block">
                                    <img src={uploadedChartPreview} alt="Uploaded chart" className="max-w-full max-h-80 rounded-lg shadow-md" />
                                    <button onClick={() => { setUploadedChart(null); setUploadedChartPreview(null); }} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-900">
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                </div>
                             )}
                        </div>
                        <button onClick={handleAnalyzeChart} disabled={isAnalyzing || isGenerating || !uploadedChart} className="mt-4 w-full flex items-center justify-center gap-2 bg-ai-teal text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-600 transition-all disabled:bg-gray-400">
                            {isAnalyzing ? <><SpinnerIcon className="w-5 h-5" /> Analyzing...</> : <><SparklesIcon className="w-5 h-5"/>Analyze Chart</>}
                        </button>
                    </div>
                )}

                {(analysis || isAnalyzing || error) &&
                    <div className="mt-12" ref={analysisRef}>
                        <div className="bg-white dark:bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg min-h-[10rem] flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI-Powered Insight</h2>
                            {isAnalyzing && !analysis && (
                                <div className="animate-pulse flex space-x-4">
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                                    </div>
                                </div>
                            )}
                            {error && <div className="text-center p-4 bg-negative/10 text-negative rounded-lg"><p>{error}</p></div>}
                            {analysis && (
                                 <div className="text-gray-700 dark:text-gray-300 space-y-2">
                                    {analysis.split('\n').map((line, index) => {
                                        if (line.startsWith('###')) return <h3 key={index} className="text-xl font-semibold text-gray-800 dark:text-gray-100 pt-4 first:pt-0">{line.replace('###', '').trim()}</h3>
                                        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <p key={index} className="pl-4">{line}</p>
                                        if (line.trim() === '') return null;
                                        return <p key={index}>{line}</p>
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default DataVizPage;