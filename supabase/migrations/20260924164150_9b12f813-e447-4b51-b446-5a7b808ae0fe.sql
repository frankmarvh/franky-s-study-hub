
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  subject text NOT NULL,
  material_type text NOT NULL DEFAULT 'Notes',
  course text,
  file_path text,
  external_url text,
  file_size_bytes bigint,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.materials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materials TO authenticated;
GRANT ALL ON public.materials TO service_role;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can browse materials" ON public.materials
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can add materials" ON public.materials
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update materials" ON public.materials
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete materials" ON public.materials
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER materials_set_updated_at BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Signed-in users can read material files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'materials');
CREATE POLICY "Admins can upload material files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update material files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete material files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.materials (title, description, subject, material_type, course, external_url) VALUES
('Calculus Volume 2 — Full Textbook', 'Free OpenStax textbook covering integration techniques, sequences and series.', 'Mathematics', 'Textbook', 'Calculus II', 'https://openstax.org/details/books/calculus-volume-2'),
('College Physics — Full Textbook', 'Free OpenStax physics textbook with worked examples and problem sets.', 'Physics', 'Textbook', 'Intro Physics', 'https://openstax.org/details/books/college-physics-2e'),
('Biology 2e — Full Textbook', 'Free OpenStax biology textbook covering cells, genetics and evolution.', 'Biology', 'Textbook', 'Biology 101', 'https://openstax.org/details/books/biology-2e'),
('Chemistry 2e — Full Textbook', 'Free OpenStax chemistry textbook with practice questions.', 'Chemistry', 'Textbook', 'General Chemistry', 'https://openstax.org/details/books/chemistry-2e'),
('U.S. History — Full Textbook', 'Free OpenStax history textbook with timelines and primary sources.', 'History', 'Textbook', 'History 100', 'https://openstax.org/details/books/us-history'),
('MIT 18.01 Single Variable Calculus — Lecture Notes', 'Complete lecture notes and problem sets from MIT OpenCourseWare.', 'Mathematics', 'Lecture notes', 'Calculus I', 'https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/');
