import { createClient } from "@supabase/supabase-js";

// Credenciais públicas do Supabase (lidas do ambiente ou fallback público do projeto)
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

// Create client safely: if url is not valid or empty, provide a dummy client to avoid startup crash
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

// Helper para obter URL pública de arquivos no Supabase Storage
export function getStoragePublicUrl(bucket, path) {
  if (supabase?.storage) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) return data.publicUrl;
  }
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  if (baseUrl) {
    return `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path}`;
  }
  return "";
}

// Local storage keys
const STORAGE_USER_KEY = "eco_kids_user";
const STORAGE_STATS_KEY = "eco_kids_stats";
const STORAGE_PHRASES_KEY = "eco_kids_custom_phrases";

// Helper para verificar se um e-mail/usuário já existe no Supabase
export async function checkUserExists(email) {
  if (!isSupabaseConfigured() || !supabase || !email) return null;
  try {
    const { data, error } = await supabase.rpc("check_user_exists", {
      email_input: email.trim().toLowerCase(),
    });
    if (error) {
      return null;
    }
    return Boolean(data);
  } catch {
    return null;
  }
}

// Helpers for Auth and Database
export async function authSignUp({ email, password, kidName, parentName, pin }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      "O Supabase não está configurado. O cadastro deve ser realizado exclusivamente pelo Supabase. Verifique as credenciais no arquivo .env."
    );
  }

  const cleanEmail = email ? email.trim() : "";
  if (!cleanEmail || !password) {
    throw new Error("Por favor, preencha o e-mail e a senha.");
  }

  // Verificar se o usuário já existe no Supabase antes de cadastrar
  const alreadyExists = await checkUserExists(cleanEmail);
  if (alreadyExists === true) {
    throw new Error(
      "Este e-mail já está cadastrado. Por favor, acesse a aba Entrar para fazer login."
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        kid_name: kidName || "Nome da criança",
        parent_name: parentName || "Nome do Responsável",
        parent_pin: pin || password || "1234",
        avatar_kid: "avatar1",
        avatar_parent: "parent1",
      },
    },
  });

  if (error) {
    const err = new Error(error.message || "Erro ao realizar cadastro no Supabase.");
    err.code = error.code;
    err.status = error.status;
    throw err;
  }

  // Supabase retorna identities vazio quando o e-mail já existe
  if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error(
      "Este e-mail já está cadastrado. Por favor, acesse a aba Entrar para fazer login."
    );
  }

  // Create or update profiles row if table exists
  if (data?.user) {
    try {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: cleanEmail,
        kid_name: kidName || "Nome da criança",
        parent_name: parentName || "Nome do Responsável",
        parent_pin: pin || password || "1234",
        avatar_kid: "avatar1",
        avatar_parent: "parent1",
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Tabela profiles não configurada no Supabase ainda:", e);
    }
  }

  return {
    user: data.user,
    session: data.session,
    profile: {
      id: data.user?.id,
      email: cleanEmail,
      kidName: kidName || "Nome da criança",
      parentName: parentName || "Nome do Responsável",
      parentPin: pin || password || "1234",
      avatarKid: "avatar1",
      avatarParent: "parent1",
      isAdmin: false,
    },
  };
}

