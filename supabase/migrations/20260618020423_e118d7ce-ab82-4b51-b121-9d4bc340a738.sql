
-- profiles (basic user profile for admin panel)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- projects (portfolio)
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  client text,
  category text,
  summary text,
  description text,
  cover_url text,
  project_url text,
  tags text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  completed_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX projects_active_idx ON public.projects (is_active, sort_order);
CREATE INDEX projects_featured_idx ON public.projects (is_featured, sort_order);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (is_active);
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- process_steps (how we work)
CREATE TABLE public.process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number int NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.process_steps TO anon, authenticated;
GRANT ALL ON public.process_steps TO service_role;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read process" ON public.process_steps FOR SELECT USING (is_active);
CREATE POLICY "Admins manage process" ON public.process_steps FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- faqs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX faqs_active_idx ON public.faqs (is_active, sort_order);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (is_active);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reseed services with KidoTech's actual products
DELETE FROM public.services;
INSERT INTO public.services (icon, title, description, sort_order) VALUES
  ('Code2', 'Website & Web App Development',
   'Pembuatan website company profile, landing page, hingga aplikasi web kompleks dengan teknologi modern (React, Next.js, TanStack). Fokus pada performa, SEO, dan skalabilitas.', 1),
  ('Cpu', 'IoT Project Development',
   'Perancangan dan implementasi solusi Internet of Things — sensor, microcontroller, dashboard monitoring real-time, dan integrasi cloud untuk smart business & smart home.', 2),
  ('Wrench', 'IT Troubleshooting',
   'Layanan diagnosa dan perbaikan masalah jaringan, server, perangkat, dan aplikasi. Respon cepat untuk meminimalkan downtime operasional bisnis Anda.', 3),
  ('ShieldCheck', 'Managed IT Services',
   'Pengelolaan infrastruktur IT secara menyeluruh: monitoring 24/7, maintenance berkala, backup, security patching, hingga IT support harian dengan SLA jelas.', 4);

-- Seed process_steps
INSERT INTO public.process_steps (step_number, title, description, icon) VALUES
  (1, 'Discovery & Konsultasi', 'Kami mendengarkan kebutuhan, tujuan bisnis, dan tantangan teknis Anda untuk menemukan solusi terbaik.', 'MessageSquare'),
  (2, 'Perencanaan & Desain', 'Tim kami menyusun arsitektur, timeline, dan prototipe interaktif sebelum baris kode pertama ditulis.', 'PenTool'),
  (3, 'Development & Integrasi', 'Implementasi dengan iterasi mingguan, code review ketat, dan komunikasi transparan via channel pilihan Anda.', 'Code2'),
  (4, 'Deploy & Support', 'Peluncuran ke production, pelatihan tim, dan dukungan berkelanjutan untuk memastikan sistem terus berjalan optimal.', 'Rocket');

-- Seed FAQs
INSERT INTO public.faqs (question, answer, sort_order) VALUES
  ('Berapa lama waktu pengerjaan sebuah project?', 'Tergantung kompleksitas. Landing page sederhana biasanya 1–2 minggu, web app menengah 4–8 minggu, sedangkan project IoT atau enterprise dapat berlangsung 2–6 bulan. Kami selalu sepakati timeline di awal project.', 1),
  ('Apakah ada garansi setelah project selesai?', 'Ya. Setiap project kami berikan masa garansi minimum 30 hari untuk perbaikan bug. Untuk Managed Services, support berlangsung sepanjang masa kontrak sesuai SLA.', 2),
  ('Teknologi apa saja yang KidoTech kuasai?', 'Web: React, Next.js, TanStack, Node.js, Supabase, PostgreSQL. IoT: ESP32, Raspberry Pi, MQTT, AWS IoT. DevOps: Docker, Vercel, Cloudflare, GitHub Actions.', 3),
  ('Bagaimana sistem pembayarannya?', 'Umumnya 30% di awal sebagai down payment, 40% saat tahap mid-development, dan 30% di akhir setelah serah terima. Untuk Managed Services menggunakan billing bulanan.', 4),
  ('Apakah bisa membantu maintenance project yang sudah ada?', 'Tentu. Kami melakukan audit awal kode/infrastruktur Anda, lalu menyusun roadmap perbaikan dan paket maintenance yang sesuai.', 5);

-- Seed sample projects
INSERT INTO public.projects (title, slug, client, category, summary, cover_url, tags, is_featured, sort_order, completed_at) VALUES
  ('Smart Warehouse Monitoring', 'smart-warehouse', 'Nusantara Logistics', 'IoT',
   'Dashboard real-time untuk monitoring suhu, kelembaban, dan stok gudang dengan 120+ sensor terhubung.',
   'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
   ARRAY['IoT','Dashboard','ESP32'], true, 1, '2025-03-15'),
  ('PayMint Web Platform', 'paymint-platform', 'PayMint', 'Web App',
   'Platform pembayaran B2B dengan fitur invoicing otomatis, multi-currency, dan integrasi bank lokal.',
   'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=1200&q=80',
   ARRAY['Next.js','Supabase','Stripe'], true, 2, '2025-01-20'),
  ('Greenleaf Analytics Suite', 'greenleaf-analytics', 'Greenleaf Retail', 'Data',
   'Dashboard analytics omnichannel untuk retail dengan ETL pipeline dan visualisasi penjualan harian.',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
   ARRAY['Data','Dashboard','Postgres'], true, 3, '2024-11-10'),
  ('CityFleet Tracking', 'cityfleet-tracking', 'CityFleet', 'IoT',
   'Sistem pelacakan armada kendaraan real-time dengan GPS, geofencing, dan laporan otomatis.',
   'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
   ARRAY['IoT','GPS','Maps'], false, 4, '2024-09-05');
