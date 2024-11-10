import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerDemoProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export function DatePickerDemo({ value, onChange }: DatePickerDemoProps) {
  // Wrap the onSelect handler to convert undefined to null
  const handleSelect = (date: Date | undefined) => {
    onChange(date ?? null);
  };

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
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ?? undefined}  // Convert null to undefined
          onSelect={handleSelect}        // Use the wrapped handler
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
