import React, { useMemo, useRef, useState, useCallback } from 'react';
import { BarChart3, FileText, Download, Settings2, Minus, Plus, Edit3, RefreshCcw } from 'lucide-react';
import { toSvg } from 'html-to-image';
import { RAW_SEM_DATA } from './constants';
import SemChart, { BarConfig } from './components/SemChart';

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
  const [yAxisFontSize, setYAxisFontSize] = useState(14);
  const [yAxisTitleFontSize, setYAxisTitleFontSize] = useState(16);
  const [descFontSize, setDescFontSize] = useState(16);

  // -- STATE FOR DATA VALUES --
  // Initialize state from the constants.ts file
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

  // -- EXPORT FUNCTION --
  const handleExportSvg = useCallback(async () => {
    if (figureRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toSvg(figureRef.current, {
        backgroundColor: '#ffffff',
        style: {
           fontFamily: '"Times New Roman", Times, serif'
        }
      });
      
      const link = document.createElement('a');
      link.download = 'figure-1-sem-analysis-4-panels.svg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting SVG:', err);
      alert('Failed to export SVG. Please check console for details.');
    }
  }, []);

  // -- DATA PREPARATION FOR CHARTS --

  const getChartData = (pathKey: keyof AllPathsData, dataKey: string) => {
    const years: (keyof YearData)[] = ['2013', '2018', '2023'];
    return years.map(year => ({
      year,
      [dataKey]: dataValues[pathKey][year]
    }));
  };

  const dataCpCn = useMemo(() => getChartData('CP_CN', 'CP'), [dataValues.CP_CN]);
  const dataHpCn = useMemo(() => getChartData('HP_CN', 'HP'), [dataValues.HP_CN]);
  const dataCpHn = useMemo(() => getChartData('CP_HN', 'CP'), [dataValues.CP_HN]);
  const dataHpHn = useMemo(() => getChartData('HP_HN', 'HP'), [dataValues.HP_HN]);

  // -- TABLE DATA --
  const tableRows = useMemo(() => {
    return [
      { path: 'CP → CN', key: 'CP_CN' as keyof AllPathsData },
      { path: 'HP → CN', key: 'HP_CN' as keyof AllPathsData },
      { path: 'CP → HN', key: 'CP_HN' as keyof AllPathsData },
      { path: 'HP → HN', key: 'HP_HN' as keyof AllPathsData },
    ].map(item => ({
      path: item.path,
      '2013': dataValues[item.key]['2013'].toFixed(3),
      '2018': dataValues[item.key]['2018'].toFixed(3),
      '2023': dataValues[item.key]['2023'].toFixed(3),
    }));
  }, [dataValues]);

  // -- CONFIGURATION --
  // Nature Publishing Group (NPG) inspired palette
  const palette = {
    npgBlue: '#4DBBD5',    // CP -> CN
    npgGreen: '#00A087',   // HP -> CN
    npgDarkBlue: '#3C5488',// CP -> HN
    npgRed: '#E64B35',     // HP -> HN
  };

  // Distinct configurations for each chart
  const barCpCn: BarConfig[] = [{ key: 'CP', name: 'CP Effect', color: palette.npgBlue }];
  const barHpCn: BarConfig[] = [{ key: 'HP', name: 'HP Effect', color: palette.npgGreen }];
  const barCpHn: BarConfig[] = [{ key: 'CP', name: 'CP Effect', color: palette.npgDarkBlue }];
  const barHpHn: BarConfig[] = [{ key: 'HP', name: 'HP Effect', color: palette.npgRed }];

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
              <ControlItem label="X-Axis Font" value={xAxisFontSize} setter={setXAxisFontSize} />
              <ControlItem label="Y-Axis Label" value={yAxisFontSize} setter={setYAxisFontSize} />
              <ControlItem label="Y-Axis Title" value={yAxisTitleFontSize} setter={setYAxisTitleFontSize} />
              <ControlItem label="Description" value={descFontSize} setter={setDescFontSize} />
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
              <div className="flex items-center font-bold text-slate-700">CP → CN</div>
              <InputCell pathKey="CP_CN" year="2013" />
              <InputCell pathKey="CP_CN" year="2018" />
              <InputCell pathKey="CP_CN" year="2023" />

              {/* Row 2 */}
              <div className="flex items-center font-bold text-slate-700">HP → CN</div>
              <InputCell pathKey="HP_CN" year="2013" />
              <InputCell pathKey="HP_CN" year="2018" />
              <InputCell pathKey="HP_CN" year="2023" />

              {/* Row 3 */}
              <div className="flex items-center font-bold text-slate-700">CP → HN</div>
              <InputCell pathKey="CP_HN" year="2013" />
              <InputCell pathKey="CP_HN" year="2018" />
              <InputCell pathKey="CP_HN" year="2023" />

              {/* Row 4 */}
              <div className="flex items-center font-bold text-slate-700">HP → HN</div>
              <InputCell pathKey="HP_HN" year="2013" />
              <InputCell pathKey="HP_HN" year="2018" />
              <InputCell pathKey="HP_HN" year="2023" />
            </div>
          </div>
        </div>

        {/* Figure 1 Container - EXPORT TARGET */}
        <div 
          ref={figureRef} 
          className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-12"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {/* Header Section inside Figure */}
          <div className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-black mb-2">
              Figure 1: Direct Effects by Path
            </h2>
            <p 
              className="text-gray-700 leading-relaxed"
              style={{ fontSize: `${descFontSize}px` }}
            >
              Standardized direct path coefficients from Cooling Patches (CP) and Heating Patches (HP) to network nodes.
            </p>
          </div>

          {/* 2x2 Grid Layout for 4 Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            
            {/* Chart 1: CP -> CN */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-black">a</span>
                <h3 className="text-lg font-bold text-black">
                  CP → CN
                </h3>
              </div>
              <div className="h-[300px] w-full bg-white border border-gray-100 rounded-lg p-2">
                <SemChart 
                  data={dataCpCn} 
                  bars={barCpCn}
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  yAxisTitleFontSize={yAxisTitleFontSize}
                />
              </div>
            </div>

            {/* Chart 2: HP -> CN */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-black">b</span>
                <h3 className="text-lg font-bold text-black">
                  HP → CN
                </h3>
              </div>
              <div className="h-[300px] w-full bg-white border border-gray-100 rounded-lg p-2">
                <SemChart 
                  data={dataHpCn} 
                  bars={barHpCn} 
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  yAxisTitleFontSize={yAxisTitleFontSize}
                />
              </div>
            </div>

            {/* Chart 3: CP -> HN */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-black">c</span>
                <h3 className="text-lg font-bold text-black">
                  CP → HN
                </h3>
              </div>
              <div className="h-[300px] w-full bg-white border border-gray-100 rounded-lg p-2">
                <SemChart 
                  data={dataCpHn} 
                  bars={barCpHn} 
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  yAxisTitleFontSize={yAxisTitleFontSize}
                />
              </div>
            </div>

            {/* Chart 4: HP -> HN */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-black">d</span>
                <h3 className="text-lg font-bold text-black">
                   HP → HN
                </h3>
              </div>
              <div className="h-[300px] w-full bg-white border border-gray-100 rounded-lg p-2">
                <SemChart 
                  data={dataHpHn} 
                  bars={barHpHn} 
                  xAxisFontSize={xAxisFontSize}
                  yAxisFontSize={yAxisFontSize}
                  yAxisTitleFontSize={yAxisTitleFontSize}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Table Section (Outside Export) */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-slate-600" />
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Table 1: Standardized Direct Path Coefficients (Preview)
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