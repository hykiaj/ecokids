# 🌿 Guia Técnico e Trechos Importantes do Código - Eco Kids

Este documento foi elaborado para fornecer uma visão detalhada, arquitetural e prática sobre o código-fonte do **Eco Kids**. Aqui você encontrará os trechos mais críticos do sistema, explicando **o que fazem**, **por que foram desenhados dessa forma** e **o que você precisa saber ao dar manutenção ou evoluir a aplicação**.

---

## 📑 Sumário

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [O Chaveador Central de Telas (`src/app/page.js`)](#2-o-chaveador-central-de-telas-srcapppagejs)
3. [Camada de Dados e Supabase (`src/lib/supabase.js`)](#3-camada-de-dados-e-supabase-srclibsupabasejs)
4. [Gerenciamento de Estado Global (`src/context/AuthContext.js`)](#4-gerenciamento-de-estado-global-srccontextauthcontextjs)
5. [Pranchas de CAA e Síntese de Voz (`src/components/KidsHome.js`)](#5-pranchas-de-caa-e-síntese-de-voz-srccomponentskidshomejs)
6. [Área dos Pais e Métricas (`src/components/ParentsArea.js`)](#6-área-dos-pais-e-métricas-srccomponentsparentsareajs)
7. [Controle Parental por PIN (`src/components/PasswordModal.js`)](#7-controle-parental-por-pin-srccomponentspasswordmodaljs)
8. [Segurança e Banco de Dados (`supabase_schema.sql`)](#8-segurança-e-banco-de-dados-supabaseschemasql)
9. [Guia de Consulta Rápida (Onde alterar o quê)](#9-guia-de-consulta-rápida-onde-alterar-o-quê)

---

## 1. Visão Geral da Arquitetura

O **Eco Kids** é um sistema de **Comunicação Aumentativa e Alternativa (CAA)** voltado para crianças não-verbais ou em desenvolvimento de linguagem, com uma interface acolhedora para os responsáveis acompanharem o uso e customizarem pranchas.

- **Framework**: Next.js 16 (App Router) com React 19.
- **Backend & Autenticação**: Supabase (Auth, PostgreSQL com RLS, Storage para avatares e imagens).
- **Áudio / Fala**: Web Speech API nativa dos navegadores (`window.speechSynthesis`).
- **Persistência**: Estratégia dual / híbrida (Supabase Cloud + sincronização / fallback em `localStorage`).

### Mapa das Camadas

```
src/
├── app/
│   ├── layout.js       # Provedores globais (AuthProvider, ThemeProvider)
│   └── page.js         # Orquestrador central de renderização condicional
├── context/
│   ├── AuthContext.js  # Estado de sessão, usuário, métricas e frases
│   └── ThemeContext.js # Estado de tema Claro / Escuro
├── lib/
│   └── supabase.js     # Cliente Supabase, chamadas à API, RPCs e Storage
└── components/
    ├── LandingPage.js   # Tela 1: Apresentação e Modais de Login / Cadastro
    ├── KidsHome.js      # Tela 2: 9 Pranchas interativas com voz
    ├── SideMenu.js      # Tela 3: Gaveta lateral de navegação
    ├── PasswordModal.js # Tela 3: Barreira de segurança (PIN parental)
    ├── ParentsArea.js   # Tela 4: Gráficos de uso e cadastro de frases
    ├── AdminArea.js     # Painel exclusivo de administração
    └── ConfigModal.js   # Ajuste de perfil da criança e responsável
```

---

## 2. O Chaveador Central de Telas (`src/app/page.js`)

O arquivo `src/app/page.js` não implementa regras de negócio complexas diretamente, mas funciona como a **máquina de estados visual** da aplicação. Em vez de utilizar rotas separadas por URL (`/kids`, `/parents`), a aplicação foi projetada como uma Single Page interativa e controlada.

### Trecho de Código Essencial:

```jsx
export default function Home() {
  const { user, profile, logout, loading, needsProfileSetup } = useAuth();

  const [currentView, setCurrentView] = useState("kids"); // 'kids' ou 'parents'
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [manualConfigOpen, setManualConfigOpen] = useState(false);
  const [dismissedSetup, setDismissedSetup] = useState(false);

  const isConfigModalOpen = manualConfigOpen || (Boolean(user && needsProfileSetup) && !dismissedSetup);

  // 1. Estado de carregamento da sessão
  if (loading) {
    return <LoadingSpinner />;
  }

  // 2. Não autenticado -> Landing Page (com abas Entrar e Cadastrar)
  if (!user) {
    return <LandingPage />;
  }

  // 3. Usuário com privilégio administrativo -> Painel Admin
  const isAdmin = Boolean(profile?.isAdmin || user?.isAdmin);
  if (isAdmin) {
    return <AdminArea onLogout={logout} />;
  }

  // 4. Usuário padrão autenticado:
  return (
    <>
      {currentView === "kids" ? (
        <KidsHome onOpenMenu={() => setMenuOpen(true)} />
      ) : (
        <ParentsArea
          onBackToKids={() => setCurrentView("kids")}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}

      {/* Gaveta do Menu Lateral */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onRequestParentsArea={() => setPasswordModalOpen(true)}
        onOpenSettings={() => {
          setMenuOpen(false);
          setManualConfigOpen(true);
        }}
      />

      {/* Modal de confirmação de senha para transitar para Área dos Pais */}
      <PasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={() => {
          setPasswordModalOpen(false);
          setCurrentView("parents");
        }}
      />

      {/* Modal de Configuração (abre automaticamente se needsProfileSetup for true) */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setManualConfigOpen(false);
          setDismissedSetup(true);
        }}
      />
    </>
  );
}
```

### O que você precisa saber sobre este trecho:
1. **Evita que a criança se perca em rotas**: Crianças que utilizam pranchas de comunicação podem acidentalmente navegar se houver URLs complexas. O estado `currentView` isola as visões.
2. **Flag `needsProfileSetup`**: Se o usuário fez login com um e-mail que ainda possui dados padrão (`"Nome da criança"` ou `"Nome do Responsável"`), o `ConfigModal` é aberto de forma proativa para solicitar o preenchimento.
3. **Ponto único de guarda de rota**: Apenas administradores veem `AdminArea`, e ninguém acessa `ParentsArea` sem antes disparar `setPasswordModalOpen(true)`.

---

## 3. Camada de Dados e Supabase (`src/lib/supabase.js`)

Este é o arquivo central de comunicação externa. Ele gerencia a conexão com o Supabase, autenticação, logs analíticos, frases customizadas e uploads de avatares.

### Trecho 3.1: Inicialização Resiliente do Cliente Supabase

```javascript
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://rpibjgxmdjydbayfxigb.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_eD6PrXEBkkgOLYqcwjD0hg_Dp0bGw-P";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("seu-projeto") &&
    !supabaseAnonKey.includes("sua-chave-anon") &&
    !supabaseAnonKey.includes("sua-chave-publica")
  );
};

let client = null;
if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn("Aviso ao inicializar Supabase:", err.message);
  }
}

export const supabase = client;
```

**Por que é assim?**
- Evita que a compilação do Next.js ou testes em ambiente CI quebrem na ausência de chaves de ambiente.
- `persistSession: true` e `autoRefreshToken: true` garantem que o token JWT do usuário permaneça ativo no navegador entre reloads.

---

### Trecho 3.2: Login com Enriquecimento de Perfil e Tratamento de Erros

```javascript
export async function authSignIn({ email, password }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("O Supabase não está configurado. O login deve ser realizado exclusivamente pelo Supabase.");
  }

  const cleanEmail = email ? email.trim() : "";
  if (!cleanEmail || !password) {
    throw new Error("Por favor, preencha o e-mail e a senha.");
  }

  // 1. Verificação prévia amigável: checa se usuário existe via RPC no PostgreSQL
  const userExists = await checkUserExists(cleanEmail);
  if (userExists === false) {
    const err = new Error("Usuário não encontrado. Este e-mail não possui cadastro. Crie sua conta na aba Cadastrar.");
    err.code = "user_not_found";
    err.status = 404;
    throw err;
  }

  // 2. Autenticação oficial no Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    // Trata erros de senha inválida ou confirmação pendente com mensagens claras em português
    ...
  }

  // 3. Busca dos dados na tabela public.profiles
  let { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  // 4. Se o usuário estiver no Auth mas ainda sem linha em profiles, cria automaticamente:
  if (!profileData) {
    const autoProfile = {
      id: data.user.id,
      email: data.user.email,
      kid_name: data.user.user_metadata?.kid_name || "Nome da criança",
      parent_name: data.user.user_metadata?.parent_name || "Nome do Responsável",
      parent_pin: data.user.user_metadata?.parent_pin || password || "1234",
      avatar_kid: data.user.user_metadata?.avatar_kid || "avatar1",
      avatar_parent: data.user.user_metadata?.avatar_parent || "parent1",
      is_admin: metadataIsAdmin,
    };
    const { data: created } = await supabase.from("profiles").upsert(autoProfile).select().maybeSingle();
    if (created) profileData = created;
  }

  return { user: enrichedUser, profile, needsProfileSetup };
}
```

**Por que este trecho é importante?**
- O Supabase divide o usuário em duas partes: `auth.users` (gerenciado internamente pelo Supabase Auth) e `public.profiles` (tabela pública onde guardamos nomes, avatares e PIN).
- O código faz o **auto-healing**: se por qualquer razão um usuário existir no Auth sem linha em `profiles`, ele insere a linha em tempo de execução sem travar a interface.

---

### Trecho 3.3: Resolução de Imagens e Storage

```javascript
export function resolveCustomImageUrl(imageUrl) {
  if (!imageUrl) return "";
  const trimmed = String(imageUrl).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^ecokids\//, "");
  return getStoragePublicUrl("ecokids", cleanPath);
}
```

**O que faz?**
- Permite que o campo de imagem suporte **três formatos simultaneamente**:
  1. URLs externas (`https://...`)
  2. Imagens locais em Base64 enviadas diretamente do input file (`data:image/...`)
  3. Caminhos relativos de arquivos armazenados no bucket Supabase Storage (`ecokids/...`)

---

## 4. Gerenciamento de Estado Global (`src/context/AuthContext.js`)

O `AuthContext` é o coração do estado compartilhado entre telas e modais. Ele evita "prop drilling" e fornece funções reativas para qualquer componente consumir via `useAuth()`.

### Trecho 4.1: Carregamento Inicial da Sessão

```javascript
useEffect(() => {
  async function initAuth() {
    setIsConfigured(isSupabaseConfigured());
    try {
      const session = await getSavedSession();
      if (session?.user) {
        const isAdmin = Boolean(session.profile?.isAdmin ?? session.user?.isAdmin ?? false);
        setUser({ ...session.user, isAdmin });
        if (session.profile) {
          setProfile({ ...session.profile, isAdmin });
        }
        if (session.needsProfileSetup) {
          setNeedsProfileSetup(true);
        }
      }
      // Carrega métricas e frases em paralelo
      setStats(getStatsData());
      const phrases = await getCustomPhrases();
      setCustomPhrases(phrases);
    } catch (err) {
      console.error("Erro ao inicializar sessão:", err);
    } finally {
      setLoading(false);
    }
  }

  initAuth();
}, []);
```

**O que você precisa saber:**
- Ao abrir o app, `loading` começa como `true`.
- O método `getSavedSession()` consulta o Supabase (`supabase.auth.getSession()`).
- O estado `customPhrases` é preenchido com as frases do banco pertencentes àquele usuário.
- Ao finalizar, `loading` vai para `false`, liberando a interface.

---

### Trecho 4.2: Validação Parental por Senha / PIN

```javascript
const verifyParentPassword = (inputPassword) => {
  if (!inputPassword) return false;
  const pin = profile?.parentPin || "1234";
  return (
    inputPassword.trim() === pin.trim() ||
    inputPassword.trim() === "1234" ||
    inputPassword.trim() === "admin"
  );
};
```

**O que faz:**
- Valida o PIN configurado pelo responsável no perfil (`profile.parentPin`).
- Como salvaguarda para demonstrações e testes rápidos, aceita também os fallbacks conhecidos `"1234"` e `"admin"`.

---

### Trecho 4.3: Telemetria de Uso das Pranchas e Frases

```javascript
const recordBoardClick = async (boardId, boardTitle) => {
  await logUsage("board", boardTitle, boardId);
  setStats(getStatsData());
};

const recordPhraseClick = async (phraseText, boardId) => {
  await logUsage("phrase", phraseText, boardId);
  setStats(getStatsData());
};
```

**O que faz:**
- Sempre que a criança clica em uma prancha ou frase, o contexto grava o log no banco de dados (`public.usage_logs`) e atualiza o estado local das métricas para refletir imediatamente na Área dos Pais.

---

## 5. Pranchas de CAA e Síntese de Voz (`src/components/KidsHome.js`)

Este é o componente principal voltado para a criança. Ele implementa as 9 pranchas temáticas de comunicação, vocalização por sintetizador e ilustrações vetoriais personalizadas.

### Trecho 5.1: Motor de Síntese de Voz (TTS - Text To Speech)

```javascript
const [speakingText, setSpeakingText] = useState("");

const speak = (text) => {
  setSpeakingText(text);
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel(); // Cancela falas anteriores pendentes
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";       // Idioma português brasileiro
    utterance.rate = 0.95;          // Cadência ligeiramente pausada para clareza infantil
    utterance.onend = () => setSpeakingText("");
    utterance.onerror = () => setSpeakingText("");
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => setSpeakingText(""), 2000);
  }
};
```

**Por que este trecho é vital?**
- Utiliza a API nativa do navegador (`window.speechSynthesis`), sem requisições externas para serviços de áudio pagos ou com latência.
- `window.speechSynthesis.cancel()` antes de falar evita a sobreposição de frases quando a criança toca rapidamente em múltiplos cards.
- O estado `speakingText` aciona um banner visual indicando que a frase está sendo reproduzida, dando feedback visual imediato.

---

### Trecho 5.2: Estrutura de Configuração das Pranchas

Cada prancha no array `boards` possui sua paleta cromática, lista de frases padrão e ícone em SVG:

```javascript
const boards = [
  {
    id: "alimentacao",
    title: "Alimentação",
    themeColor: "#D97706",
    deepColor: "#78350F",
    borderColor: "#F6C28B",
    bgTop: "#FFF5EB",
    bgScreen: "#FFF8F0",
    phrases: ["Quero comer", "Estou com fome", "Gostoso", "Fruta", "Mais um pouco"],
    renderIcon: () => (/* SVG do ícone */),
  },
  {
    id: "bebidas",
    title: "Bebidas",
    themeColor: "#0284C7",
    ...
  },
  // diversao, emocoes, social, rotina, lugares, favoritos, higiene...
];
```

---

### Trecho 5.3: Combinação de Frases Nativas e Customizadas

```javascript
// Filtra apenas as frases customizadas criadas pelos pais para esta prancha específica
const boardCustomPhrases = selectedBoard
  ? customPhrases.filter(
      (p) => p.boardId === selectedBoard.id || p.board_id === selectedBoard.id
    )
  : [];
```

Na renderização da tela da prancha:
1. Renderiza os cards das `selectedBoard.phrases` nativas.
2. Em seguida, renderiza todos os itens de `boardCustomPhrases`, exibindo imagem customizada enviada pelos pais se houver.
3. Exibe o botão `+ Adicionar Frase` que instrui o usuário a abrir a Área dos Pais para cadastrar novos itens.

---

### Trecho 5.4: Ilustrações Dinâmicas sem Dependência de Imagens Externas

A função `renderPhraseIllustration(boardId, phraseText, themeColor)` no topo de `KidsHome.js` contém geradores SVG para palavras-chave como *"lição"*, *"comer"*, *"água"*, *"dormir"*, *"banho"*, etc.:

```javascript
function renderPhraseIllustration(boardId, phraseText, themeColor) {
  const normalized = (phraseText || "").toLowerCase().trim();

  if (normalized.includes("comer") || normalized.includes("fome")) {
    return (
      <svg viewBox="0 0 100 100" style={{ width: "66px", height: "66px" }}>
        {/* Prato ilustrado com arroz, frango e legumes */}
        <ellipse cx="50" cy="54" rx="42" ry="30" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2.5" />
        ...
      </svg>
    );
  }
  ...
}
```

**Vantagem arquitetural**: As ilustrações são renderizadas instantaneamente com zero requisições HTTP e com qualidade vetorial nítida em qualquer resolução ou densidade de pixels.

---

## 6. Área dos Pais e Métricas (`src/components/ParentsArea.js`)

A Área dos Pais reúne duas funcionalidades chave:
1. **Visualização de Métricas**: Indicadores de quais pranchas e frases a criança mais utilizou.
2. **Criação de Novas Frases**: Formulário para expandir o vocabulário da prancha da criança.

### Trecho de Código Essencial:

```javascript
const handleSavePhrase = async (e) => {
  e.preventDefault();
  if (!phraseText.trim()) {
    alert("Por favor, digite o texto da frase.");
    return;
  }
  if (!selectedBoardId) {
    alert("Por favor, selecione uma prancha.");
    return;
  }

  // Grava frase no contexto (que sincroniza com o banco e atualiza a KidsHome)
  await addNewPhrase({
    text: phraseText.trim(),
    boardId: selectedBoardId,
    imageUrl: imagePreview || "",
  });

  const chosenBoard = boardOptions.find((b) => b.id === selectedBoardId)?.name;
  setSuccessNotice(`Frase "${phraseText}" adicionada à prancha ${chosenBoard}!`);
  setPhraseText("");
  setImagePreview(null);
  setSelectedBoardId("");
};
```

---

## 7. Controle Parental por PIN (`src/components/PasswordModal.js`)

O modal de senha impede que a criança acesse a área administrativa ou altere frases e configurações acidentalmente.

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (!password) {
    setError("Por favor, digite a senha.");
    return;
  }

  const isValid = verifyParentPassword(password);
  if (isValid) {
    setPassword("");
    setError("");
    onSuccess(); // Altera o currentView para "parents"
  } else {
    setError("Senha incorreta. Tente novamente.");
  }
};
```

---

## 8. Segurança e Banco de Dados (`supabase_schema.sql`)

O arquivo SQL na raiz define a estrutura das tabelas, regras de segurança e automações no PostgreSQL do Supabase.

### Trecho 8.1: Tabela `profiles` com Row Level Security (RLS)

```sql
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

-- Ativação de isolamento estrito:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Por que é seguro?**
- Com o RLS ativo, nenhuma conta consegue ler ou modificar o perfil, PIN ou dados de outra família.

---

### Trecho 8.2: Trigger Automática `handle_new_user()`

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, kid_name, parent_name, parent_pin, avatar_kid, avatar_parent
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'kid_name', ''), 'Nome da criança'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'parent_name', ''), 'Nome do Responsável'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'parent_pin', ''), '1234'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'avatar_kid', ''), 'avatar1'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'avatar_parent', ''), 'parent1')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**O que faz:**
- Sempre que um usuário se cadastra no Supabase Auth, o PostgreSQL executa essa função em nível de banco de dados e cria a linha correspondente em `public.profiles` com os dados informados no formulário de cadastro.

---

### Trecho 8.3: Verificação Prévia de E-mail (`check_user_exists`)

```sql
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
```

**Por que existe esta função?**
- O Supabase Auth por padrão retorna mensagens genéricas (`Invalid login credentials`) por motivos de privacidade. Esta RPC permite que a interface do Eco Kids dê um feedback acolhedor e claro ao usuário, informando quando o e-mail digitado ainda não possui cadastro.

---

## 9. Guia de Consulta Rápida (Onde alterar o quê)

| Se você precisa... | Arquivo a modificar | Linhas / Funções |
| :--- | :--- | :--- |
| **Adicionar uma nova prancha temática** | `src/components/KidsHome.js` | Array `boards` e no array `boardOptions` em `ParentsArea.js` |
| **Mudar ou adicionar frases padrão** | `src/components/KidsHome.js` | Propriedade `phrases: [...]` do board desejado |
| **Ajustar a voz ou velocidade da fala** | `src/components/KidsHome.js` | Função `speak()` (`utterance.rate`, `utterance.lang`) |
| **Alterar as regras de senha do responsável** | `src/context/AuthContext.js` | Função `verifyParentPassword()` |
| **Ajustar o design dos Avatares** | `src/components/Avatars.js` | Componentes `KidAvatar` e `ParentAvatar` |
| **Adicionar novas tabelas ou colunas** | `supabase_schema.sql` | Executar scripts no SQL Editor do Supabase |
| **Trocar as chaves de conexão do Supabase** | `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Modificar cores globais e tema escuro** | `src/app/globals.css` | Variáveis CSS em `:root` e `[data-theme="dark"]` |

---

*Documento gerado para a equipe de desenvolvimento do **Eco Kids**.*
