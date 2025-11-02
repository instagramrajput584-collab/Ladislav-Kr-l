import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarEventData, FullNameDay } from '../types';
import { fetchCalendarData, fetchAllNameDays, generateWish } from '../services/geminiService';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import { CalendarDaysIcon, GlobeAltIcon, GiftIcon, SparklesIcon, ClipboardIcon } from '../components/icons';

const countries = [
    "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia",
    "Croatia", "Czech Republic", "Denmark", "Finland", "France", "Germany", "Greece", "Hungary",
    "India", "Ireland", "Italy", "Japan", "Mexico", "Netherlands", "New Zealand", "Norway", "Poland",
    "Portugal", "Russia", "Slovakia", "South Korea", "Spain", "Sweden", "Switzerland", "Turkey",
    "United Kingdom", "United States"
];

const EventCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; className?: string; }> = ({ title, children, icon, className = '' }) => (
    <Card className={`flex-1 min-w-[280px] ${className}`}>
        <div className="p-5">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-bold text-neutral ml-3">{title}</h3>
            </div>
            <div className="text-gray-700 text-base">
                {children}
            </div>
        </div>
    </Card>
);

const WishGeneratorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    name: string;
    country: string;
}> = ({ isOpen, onClose, name, country }) => {
    const [style, setStyle] = useState('heartfelt');
    const [wish, setWish] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setWish('');
                setError(null);
                setCopied(false);
            }, 300);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setWish('');
        setCopied(false);
        try {
            const result = await generateWish(name, country, style);
            setWish(result);
        } catch (err: any) {
            setError(err.message || 'Failed to generate wish.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(wish);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative transition-all duration-300 ${isOpen ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-200 transition-colors">&times;</button>
                <h3 className="text-2xl font-bold text-neutral mb-2">AI Wish Generator</h3>
                <p className="text-gray-600 mb-6">Create a special wish for <span className="font-semibold text-primary">{name}</span>!</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="wish-style" className="block mb-2 font-semibold text-gray-700">Select a style:</label>
                        <select id="wish-style" value={style} onChange={e => setStyle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-light transition">
                            <option value="heartfelt">Heartfelt</option>
                            <option value="funny">Funny</option>
                            <option value="formal">Formal</option>
                            <option value="poetic">Poetic</option>
                        </select>
                    </div>
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-200/80 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center disabled:opacity-50 transform hover:scale-105 duration-300">
                        {isGenerating ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2"/>Generate Wish</>}
                    </button>
                </div>

                {(wish || error || isGenerating) && (
                    <div className="mt-6 p-4 bg-base-100 rounded-lg min-h-[100px] flex flex-col justify-center">
                        {isGenerating && <p className="text-gray-500 text-center animate-pulse">AI is thinking...</p>}
                        {error && <p className="text-red-600 text-center">{error}</p>}
                        {wish && (
                            <div>
                                <p className="text-gray-800 whitespace-pre-wrap">{wish}</p>
                                <div className="text-right mt-2">
                                    <button onClick={handleCopy} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-md text-sm flex items-center ml-auto transition-colors">
                                        <ClipboardIcon className="w-4 h-4 mr-1.5"/>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const GlobalCalendar: React.FC = () => {
  const [view, setView] = useState<'daily' | 'browse'>('daily');
  
  const [selectedCountry, setSelectedCountry] = useState<string>('Czech Republic');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarData, setCalendarData] = useState<CalendarEventData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  const [browseCountry, setBrowseCountry] = useState<string>('Czech Republic');
  const [allNameDays, setAllNameDays] = useState<FullNameDay[] | null>(null);
  const [isBrowsing, setIsBrowsing] = useState<boolean>(false);
  const [browseError, setBrowseError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleOpenModal = (name: string) => {
    setSelectedName(name);
    setIsModalOpen(true);
  };

  const getCalendarEvents = useCallback(async () => {
    if (!selectedCountry || !selectedDate) return;
    setIsLoading(true);
    setError(null);
    setShowResults(false);
    try {
      const dateObj = new Date(selectedDate);
      const data = await fetchCalendarData(selectedCountry, dateObj);
      setCalendarData(data);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedDate]);
  
  useEffect(() => {
    if (view === 'daily') {
        getCalendarEvents();
    }
  }, []);

  const getAllNameDays = useCallback(async () => {
    setIsBrowsing(true);
    setBrowseError(null);
    setAllNameDays(null);
    try {
        const data = await fetchAllNameDays(browseCountry);
        setAllNameDays(data);
    } catch (err: any) {
        setBrowseError(err.message || 'An unexpected error occurred.');
    } finally {
        setIsBrowsing(false);
    }
  }, [browseCountry]);

  const groupedNameDays = useMemo(() => {
    if (!allNameDays) return {};
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const groups: { [key: string]: FullNameDay[] } = {};
    allNameDays.forEach(day => {
      const monthIndex = parseInt(day.date.split('-')[0], 10) - 1;
      const monthName = monthNames[monthIndex];
      if (monthName) {
        if (!groups[monthName]) groups[monthName] = [];
        groups[monthName].push(day);
        groups[monthName].sort((a, b) => parseInt(a.date.split('-')[1]) - parseInt(b.date.split('-')[1]));
      }
    });
    return groups;
  }, [allNameDays]);

  const monthOrder = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);

  return (
    <>
    <WishGeneratorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={selectedName}
        country={selectedCountry}
    />
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold text-neutral mb-2">Global Calendar</h1>
      <p className="text-lg text-gray-500 mb-8">Discover holidays and name days from around the world.</p>
      
      <div className="mb-8 p-1.5 bg-base-200 rounded-xl flex items-center max-w-sm">
        <button onClick={() => setView('daily')} className={`w-1/2 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${view === 'daily' ? 'bg-white shadow-md text-primary' : 'text-gray-500'}`}>
          Daily Events
        </button>
        <button onClick={() => setView('browse')} className={`w-1/2 py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${view === 'browse' ? 'bg-white shadow-md text-primary' : 'text-gray-500'}`}>
          Browse Name Days
        </button>
      </div>

      {view === 'daily' && (
        <>
          <Card className="p-6 mb-8 bg-white/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="flex flex-col">
                <label htmlFor="country-select" className="mb-2 font-semibold text-gray-700">Country</label>
                <select id="country-select" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-light transition">
                  {countries.map(country => (<option key={country} value={country}>{country}</option>))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="date-input" className="mb-2 font-semibold text-gray-700">Date</label>
                <input id="date-input" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-light transition"/>
              </div>
              <button onClick={getCalendarEvents} disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200/80">
                {isLoading ? <Spinner /> : 'Search'}
              </button>
            </div>
          </Card>

          {isLoading && <div className="mt-10"><Spinner /></div>}
          {error && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          
          <div className={`transition-all duration-500 ${showResults && calendarData ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
            {calendarData && (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-neutral">Results for {selectedCountry}</h2>
                <p className="text-lg text-gray-500 -mt-2">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div className="flex flex-wrap gap-6">
                    <EventCard title="Name Days" icon={<GiftIcon className="w-7 h-7 text-secondary"/>} className="bg-secondary/5 border-2 border-secondary/20 order-first">
                        {calendarData.nameDays && calendarData.nameDays.length > 0 ? (
                           <div className="flex flex-wrap gap-3 mt-2">{calendarData.nameDays.map(nd => (
                            <div key={nd.name} className="flex items-center bg-secondary/10 pl-4 pr-2 py-1 rounded-full group">
                                <span className="font-bold text-secondary text-md">{nd.name}</span>
                                <button onClick={() => handleOpenModal(nd.name)} className="ml-2 text-secondary/70 hover:text-accent transition-colors transform scale-0 group-hover:scale-100 duration-200" title="Generate AI Wish">
                                    <SparklesIcon className="w-6 h-6"/>
                                </button>
                            </div>
                           ))}</div>
                        ) : <p className="text-gray-500 mt-2">No specific name days found.</p>}
                    </EventCard>
                    <EventCard title="Holidays" icon={<CalendarDaysIcon className="w-6 h-6 text-accent"/>}>{calendarData.holidays && calendarData.holidays.length > 0 ? (<ul className="space-y-3">{calendarData.holidays.map(h => <li key={h.name}><strong className="font-semibold text-gray-800">{h.name}:</strong> {h.description}</li>)}</ul>) : <p>No public holidays found.</p>}</EventCard>
                    <EventCard title="Observances" icon={<GlobeAltIcon className="w-6 h-6 text-primary"/>}>{calendarData.observances && calendarData.observances.length > 0 ? (<ul className="list-disc list-inside space-y-1">{calendarData.observances.map((obs, i) => <li key={i}>{obs}</li>)}</ul>) : <p>No other observances found.</p>}</EventCard>
                </div>
                {calendarData.notes && (<Card className="mt-6 p-5 bg-blue-50 border-l-4 border-blue-400"><p className="text-blue-800"><strong className="font-semibold">Note from Gemini:</strong> {calendarData.notes}</p></Card>)}
            </div>
          )}
          </div>
        </>
      )}

      {view === 'browse' && (
        <>
            <Card className="p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="flex flex-col">
                        <label htmlFor="browse-country-select" className="mb-2 font-semibold text-gray-700">Country</label>
                        <select id="browse-country-select" value={browseCountry} onChange={(e) => setBrowseCountry(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-light transition">
                        {countries.map(country => (<option key={country} value={country}>{country}</option>))}
                        </select>
                    </div>
                    <button onClick={getAllNameDays} disabled={isBrowsing} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200/80">
                        {isBrowsing ? <Spinner /> : 'Load Calendar'}
                    </button>
                </div>
            </Card>

            {isBrowsing && <div className="mt-10"><Spinner /></div>}
            {browseError && <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">{browseError}</div>}
            
            {allNameDays && (
                allNameDays.length > 0 ? (
                    <div className="space-y-8">
                        {monthOrder.map(monthName => (
                            groupedNameDays[monthName] && (
                                <Card key={monthName}>
                                    <div className="bg-base-200 p-4 rounded-t-xl border-b border-base-300">
                                        <h3 className="text-2xl font-bold text-neutral">{monthName}</h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                                        {groupedNameDays[monthName].map(day => (
                                            <div key={day.date} className="flex border-b border-dashed border-gray-200 py-1">
                                                <strong className="w-16 font-mono text-primary">{day.date.split('-')[1]}.{day.date.split('-')[0]}.</strong>
                                                <span className="flex-1 text-gray-600">{day.names.join(', ')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-yellow-100 text-yellow-800 rounded-lg">
                        <h3 className="font-bold text-lg">No Data Found</h3>
                        <p>No name day data found for {browseCountry}. This country may not celebrate name days, or the data might not be available.</p>
                    </div>
                )
            )}
        </>
      )}
    </div>
    </>
  );
};

export default GlobalCalendar;