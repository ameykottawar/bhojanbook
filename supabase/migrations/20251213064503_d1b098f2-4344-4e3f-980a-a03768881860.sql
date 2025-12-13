-- Add user_id column to students table
ALTER TABLE public.students 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to meals table  
ALTER TABLE public.meals
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing permissive policies on students
DROP POLICY IF EXISTS "Public read access for students" ON public.students;
DROP POLICY IF EXISTS "Public insert access for students" ON public.students;
DROP POLICY IF EXISTS "Public update access for students" ON public.students;
DROP POLICY IF EXISTS "Public delete access for students" ON public.students;

-- Drop existing permissive policies on meals
DROP POLICY IF EXISTS "Public read access for meals" ON public.meals;
DROP POLICY IF EXISTS "Public insert access for meals" ON public.meals;
DROP POLICY IF EXISTS "Public update access for meals" ON public.meals;
DROP POLICY IF EXISTS "Public delete access for meals" ON public.meals;

-- Create new RLS policies for students - user can only access their own data
CREATE POLICY "Users can view their own students"
ON public.students FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own students"
ON public.students FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students"
ON public.students FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students"
ON public.students FOR DELETE
USING (auth.uid() = user_id);

-- Create new RLS policies for meals - user can only access their own data
CREATE POLICY "Users can view their own meals"
ON public.meals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meals"
ON public.meals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
ON public.meals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
ON public.meals FOR DELETE
USING (auth.uid() = user_id);