import { useState, useCallback } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  suffix?: string;
  prefix?: string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  suffix = "",
  prefix = "",
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value);
      const newValue: [number, number] = [Math.min(newMin, localValue[1]), localValue[1]];
      setLocalValue(newValue);
      onChange(newValue);
    },
    [localValue, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value);
      const newValue: [number, number] = [localValue[0], Math.max(newMax, localValue[0])];
      setLocalValue(newValue);
      onChange(newValue);
    },
    [localValue, onChange]
  );

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-6 mt-2">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
        {/* Active Range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-gray-800 rounded-full"
          style={{
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`,
          }}
        />
        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute top-0 w-full h-6 appearance-none bg-transparent pointer-events-none z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-gray-800 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md"
        />
        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute top-0 w-full h-6 appearance-none bg-transparent pointer-events-none z-10
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-gray-800 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
      {/* Labels */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm text-gray-500">
          {prefix}{localValue[0]}{suffix}
        </span>
        <span className="text-sm text-gray-500">
          {prefix}{localValue[1]}{suffix}
        </span>
      </div>
    </div>
  );
}