export async function authSignIn({ email, password }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error(
      "O Supabase não está configurado. O login deve ser realizado exclusivamente pelo Supabase. Verifique suas variáveis de ambiente no arquivo .env."
    );
  }

  const cleanEmail = email ? email.trim() : "";
  if (!cleanEmail || !password) {
    throw new Error("Por favor, preencha o e-mail e a senha.");
  }

  // 1. Verificar se usuário existe no Supabase (se RPC check_user_exists estiver configurada)
  const userExists = await checkUserExists(cleanEmail);
  if (userExists === false) {
    const err = new Error(
      "Usuário não encontrado. Este e-mail não possui cadastro. Crie sua conta na aba Cadastrar."
    );
    err.code = "user_not_found";
    err.status = 404;
    throw err;
  }

  // 2. Realizar autenticação no Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.message?.toLowerCase().includes("invalid login credentials")
    ) {
      const msg =
        userExists === true
          ? "Senha incorreta. Verifique sua senha e tente novamente."
          : "Usuário não encontrado ou senha incorreta. Se você ainda não possui cadastro, crie sua conta na aba Cadastrar.";
      const err = new Error(msg);
      err.code = "invalid_credentials";
      err.status = error.status || 400;
      throw err;
    }

    if (
      error.code === "email_not_confirmed" ||
      error.message?.toLowerCase().includes("email not confirmed")
    ) {
      const err = new Error(
        "E-mail ainda não confirmado. Por favor, verifique sua caixa de entrada para confirmar o e-mail antes de entrar (ou desative a confirmação de e-mail no painel do Supabase)."
      );
      err.code = "email_not_confirmed";
      err.status = error.status || 400;
      throw err;
    }

    const err = new Error(error.message || "Erro ao realizar login no Supabase.");
    err.code = error.code;
    err.status = error.status;
    throw err;
  }

  const metadataIsAdmin = Boolean(
    data.user?.app_metadata?.is_admin ||
    data.user?.app_metadata?.role === "admin" ||
    data.user?.user_metadata?.is_admin ||
    data.user?.user_metadata?.isAdmin
  );

  let profile = {
    id: data.user.id,
    email: data.user.email,
    kidName: data.user.user_metadata?.kid_name || "Nome da criança",
    parentName: data.user.user_metadata?.parent_name || "Responsável",
    parentPin: data.user.user_metadata?.parent_pin || password,
    avatarKid: data.user.user_metadata?.avatar_kid || "avatar1",
    avatarParent: data.user.user_metadata?.avatar_parent || "parent1",
    isAdmin: metadataIsAdmin,
  };

  let needsProfileSetup = false;

  try {
    let { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileErr) {
      console.warn("Aviso ao buscar perfil na tabela profiles:", profileErr.message);
    }

    // Se a linha ainda não existe na tabela profiles, cria automaticamente
    if (!profileData) {
      try {
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
        const { data: created } = await supabase
          .from("profiles")
          .upsert(autoProfile)
          .select()
          .maybeSingle();
        if (created) profileData = created;
      } catch (insertErr) {
        console.warn("Aviso ao auto-criar perfil:", insertErr.message);
      }
    }

    const isAdmin = Boolean(profileData?.is_admin || metadataIsAdmin);

    if (profileData) {
      profile = {
        ...profile,
        kidName: profileData.kid_name || profile.kidName,
        parentName: profileData.parent_name || profile.parentName,
        parentPin: profileData.parent_pin || profile.parentPin,
        avatarKid: profileData.avatar_kid || profile.avatarKid,
        avatarParent: profileData.avatar_parent || profile.avatarParent,
        isAdmin,
      };

      const isDefaultKid = !profileData.kid_name || profileData.kid_name === "Nome da criança";
      const isDefaultParent =
        !profileData.parent_name ||
        profileData.parent_name === "Nome do Responsável" ||
        profileData.parent_name === "Responsável";

      if (isDefaultKid || isDefaultParent) {
        needsProfileSetup = true;
      }
    } else {
      // Usuário no Auth mas sem registro vinculado na tabela profiles
      needsProfileSetup = true;
      profile.isAdmin = isAdmin;
    }
  } catch {
    needsProfileSetup = true;
  }

  const enrichedUser = {
    ...data.user,
    isAdmin: profile.isAdmin,
  };

  return { user: enrichedUser, profile, needsProfileSetup };
}

export async function authSignOut() {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
}

