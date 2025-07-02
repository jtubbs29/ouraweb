import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Clock } from 'lucide-react';
import { format, subDays, subWeeks, subMonths, startOfWeek, startOfMonth } from 'date-fns';

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

interface DateRangeSelectorProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  selectedRange, 
  onRangeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const today = new Date();
  
  const presetRanges: DateRange[] = [
    {
      startDate: subDays(today, 7),
      endDate: today,
      label: 'Last 7 days'
    },
    {
      startDate: subDays(today, 14),
      endDate: today,
      label: 'Last 2 weeks'
    },
    {
      startDate: subDays(today, 30),
      endDate: today,
      label: 'Last 30 days'
    },
    {
      startDate: startOfWeek(today),
      endDate: today,
      label: 'This week'
    },
    {
      startDate: startOfMonth(today),
      endDate: today,
      label: 'This month'
    },
    {
      startDate: subMonths(today, 1),
      endDate: today,
      label: 'Last month'
    },
    {
      startDate: subMonths(today, 3),
      endDate: today,
      label: 'Last 3 months'
    },
    {
      startDate: new Date(today.getFullYear(), 0, 1),
      endDate: today,
      label: 'Year to date'
    }
  ];

  const handlePresetSelect = (range: DateRange) => {
    try {
      // Validate the range before applying
      if (!range || !range.startDate || !range.endDate) {
        console.warn('DateRangeSelector: Invalid range provided:', range);
        return;
      }

      // Ensure dates are valid Date objects
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('DateRangeSelector: Invalid dates in range:', range);
        return;
      }

      if (startDate > endDate) {
        console.warn('DateRangeSelector: Start date is after end date, swapping');
        onRangeChange({
          ...range,
          startDate: endDate,
          endDate: startDate
        });
      } else {
        onRangeChange(range);
      }

      setIsOpen(false);
      setShowCustom(false);
    } catch (error) {
      console.error('DateRangeSelector: Error selecting preset range:', error);
    }
  };

  const handleCustomSubmit = () => {
    try {
      if (!customStart || !customEnd) {
        console.warn('DateRangeSelector: Custom dates not provided');
        return;
      }

      const startDate = new Date(customStart);
      const endDate = new Date(customEnd);
      
      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('DateRangeSelector: Invalid custom dates provided');
        alert('Please enter valid dates');
        return;
      }

      // Ensure start date is before end date
      if (startDate > endDate) {
        console.warn('DateRangeSelector: Start date is after end date, swapping');
        const swappedStart = endDate;
        const swappedEnd = startDate;
        
        onRangeChange({
          startDate: swappedStart,
          endDate: swappedEnd,
          label: `${format(swappedStart, 'MMM d')} - ${format(swappedEnd, 'MMM d')}`
        });
      } else {
        onRangeChange({
          startDate,
          endDate,
          label: `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
        });
      }

      setIsOpen(false);
      setShowCustom(false);
      setCustomStart('');
      setCustomEnd('');
    } catch (error) {
      console.error('DateRangeSelector: Error submitting custom range:', error);
      alert('An error occurred while setting the custom date range. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <Calendar className="h-4 w-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">
          {selectedRange.label}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-64"
          >
            <div className="p-2">
              {/* Preset Ranges */}
              <div className="space-y-1 mb-2">
                {presetRanges.map((range, index) => (
                  <motion.button
                    key={range.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handlePresetSelect(range)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                      selectedRange.label === range.label
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{range.label}</span>
                      <span className="text-xs text-slate-500">
                        {format(range.startDate, 'MMM d')} - {format(range.endDate, 'MMM d')}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Custom Range Toggle */}
              <div className="border-t border-slate-200 pt-2">
                <button
                  onClick={() => setShowCustom(!showCustom)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors duration-150"
                >
                  <Clock className="h-4 w-4" />
                  <span>Custom range</span>
                  <ChevronDown className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                    showCustom ? 'rotate-180' : ''
                  }`} />
                </button>

                <AnimatePresence>
                  {showCustom && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 p-3 bg-slate-50 rounded-md space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            max={format(today, 'yyyy-MM-dd')}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            max={format(today, 'yyyy-MM-dd')}
                            min={customStart}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleCustomSubmit}
                        disabled={!customStart || !customEnd}
                        className="w-full px-3 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Apply Custom Range
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setShowCustom(false);
          }}
        />
      )}
    </div>
  );
};

export default DateRangeSelector;