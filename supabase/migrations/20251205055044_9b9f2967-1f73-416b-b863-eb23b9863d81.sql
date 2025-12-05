-- Make student_id nullable for normal billing (walk-in customers)
ALTER TABLE public.meals ALTER COLUMN student_id DROP NOT NULL;