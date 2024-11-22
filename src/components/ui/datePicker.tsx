import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerDemoProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function DatePickerDemo({ value, onChange }: DatePickerDemoProps) {
  const [calendar, setCalendar] = React.useState<Date>(value instanceof Date ? value : new Date());
  const [yearInput, setYearInput] = React.useState<string>(
    calendar.getFullYear().toString()
  );

  // Wrap the onSelect handler to convert undefined to null
  const handleSelect = (date: Date | undefined) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setCalendar(date);
      onChange(date);
    } else {
      onChange(null);
    }
  };

  // Handle year input change
  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setYearInput(newValue);

    // Only update the calendar if we have a valid year
    const yearNum = parseInt(newValue);
    if (!isNaN(yearNum) && yearNum.toString() === newValue && yearNum >= 0) {
      setCalendar(prev => {
        if (prev instanceof Date) {
        const newDate = new Date(prev);
        newDate.setFullYear(yearNum);
        }
        return new Date();
      });
    }
  };

  // Handle year navigation
  const navigateYear = (direction: 'prev' | 'next') => {
    setCalendar(prev => {
      if (prev instanceof Date) {
      const newDate = new Date(prev);
      const newYear = prev.getFullYear() + (direction === 'prev' ? -1 : 1);
      newDate.setFullYear(newYear);
      setYearInput(newYear.toString());
      return newDate;
      }
      return new Date()
    });
  };

  // Update year input when calendar month changes
  React.useEffect(() => {
    setYearInput(calendar.getFullYear().toString());
  }, [calendar]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full max-w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value instanceof Date && !isNaN(value.getTime()) // Check for valid Date
            ? format(value, "PPP")
            : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between space-x-2 border-b p-3">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 hover:bg-muted"
            onClick={() => navigateYear('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center">
            <Input
              value={yearInput}
              onChange={handleYearInputChange}
              className="h-7 w-[80px] text-center"
              inputMode="numeric"
              placeholder="Year"
            />
          </div>
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 hover:bg-muted"
            onClick={() => navigateYear('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={handleSelect}
          initialFocus
          month={calendar instanceof Date ? calendar : new Date()}
          onMonthChange={(newMonth) => {
            if (newMonth instanceof Date) {
              setCalendar(newMonth);
            }
          }}        />
      </PopoverContent>
    </Popover>
  );
}