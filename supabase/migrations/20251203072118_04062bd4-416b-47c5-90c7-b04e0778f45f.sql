-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal_type enum
CREATE TYPE public.meal_type AS ENUM ('mini', 'full', 'special');

-- Create meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  meal_type public.meal_type NOT NULL,
  amount INTEGER NOT NULL,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create public access policies (app can be used without auth for simplicity)
CREATE POLICY "Public read access for students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public insert access for students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Public delete access for students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Public read access for meals" ON public.meals FOR SELECT USING (true);
CREATE POLICY "Public insert access for meals" ON public.meals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for meals" ON public.meals FOR UPDATE USING (true);
CREATE POLICY "Public delete access for meals" ON public.meals FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_meals_student_id ON public.meals(student_id);
CREATE INDEX idx_meals_meal_date ON public.meals(meal_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();