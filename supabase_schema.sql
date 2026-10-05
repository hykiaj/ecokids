-- ===================================================
-- Eco Kids - Script de Tabelas, RLS e Triggers para Supabase
-- Execute este script no SQL Editor do seu projeto Supabase
-- ===================================================

-- 1. Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  kid_name TEXT DEFAULT 'Nome da criança',
  parent_name TEXT DEFAULT 'Nome do Responsável',
  parent_pin TEXT,
  avatar_kid TEXT DEFAULT 'avatar1',
  avatar_parent TEXT DEFAULT 'parent1',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir coluna is_admin caso a tabela já exista
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ===================================================
-- Automação: Criação Automática do Perfil ao Criar Usuário no Auth
-- ===================================================

-- Função executada automaticamente sempre que um novo usuário for criado em auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    kid_name,
    parent_name,
    parent_pin,
    avatar_kid,
    avatar_parent,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'kid_name', ''), 'Nome da criança'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'parent_name', ''), 'Nome do Responsável'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'parent_pin', ''), '1234'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'avatar_kid', ''), 'avatar1'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'avatar_parent', ''), 'parent1'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    kid_name = COALESCE(NULLIF(EXCLUDED.kid_name, ''), public.profiles.kid_name),
    parent_name = COALESCE(NULLIF(EXCLUDED.parent_name, ''), public.profiles.parent_name),
    parent_pin = COALESCE(NULLIF(EXCLUDED.parent_pin, ''), public.profiles.parent_pin),
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Trigger disparada imediatamente após INSERT na tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sincronizar usuários já existentes em auth.users que ainda não possuem perfil criado
INSERT INTO public.profiles (id, email, kid_name, parent_name, parent_pin, avatar_kid, avatar_parent)
SELECT 
  id, 
  email, 
  COALESCE(NULLIF(raw_user_meta_data->>'kid_name', ''), 'Nome da criança'),
  COALESCE(NULLIF(raw_user_meta_data->>'parent_name', ''), 'Nome do Responsável'),
  COALESCE(NULLIF(raw_user_meta_data->>'parent_pin', ''), '1234'),
  COALESCE(NULLIF(raw_user_meta_data->>'avatar_kid', ''), 'avatar1'),
  COALESCE(NULLIF(raw_user_meta_data->>'avatar_parent', ''), 'parent1')
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ===================================================
-- 2. Tabela de Estatísticas de Uso das Pranchas e Frases
-- ===================================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'board' ou 'phrase'
  item_name TEXT NOT NULL,
  board_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem consultar seus logs de uso" ON public.usage_logs;
CREATE POLICY "Usuários podem consultar seus logs de uso"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir seus logs de uso" ON public.usage_logs;
CREATE POLICY "Usuários podem inserir seus logs de uso"
  ON public.usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ===================================================
-- 3. Tabela de Frases Customizadas Adicionadas pelos Pais
-- ===================================================
CREATE TABLE IF NOT EXISTS public.custom_phrases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phrase_text TEXT NOT NULL,
  board_id TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.custom_phrases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem consultar suas frases customizadas" ON public.custom_phrases;
CREATE POLICY "Usuários podem consultar suas frases customizadas"
  ON public.custom_phrases FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar frases customizadas" ON public.custom_phrases;
CREATE POLICY "Usuários podem criar frases customizadas"
  ON public.custom_phrases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem apagar frases customizadas" ON public.custom_phrases;
CREATE POLICY "Usuários podem apagar frases customizadas"
  ON public.custom_phrases FOR DELETE
  USING (auth.uid() = user_id);


-- ===================================================
-- 4. Bucket de Armazenamento 'ecokids' (Storage)
-- ===================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ecokids', 'ecokids', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Arquivos públicos do bucket ecokids" ON storage.objects;
CREATE POLICY "Arquivos públicos do bucket ecokids"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ecokids');


-- ===================================================
-- 5. Função de Acesso de Administrador (RPC)
-- ===================================================
-- Retorna todos os usuários/perfis apenas se o chamador for administrador
CREATE OR REPLACE FUNCTION public.get_all_profiles()
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
    RETURN QUERY SELECT * FROM public.profiles ORDER BY created_at DESC;
  ELSE
    RAISE EXCEPTION 'Acesso Negado: Usuário não é administrador.';
  END IF;
END;
$$;

-- ===================================================
-- 6. Função para Verificar se Usuário/Email Existe (RPC)
-- ===================================================
-- Permite verificar se o e-mail informado já possui cadastro no Supabase,
-- possibilitando informar claramente na tela de login que o usuário não existe.
CREATE OR REPLACE FUNCTION public.check_user_exists(email_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(email_input))
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_exists(TEXT) TO anon, authenticated, service_role;

