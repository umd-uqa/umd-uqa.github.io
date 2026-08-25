-- ========================================================
-- UMD UQA SUPABASE SCHEMA & SECURITY POLICIES
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- ======================================================
-- 1. ADMIN EMAILS TABLE
CREATE TABLE IF NOT EXISTS public.admin_emails (
    email TEXT PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'admin',
    added_by TEXT DEFAULT 'System',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Initial Authorized Admin Emails
INSERT INTO public.admin_emails (email, role, added_by)
VALUES 
    ('itskrithikmohan@gmail.com', 'admin', 'System Initializer'),
    ('krithikm@terpmail.umd.edu', 'admin', 'System Initializer'),
    ('umd.uqa@gmail.com', 'admin', 'System Initializer')
ON CONFLICT (email) DO NOTHING;

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    month TEXT NOT NULL,
    day TEXT NOT NULL,
    year TEXT DEFAULT '2026',
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    description TEXT NOT NULL,
    highlights JSONB DEFAULT '[]'::jsonb,
    links JSONB DEFAULT '[]'::jsonb,
    poster_url TEXT DEFAULT '',
    poster_path TEXT DEFAULT '',
    poster_alt TEXT DEFAULT 'Event Poster',
    is_annual BOOLEAN DEFAULT false,
    order_num INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Initial Annual Event (QLCN 2026)
INSERT INTO public.events (id, month, day, year, title, subtitle, description, highlights, links, is_annual, order_num)
VALUES (
    'default_qlcn',
    'Sept',
    '15',
    '2026',
    'Quantum Leap Career Nexus',
    'QLCN 2026 · University of Maryland',
    'A career fair and professional development event bringing together quantum computing students, researchers, and industry professionals. QLCN connects tomorrow''s quantum workforce with leading organizations through networking, recruitment, and mentorship workshops.',
    '["Networking with quantum industry professionals and recruiters", "Workshops focused on internship and job placement", "Career development and mentorship opportunities for undergraduates"]'::jsonb,
    '[{"label": "Register via Handshake", "url": "https://go.umd.edu/QLCNregister", "primary": true}]'::jsonb,
    true,
    1
)
ON CONFLICT (id) DO NOTHING;

-- 3. FEATURED VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
    id TEXT PRIMARY KEY, -- YouTube Video ID
    title TEXT NOT NULL,
    order_num INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed Initial Workshop Videos
INSERT INTO public.videos (id, title, order_num)
VALUES
    ('agOdzgWTr-Y', 'QuEra Workshop 1', 1),
    ('i_MKOCxInOQ', 'QuEra Quantum Challenge Walkthrough', 2),
    ('xEa3WIzgxDQ', 'QuEra Workshop 2', 3)
ON CONFLICT (id) DO NOTHING;

-- ========================================================
-- 4. SECURITY DEFINER: IS_ADMIN CHECK FUNCTION
-- ========================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_emails 
        WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
          AND role = 'admin'
    );
$$;

-- ========================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Admin Emails Policies
DROP POLICY IF EXISTS "Public can view admin whitelist" ON public.admin_emails;
CREATE POLICY "Public can view admin whitelist"
    ON public.admin_emails FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert new admins" ON public.admin_emails;
CREATE POLICY "Admins can insert new admins"
    ON public.admin_emails FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update admin records" ON public.admin_emails;
CREATE POLICY "Admins can update admin records"
    ON public.admin_emails FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete admin records" ON public.admin_emails;
CREATE POLICY "Admins can delete admin records"
    ON public.admin_emails FOR DELETE
    USING (public.is_admin());

-- Events Policies
DROP POLICY IF EXISTS "Public can view events" ON public.events;
CREATE POLICY "Public can view events"
    ON public.events FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
CREATE POLICY "Admins can insert events"
    ON public.events FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Admins can update events"
    ON public.events FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
CREATE POLICY "Admins can delete events"
    ON public.events FOR DELETE
    USING (public.is_admin());

-- Videos Policies
DROP POLICY IF EXISTS "Public can view videos" ON public.videos;
CREATE POLICY "Public can view videos"
    ON public.videos FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
CREATE POLICY "Admins can insert videos"
    ON public.videos FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
CREATE POLICY "Admins can update videos"
    ON public.videos FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;
CREATE POLICY "Admins can delete videos"
    ON public.videos FOR DELETE
    USING (public.is_admin());

-- ========================================================
-- 6. STORAGE BUCKET: EVENT POSTERS
-- ========================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'posters',
    'posters',
    true,
    5242880, -- 5MB limit
    ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view event posters" ON storage.objects;
CREATE POLICY "Public can view event posters"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'posters');

DROP POLICY IF EXISTS "Admins can upload event posters" ON storage.objects;
CREATE POLICY "Admins can upload event posters"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'posters' 
        AND (public.is_admin() OR auth.role() = 'authenticated')
    );

DROP POLICY IF EXISTS "Admins can update event posters" ON storage.objects;
CREATE POLICY "Admins can update event posters"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'posters' 
        AND (public.is_admin() OR auth.role() = 'authenticated')
    );

DROP POLICY IF EXISTS "Admins can delete event posters" ON storage.objects;
CREATE POLICY "Admins can delete event posters"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'posters' 
        AND (public.is_admin() OR auth.role() = 'authenticated')
    );