export async function uploadAvatar(file) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const ext = file.name ? file.name.split(".").pop() : "png";
      const fileName = `avatars/kid-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("ecokids")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!error && data) {
        return getStoragePublicUrl("ecokids", fileName);
      }
    } catch (e) {
      console.warn("Aviso ao enviar avatar para o bucket Supabase:", e);
    }
  }
  return null;
}

export async function authResetPassword(email) {
  if (isSupabaseConfigured() && supabase) {
    const redirectTo =
      typeof window !== "undefined" && window.location?.href
        ? window.location.href.split("#")[0].split("?")[0]
        : undefined;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
    return data;
  } else {
    // Simulação no modo de demonstração local
    return { message: "Simulação: link de redefinição enviado para o email." };
  }
}

export async function updateProfile(profileData) {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (user?.id) {
        const payload = {
          id: user.id,
          email: user.email,
          updated_at: new Date().toISOString(),
        };
        if (profileData.kidName !== undefined) payload.kid_name = profileData.kidName;
        if (profileData.parentName !== undefined) payload.parent_name = profileData.parentName;
        if (profileData.parentPin !== undefined) payload.parent_pin = profileData.parentPin;
        if (profileData.avatarKid !== undefined) payload.avatar_kid = profileData.avatarKid;
        if (profileData.avatarParent !== undefined) payload.avatar_parent = profileData.avatarParent;

        // Upsert no banco de dados (public.profiles) garante criação ou atualização
        const { error: dbError } = await supabase
          .from("profiles")
          .upsert(payload);

        if (dbError) {
          console.warn("Aviso ao salvar perfil no Supabase:", dbError.message);
          throw dbError;
        }

        // Também sincroniza os metadados do usuário no Auth
        try {
          await supabase.auth.updateUser({
            data: {
              ...(profileData.kidName !== undefined ? { kid_name: profileData.kidName } : {}),
              ...(profileData.parentName !== undefined ? { parent_name: profileData.parentName } : {}),
              ...(profileData.parentPin !== undefined ? { parent_pin: profileData.parentPin } : {}),
              ...(profileData.avatarKid !== undefined ? { avatar_kid: profileData.avatarKid } : {}),
              ...(profileData.avatarParent !== undefined ? { avatar_parent: profileData.avatarParent } : {}),
            },
          });
        } catch {
          // ignora erro em metadados se houver
        }
      }
    } catch (err) {
      console.warn("Erro ao salvar perfil no Supabase:", err);
      throw err;
    }
  }
}

export async function getSavedSession() {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      const user = data.session.user;
      const metadataIsAdmin = Boolean(
        user?.app_metadata?.is_admin ||
        user?.app_metadata?.role === "admin" ||
        user?.user_metadata?.is_admin ||
        user?.user_metadata?.isAdmin
      );

      let profile = {
        id: user.id,
        email: user.email,
        kidName: user.user_metadata?.kid_name || "Nome da criança",
        parentName: user.user_metadata?.parent_name || "Responsável",
        parentPin: user.user_metadata?.parent_pin || "",
        avatarKid: user.user_metadata?.avatar_kid || "avatar1",
        avatarParent: user.user_metadata?.avatar_parent || "parent1",
        isAdmin: metadataIsAdmin,
      };

      let needsProfileSetup = false;

      try {
        let { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!profileData) {
          try {
            const autoProfile = {
              id: user.id,
              email: user.email,
              kid_name: user.user_metadata?.kid_name || "Nome da criança",
              parent_name: user.user_metadata?.parent_name || "Nome do Responsável",
              parent_pin: user.user_metadata?.parent_pin || "1234",
              avatar_kid: user.user_metadata?.avatar_kid || "avatar1",
              avatar_parent: user.user_metadata?.avatar_parent || "parent1",
              is_admin: metadataIsAdmin,
            };
            const { data: created } = await supabase
              .from("profiles")
              .upsert(autoProfile)
              .select()
              .maybeSingle();
            if (created) profileData = created;
          } catch {
            // ok
          }
        }

        const isAdmin = Boolean(profileData?.is_admin || metadataIsAdmin);

        if (profileData) {
          profile = {
            ...profile,
            kidName: profileData.kid_name || profile.kidName,
            parentName: profileData.parent_name || profile.parentName,
            parentPin: profileData.parent_pin || profile.parentPin,
            avatarKid: profileData.avatar_kid || profile.avatarKid,
            avatarParent: profileData.avatar_parent || profile.avatarParent,
            isAdmin,
          };

          const isDefaultKid = !profileData.kid_name || profileData.kid_name === "Nome da criança";
          const isDefaultParent =
            !profileData.parent_name ||
            profileData.parent_name === "Nome do Responsável" ||
            profileData.parent_name === "Responsável";

          if (isDefaultKid || isDefaultParent) {
            needsProfileSetup = true;
          }
        } else {
          // Sem perfil no banco
          needsProfileSetup = true;
          profile.isAdmin = isAdmin;
        }
      } catch {
        needsProfileSetup = true;
      }

      const enrichedUser = {
        ...user,
        isAdmin: profile.isAdmin,
      };

      return { user: enrichedUser, profile, needsProfileSetup };
    }
  }

  // Remove qualquer resquício de mock user no localStorage para garantir que apenas o Supabase autentique
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  return null;
}

// Log stats
export async function logUsage(type, name, boardId = "") {
  if (typeof window === "undefined") return;

  let currentStats = {
    boards: {},
    phrases: {},
  };

  const stored = localStorage.getItem(STORAGE_STATS_KEY);
  if (stored) {
    try {
      currentStats = JSON.parse(stored);
    } catch {
      // reset
    }
  }

  if (type === "board") {
    currentStats.boards[name] = (currentStats.boards[name] || 0) + 1;
  } else if (type === "phrase") {
    currentStats.phrases[name] = (currentStats.phrases[name] || 0) + 1;
  }

  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(currentStats));

  // Sync to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        await supabase.from("usage_logs").insert({
          user_id: userId,
          type,
          item_name: name,
          board_id: boardId,
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      // silence
    }
  }
}

export function getStatsData() {
  if (typeof window === "undefined") {
    return {
      topBoard: { name: "Alimentação", count: 12 },
      topPhrase: { name: "Quero comer", count: 8 },
    };
  }

  const stored = localStorage.getItem(STORAGE_STATS_KEY);
  if (stored) {
    try {
      const stats = JSON.parse(stored);
      let topBoard = { name: "Alimentação", count: 12 };
      let topPhrase = { name: "Quero comer", count: 8 };

      if (stats.boards && Object.keys(stats.boards).length > 0) {
        const sortedBoards = Object.entries(stats.boards).sort((a, b) => b[1] - a[1]);
        if (sortedBoards[0]) {
          topBoard = { name: sortedBoards[0][0], count: sortedBoards[0][1] };
        }
      }

      if (stats.phrases && Object.keys(stats.phrases).length > 0) {
        const sortedPhrases = Object.entries(stats.phrases).sort((a, b) => b[1] - a[1]);
        if (sortedPhrases[0]) {
          topPhrase = { name: sortedPhrases[0][0], count: sortedPhrases[0][1] };
        }
      }

      return { topBoard, topPhrase };
    } catch {
      // fallback
    }
  }

  return {
    topBoard: { name: "Alimentação", count: 12 },
    topPhrase: { name: "Quero comer", count: 8 },
  };
}

// Helper para resolver URL de imagem (seja URL externa, data URI ou caminho no bucket ecokids)
export function resolveCustomImageUrl(imageUrl) {
  if (!imageUrl) return "";
  const trimmed = String(imageUrl).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^ecokids\//, "");
  return getStoragePublicUrl("ecokids", cleanPath);
}

// Custom phrases management
export async function saveCustomPhrase(phrase) {
  if (typeof window === "undefined") return;

  const phraseText = phrase.text || phrase.phrase_text || "";
  const boardId = phrase.boardId || phrase.board_id || "";
  const imageUrl = phrase.image_url || phrase.imageUrl || "";

  let phrases = [];
  const stored = localStorage.getItem(STORAGE_PHRASES_KEY);
  if (stored) {
    try {
      phrases = JSON.parse(stored);
    } catch {
      // ok
    }
  }

  let newPhrase = {
    id: "phrase-" + Date.now(),
    text: phraseText,
    phrase_text: phraseText,
    boardId: boardId,
    board_id: boardId,
    imageUrl: imageUrl,
    image_url: imageUrl,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        const { data: inserted, error } = await supabase
          .from("custom_phrases")
          .insert({
            user_id: userId,
            phrase_text: phraseText,
            board_id: boardId,
            image_url: imageUrl,
          })
          .select()
          .single();

        if (error) {
          console.warn("Aviso ao salvar frase no Supabase:", error.message);
        } else if (inserted) {
          newPhrase = {
            id: inserted.id,
            text: inserted.phrase_text,
            phrase_text: inserted.phrase_text,
            boardId: inserted.board_id,
            board_id: inserted.board_id,
            imageUrl: inserted.image_url || "",
            image_url: inserted.image_url || "",
            createdAt: inserted.created_at,
          };
        }
      }
    } catch (e) {
      console.warn("Erro ao salvar frase no Supabase:", e);
    }
  }

  phrases.push(newPhrase);
  localStorage.setItem(STORAGE_PHRASES_KEY, JSON.stringify(phrases));
  return newPhrase;
}

export async function getCustomPhrases() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (userId) {
        const { data, error } = await supabase
          .from("custom_phrases")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (!error && data) {
          const mapped = data.map((item) => ({
            id: item.id,
            text: item.phrase_text,
            phrase_text: item.phrase_text,
            boardId: item.board_id,
            board_id: item.board_id,
            imageUrl: item.image_url || "",
            image_url: item.image_url || "",
            createdAt: item.created_at,
          }));

          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_PHRASES_KEY, JSON.stringify(mapped));
          }
          return mapped;
        }
      }
    } catch (err) {
      console.warn("Aviso ao buscar frases customizadas no Supabase:", err);
    }
  }

  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_PHRASES_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((item) => ({
        ...item,
        text: item.text || item.phrase_text || "",
        phrase_text: item.phrase_text || item.text || "",
        boardId: item.boardId || item.board_id || "",
        board_id: item.board_id || item.boardId || "",
        imageUrl: item.image_url || item.imageUrl || "",
        image_url: item.image_url || item.imageUrl || "",
      }));
    } catch {
      return [];
    }
  }
  return [];
}

// Buscar todos os usuários cadastrados (apenas para administrador)
export async function getAllProfiles() {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.rpc("get_all_profiles");
    if (error) {
      console.error("Erro ao buscar usuários (admin):", error);
      throw error;
    }
    return (data || []).map((p) => ({
      id: p.id,
      email: p.email,
      kidName: p.kid_name || "Nome da criança",
      parentName: p.parent_name || "Nome do Responsável",
      isAdmin: Boolean(p.is_admin),
      createdAt: p.created_at,
    }));
  }

  return [];
}
