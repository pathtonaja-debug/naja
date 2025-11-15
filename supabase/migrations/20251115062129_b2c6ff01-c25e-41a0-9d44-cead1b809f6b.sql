-- Create calendar_items table for events and tasks
CREATE TABLE public.calendar_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  device_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('event', 'task')),
  title TEXT NOT NULL,
  notes TEXT,
  start_date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date_time TIMESTAMP WITH TIME ZONE,
  is_all_day BOOLEAN DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('faith', 'work', 'study', 'health', 'personal', 'other')),
  completion INTEGER DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
  calendar_source TEXT DEFAULT 'NAJA',
  color TEXT,
  repeat_rule TEXT,
  reminder TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.calendar_items ENABLE ROW LEVEL SECURITY;

-- Create policies for calendar items
CREATE POLICY "Anyone can manage their calendar items" 
ON public.calendar_items 
FOR ALL 
USING (true);

-- Add index for efficient date range queries
CREATE INDEX idx_calendar_items_date_range ON public.calendar_items (start_date_time, end_date_time);
CREATE INDEX idx_calendar_items_user_id ON public.calendar_items (user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_calendar_items_updated_at
BEFORE UPDATE ON public.calendar_items
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();