import React, { useState } from 'react';
import { getEventSuggestions } from '../services/apiService';
import { AISuggestions } from '../types';
import { SparklesIcon } from '../components/icons';

export const AISuggestionsPage: React.FC = () => {
  const [eventType, setEventType] = useState('');
  const [preferences, setPreferences] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);

  const handleGetSuggestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType) {
      setError("Please describe the type of event.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const prompt = `
      Event Type: ${eventType}
      Preferences: ${preferences}
      Availability: ${availability}
      Location Preferences: ${location}
      
      Based on the details above, generate an engaging event description and a list of 5-7 relevant tasks.
    `;

    const result = await getEventSuggestions(prompt);

    if (result) {
      setSuggestions(result);
    } else {
      setError("Failed to get suggestions from AI. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="p-8 h-full">
      <h1 className="text-3xl font-bold text-white mb-1">AI Event Idea Generator</h1>
      <p className="text-gray-400 mb-6">Describe your ideal event and let our AI build it out for you.</p>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <form onSubmit={handleGetSuggestions} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type of Event</label>
                    <textarea value={eventType} onChange={e => setEventType(e.target.value)} rows={2} placeholder="A professional networking mixer for 50 people." className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Preferences</label>
                    <textarea value={preferences} onChange={e => setPreferences(e.target.value)} rows={3} placeholder="Prefers evenings on a weekday, modern and chic venues with good accessibility. Describe your ideal event atmosphere, time of day, etc." className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Availability</label>
                    <textarea value={availability} onChange={e => setAvailability(e.target.value)} rows={2} placeholder="Available on weekday evenings after 6 PM for the next month. Not available on weekends." className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location Preferences</label>
                    <textarea value={location} onChange={e => setLocation(e.target.value)} rows={2} placeholder="Downtown or financial district." className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 disabled:bg-teal-800">
                    {isLoading ? (
                        <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Generating...</span></>
                    ) : (
                        <><SparklesIcon className="w-5 h-5"/>Get Suggestions</>
                    )}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </form>
            
             {suggestions && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-xl font-semibold text-teal-400 mb-2">Suggested Description</h3>
                    <p className="text-gray-300 bg-gray-700/50 p-4 rounded-md text-sm whitespace-pre-wrap">{suggestions.suggestedDescription}</p>
                    <h3 className="text-xl font-semibold text-teal-400 mt-4 mb-2">Suggested Tasks</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 bg-gray-700/50 p-4 rounded-md">
                        {suggestions.suggestedTasks.map((task, index) => <li key={index}>{task}</li>)}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};