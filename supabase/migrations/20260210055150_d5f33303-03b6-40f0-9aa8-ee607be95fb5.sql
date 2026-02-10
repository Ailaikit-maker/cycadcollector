
-- Collectors/profiles table
CREATE TABLE public.collectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.collectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collector profile"
  ON public.collectors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collector profile"
  ON public.collectors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collector profile"
  ON public.collectors FOR UPDATE USING (auth.uid() = user_id);

-- Cycad items table
CREATE TABLE public.cycad_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  genus TEXT NOT NULL,
  species TEXT NOT NULL,
  date_obtained DATE,
  obtained_at TEXT,
  height TEXT,
  diameter TEXT,
  sex TEXT NOT NULL DEFAULT 'Unknown',
  purchase_price TEXT,
  value TEXT,
  permit TEXT NOT NULL DEFAULT 'Not required',
  permit_file_name TEXT,
  permit_file_url TEXT,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cycad_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cycads"
  ON public.cycad_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cycads"
  ON public.cycad_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cycads"
  ON public.cycad_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cycads"
  ON public.cycad_items FOR DELETE USING (auth.uid() = user_id);

-- Auto-create collector profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.collectors (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_collectors_updated_at
  BEFORE UPDATE ON public.collectors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cycad_items_updated_at
  BEFORE UPDATE ON public.cycad_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
