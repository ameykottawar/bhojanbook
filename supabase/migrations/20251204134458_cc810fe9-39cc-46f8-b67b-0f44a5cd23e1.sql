-- Add notes and addons columns to meals table
ALTER TABLE public.meals ADD COLUMN notes TEXT;
ALTER TABLE public.meals ADD COLUMN addons JSONB DEFAULT '[]'::jsonb;

-- Add last payment tracking to students table
ALTER TABLE public.students ADD COLUMN last_payment_amount INTEGER;
ALTER TABLE public.students ADD COLUMN last_payment_date DATE;