import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { BarChart3, FileText, Download, Settings2, Minus, Plus, Edit3, RefreshCcw, GripVertical } from 'lucide-react';
import { toSvg } from 'html-to-image';
import { RAW_SEM_DATA } from './constants';
import SemChart from './components/SemChart';

// Helper to extract initial values from constants
const getInitialValue = (from: string, to: string, year: string) => {
  return RAW_SEM_DATA.find(
    d => d.Year === year && d.From === from && d.To === to && d.Type === '直接效应'
  )?.est || 0;
};

// Define structure for our editable data
type YearData = {
  '2013': number;
  '2018': number;
  '2023': number;
};

type AllPathsData = {
  CP_CN: YearData;
  HP_CN: YearData;
  CP_HN: YearData;
  HP_HN: YearData;
};

const App: React.FC = () => {
  
  // -- STATE FOR VISUAL CONTROLS --
  const [xAxisFontSize, setXAxisFontSize] = useState(14);
  const [yAxisFontSize, setYAxisFontSize] = useState(16);
  const [yAxisTitleFontSize, setYAxisTitleFontSize] = useState(16);
  const [descFontSize, setDescFontSize] = useState(16);
  
  // -- STATE FOR CONTAINER WIDTH --
  const [containerWidth, setContainerWidth] = useState(900);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  // -- STATE FOR DATA VALUES --
  const [dataValues, setDataValues] = useState<AllPathsData>({
    CP_CN: {
      '2013': getInitialValue('CP', 'CN', '2013'),
      '2018': getInitialValue('CP', 'CN', '2018'),
      '2023': getInitialValue('CP', 'CN', '2023'),
    },
    HP_CN: {
      '2013': getInitialValue('HP', 'CN', '2013'),
      '2018': getInitialValue('HP', 'CN', '2018'),
      '2023': getInitialValue('HP', 'CN', '2023'),
    },
    CP_HN: {
      '2013': getInitialValue('CP', 'HN', '2013'),
      '2018': getInitialValue('CP', 'HN', '2018'),
      '2023': getInitialValue('CP', 'HN', '2023'),
    },
    HP_HN: {
      '2013': getInitialValue('HP', 'HN', '2013'),
      '2018': getInitialValue('HP', 'HN', '2018'),
      '2023': getInitialValue('HP', 'HN', '2023'),
    },
  });

  // -- REFS --
  const figureRef = useRef<HTMLDivElement>(null);

  // -- RESIZE LOGIC --
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      width: containerWidth
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeStartRef.current) return;
      
      const deltaX = e.clientX - resizeStartRef.current.x;
      // Limit width between 600px and 1600px
      const newWidth = Math.max(600, Math.min(1600, resizeStartRef.current.width + deltaX));
      
      setContainerWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);


  // -- HANDLERS --
  const handleValueChange = (pathKey: keyof AllPathsData, year: keyof YearData, value: string) => {
    const numValue = parseFloat(value);
    setDataValues(prev => ({
      ...prev,
      [pathKey]: {
        ...prev[pathKey],
        [year]: isNaN(numValue) ? 0 : numValue
      }
    }));
  };

  const resetData = () => {
    if (window.confirm('Reset all values to original dataset defaults?')) {
      setDataValues({
        CP_CN: {
          '2013': getInitialValue('CP', 'CN', '2013'),
          '2018': getInitialValue('CP', 'CN', '2018'),
          '2023': getInitialValue('CP', 'CN', '2023'),
        },
        HP_CN: {
          '2013': getInitialValue('HP', 'CN', '2013'),
          '2018': getInitialValue('HP', 'CN', '2018'),
          '2023': getInitialValue('HP', 'CN', '2023'),
        },
        CP_HN: {
          '2013': getInitialValue('CP', 'HN', '2013'),
          '2018': getInitialValue('CP', 'HN', '2018'),
          '2023': getInitialValue('CP', 'HN', '2023'),
        },
        HP_HN: {
          '2013': getInitialValue('HP', 'HN', '2013'),
          '2018': getInitialValue('HP', 'HN', '2018'),
          '2023': getInitialValue('HP', 'HN', '2023'),
        },
      });
    }
  };

  const handleExportSvg = useCallback(async () => {
    if (figureRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toSvg(figureRef.current, {
        backgroundColor: '#ffffff',
        width: containerWidth, // Use the current custom width
        style: {
           fontFamily: '"Times New Roman", Times, serif'
        }
      });
      
      const link = document.createElement('a');
      link.download = 'figure-1-sem-horizontal-stacked.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting SVG:', err);
      alert('Failed to export SVG. Please check console for details.');
    }
  }, [containerWidth]);

  // -- DATA PREPARATION --
  const getYearData = (year: keyof YearData) => {
    return [
      { name: 'CP to CN', value: dataValues.CP_CN[year] },
      { name: 'HP to CN', value: dataValues.HP_CN[year] },
      { name: 'CP to HN', value: dataValues.CP_HN[year] },
      { name: 'HP to HN', value: dataValues.HP_HN[year] },
    ];
  };

  const data2013 = useMemo(() => getYearData('2013'), [dataValues]);
  const data2018 = useMemo(() => getYearData('2018'), [dataValues]);
  const data2023 = useMemo(() => getYearData('2023'), [dataValues]);

  // -- GLOBAL AXIS CALCULATION --
  // Calculate global min/max across all years to ensure alignment
  const axisConfig = useMemo(() => {
    const allValues = [
      ...Object.values(dataValues.CP_CN),
      ...Object.values(dataValues.HP_CN),
      ...Object.values(dataValues.CP_HN),
      ...Object.values(dataValues.HP_HN),
    ] as number[];

    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);

    const step = 0.2;

    // Snapping logic:
    // If Max is 0.56, 0.56/0.2 = 2.8 -> ceil 3 -> 0.6. This removes unnecessary extra space (e.g. 0.8)
    // If Min is -0.07, -0.07/0.2 = -0.35 -> floor -1 -> -0.2.
    
    let maxTick = Math.ceil(dataMax / step) * step;
    let minTick = Math.floor(dataMin / step) * step;

    // Float precision fix
    maxTick = parseFloat(maxTick.toFixed(1));
    minTick = parseFloat(minTick.toFixed(1));

    // Ensure 0 is included
    if (minTick > 0) minTick = 0;
    if (maxTick < 0) maxTick = 0;

    // Generate ticks
    const ticks: number[] = [];
    // Add small epsilon to loop condition to handle floating point discrepancies
    for (let t = minTick; t <= maxTick + 0.05; t += step) {
      ticks.push(parseFloat(t.toFixed(1)));
    }

    return {
      domain: [minTick, maxTick] as [number, number],
      ticks
    };

  }, [dataValues]);


  // -- TABLE DATA --
  const tableRows = useMemo(() => {
    return [
      { path: 'CP to CN', key: 'CP_CN' as keyof AllPathsData },
      { path: 'HP to CN', key: 'HP_CN' as keyof AllPathsData },
      { path: 'CP to HN', key: 'CP_HN' as keyof AllPathsData },
      { path: 'HP to HN', key: 'HP_HN' as keyof AllPathsData },
    ].map(item => ({
      path: item.path,
      '2013': dataValues[item.key]['2013'].toFixed(3),
      '2018': dataValues[item.key]['2018'].toFixed(3),
      '2023': dataValues[item.key]['2023'].toFixed(3),
    }));
  }, [dataValues]);

  // -- HELPER FOR CONTROLS --
  const ControlItem = ({ label, value, setter, min = 8, max = 32 }: any) => (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setter(Math.max(min, value - 1))}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm font-mono w-6 text-center">{value}</span>
        <button 
          onClick={() => setter(Math.min(max, value + 1))}
          className="p-1 rounded hover:bg-gray-100 text-gray-600"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  // Helper for Input Cell
  const InputCell = ({ 
    pathKey, 
    year, 
    label 
  }: { 
    pathKey: keyof AllPathsData; 
    year: keyof YearData; 
    label?: string 
  }) => (
    <div className="relative">
      {label && <span className="block text-xs text-gray-400 mb-1">{label}</span>}
      <input
        type="number"
        step="0.01"
        value={dataValues[pathKey][year]}
        onChange={(e) => handleValueChange(pathKey, year, e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition-all bg-gray-50 hover:bg-white"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              SEM Analysis
            </h1>
          </div>
          
          <button 
            onClick={handleExportSvg}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Export Figure 1 as SVG
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Top Section: Controls & Data Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Visual Settings */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold border-b border-gray-100 pb-2">
              <Settings2 size={18} />
              <h3>Figure Styling (Times New Roman)</h3>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              <ControlItem label="X-Axis (Values)" value={xAxisFontSize} setter={setXAxisFontSize} />
              <ControlItem label="Y-Axis (Labels)" value={yAxisFontSize} setter={setYAxisFontSize} />
              <ControlItem label="Description" value={descFontSize} setter={setDescFontSize} />

              {/* Width Control Manual Input */}
              <div className="flex flex-col gap-1 min-w-[140px]">
                <span className="text-xs text-gray-500 font-medium">Figure Width (px)</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setContainerWidth(Math.max(600, containerWidth - 50))}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-mono w-12 text-center">{Math.round(containerWidth)}</span>
                  <button 
                    onClick={() => setContainerWidth(Math.min(1600, containerWidth + 50))}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

            </div>
            <div className="mt-4 flex items-center gap-4 text-xs">
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4" style={{ backgroundColor: '#3C5488', border: '1px solid #2c3e50' }}></div>
                 <span>Positive (#3C5488)</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4" style={{ backgroundColor: '#E64B35', border: '1px solid #c0392b' }}></div>
                 <span>Negative (#E64B35)</span>
               </div>
            </div>
          </div>

          {/* Data Input Panel */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between gap-2 mb-4 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Edit3 size={18} />
                <h3>Data Input Configuration</h3>
              </div>
              <button 
                onClick={resetData}
                title="Reset to defaults"
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <RefreshCcw size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="font-semibold text-gray-500 pt-6">Path</div>
              <div className="font-semibold text-center text-gray-500">2013</div>
              <div className="font-semibold text-center text-gray-500">2018</div>
              <div className="font-semibold text-center text-gray-500">2023</div>

              {/* Row 1 */}
              <div className="flex items-center font-bold text-slate-700">CP to CN</div>
              <InputCell pathKey="CP_CN" year="2013" />
              <InputCell pathKey="CP_CN" year="2018" />
              <InputCell pathKey="CP_CN" year="2023" />

              {/* Row 2 */}
              <div className="flex items-center font-bold text-slate-700">HP to CN</div>
              <InputCell pathKey="HP_CN" year="2013" />
              <InputCell pathKey="HP_CN" year="2018" />
              <InputCell pathKey="HP_CN" year="2023" />

              {/* Row 3 */}
              <div className="flex items-center font-bold text-slate-700">CP to HN</div>
              <InputCell pathKey="CP_HN" year="2013" />
              <InputCell pathKey="CP_HN" year="2018" />
              <InputCell pathKey="CP_HN" year="2023" />

              {/* Row 4 */}
              <div className="flex items-center font-bold text-slate-700">HP to HN</div>
              <InputCell pathKey="HP_HN" year="2013" />
              <InputCell pathKey="HP_HN" year="2018" />
              <InputCell pathKey="HP_HN" year="2023" />
            </div>
          </div>
        </div>

        {/* Figure 1 Container - EXPORT TARGET + RESIZABLE */}
        <div className="w-full overflow-auto pb-12 px-2">
          
          <div 
             className="relative mx-auto transition-all duration-75"
             style={{ width: containerWidth }}
          >
            {/* The Actual Figure Card */}
            <div 
              ref={figureRef} 
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
              style={{ fontFamily: '"Times New Roman", Times, serif', width: '100%' }}
            >
              {/* Header Section inside Figure */}
              <div className="mb-8 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-black mb-2">
                  Figure 1: Direct Effects by Year
                </h2>
                <p 
                  className="text-gray-700 leading-relaxed"
                  style={{ fontSize: `${descFontSize}px` }}
                >
                  Standardized direct path coefficients from Cooling Patches (CP) and Heating Patches (HP) to network nodes (CN, HN), grouped by year. Blue indicates positive effects; Red indicates negative effects.
                </p>
              </div>

              {/* Stacked Vertical Layout for 3 Horizontal Charts */}
              <div className="flex flex-col gap-10">
                
                {/* Chart 1: 2013 */}
                <div className="flex flex-col md:flex-row gap-4 h-[250px]">
                  <div className="w-12 flex-shrink-0 pt-8">
                    <span className="text-xl font-bold text-black">a</span>
                  </div>
                  <div className="flex-grow h-full">
                    <h3 className="text-lg font-bold text-black mb-2 text-center">2013</h3>
                    <SemChart 
                      data={data2013} 
                      xAxisFontSize={xAxisFontSize}
                      yAxisFontSize={yAxisFontSize}
                      yAxisTitleFontSize={yAxisTitleFontSize}
                      domain={axisConfig.domain}
                      ticks={axisConfig.ticks}
                    />
                  </div>
                </div>

                {/* Chart 2: 2018 */}
                <div className="flex flex-col md:flex-row gap-4 h-[250px]">
                  <div className="w-12 flex-shrink-0 pt-8">
                    <span className="text-xl font-bold text-black">b</span>
                  </div>
                  <div className="flex-grow h-full">
                    <h3 className="text-lg font-bold text-black mb-2 text-center">2018</h3>
                    <SemChart 
                      data={data2018} 
                      xAxisFontSize={xAxisFontSize}
                      yAxisFontSize={yAxisFontSize}
                      yAxisTitleFontSize={yAxisTitleFontSize}
                      domain={axisConfig.domain}
                      ticks={axisConfig.ticks}
                    />
                  </div>
                </div>

                {/* Chart 3: 2023 */}
                <div className="flex flex-col md:flex-row gap-4 h-[250px]">
                  <div className="w-12 flex-shrink-0 pt-8">
                    <span className="text-xl font-bold text-black">c</span>
                  </div>
                  <div className="flex-grow h-full">
                    <h3 className="text-lg font-bold text-black mb-2 text-center">2023</h3>
                    <SemChart 
                      data={data2023} 
                      xAxisFontSize={xAxisFontSize}
                      yAxisFontSize={yAxisFontSize}
                      yAxisTitleFontSize={yAxisTitleFontSize}
                      domain={axisConfig.domain}
                      ticks={axisConfig.ticks}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Visual Drag Handle on the Right */}
            <div 
              className="absolute top-0 right-[-24px] bottom-0 w-6 flex items-center justify-center cursor-ew-resize group select-none"
              onMouseDown={startResizing}
              title="Drag to resize figure width"
            >
              <div className="w-1.5 h-16 bg-slate-300 rounded-full group-hover:bg-slate-500 transition-colors flex items-center justify-center shadow-sm">
                 <GripVertical size={12} className="text-white opacity-0 group-hover:opacity-100" />
              </div>
            </div>

            {/* Tooltip while dragging */}
            {isResizing && (
               <div className="absolute top-[-40px] right-0 bg-slate-800 text-white text-xs px-3 py-1.5 rounded shadow-lg">
                 Width: {Math.round(containerWidth)}px
               </div>
            )}

          </div>
        </div>

        {/* Table Section (Outside Export) */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Table 1: Standardized Direct Path Coefficients
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-t-2 border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-3 font-bold text-base">Path</th>
                    <th className="px-6 py-3 font-bold text-right text-base">2013</th>
                    <th className="px-6 py-3 font-bold text-right text-base">2018</th>
                    <th className="px-6 py-3 font-bold text-right text-base">2023</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-800">
                  {tableRows.map((row, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 text-base">{row.path}</td>
                      <td className="px-6 py-4 text-right text-base">{row['2013']}</td>
                      <td className="px-6 py-4 text-right text-base">{row['2018']}</td>
                      <td className="px-6 py-4 text-right text-base">{row['2023']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;