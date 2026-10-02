# 🌿 Eco Kids

Sistema de comunicação inclusiva e acolhedora para crianças e responsáveis, construído em **React / Next.js** com suporte e integração completa ao **Supabase**.

---

## 📱 Telas Implementadas

1. **Tela 1 - Landing Page & Login / Cadastro (`Tela1.jpeg`)**
   - Cabeçalho com o logotipo oficial Eco Kids e links de navegação.
   - Apresentação visual: *"Sentimentos importam. Aqui, eles têm voz."*, com ilustração, selo de ambiente seguro e quebra-cabeça de 4 peças.
   - Cards com mensagens de acolhimento e explicação sobre o Eco Kids.
   - Modal com abas para **Login** e **Cadastro** com Supabase (ou modo local offline para testes imediatos).

2. **Tela 2 - Homepage Logada Infantil (`Tela2.jpeg`)**
   - Cabeçalho com saudação personalizada (*"Olá, [Nome da criança]"*), avatar da criança com tiara lilás e botão de menu hambúrguer.
   - **9 Pranchas de Comunicação** ilustradas:
     - 🍲 **Alimentação**
     - 🥤 **Bebidas**
     - ⭐ **Diversão**
     - 💖 **Emoções**
     - 👥 **Social**
     - ⏰ **Rotina**
     - 📍 **Lugares**
     - 🌟 **Favoritos**
     - 🧼 **Higiene**
   - Ao tocar em qualquer prancha ou frase, o app utiliza **síntese de voz em português (TTS)** e registra automaticamente os cliques para as métricas da Área dos Pais.

3. **Tela 3 - Menu Lateral & Confirmação de Senha (`Tela3.jpeg`)**
   - Gaveta lateral direita com avatar da criança, nome da criança e identificação do responsável.
   - Itens de navegação: *Alterar avatar*, *Área dos pais*, *Configurações* e *Sair*.
   - Ao selecionar **"Área dos pais"**, é exibido o modal central de confirmação: *"Coloque a senha para prosseguir"* com o botão verde *"Pronto"*.

4. **Tela 4 - Área dos Pais (`Tela4.jpeg`)**
   - Cabeçalho com folha central e saudação ao responsável com avatar.
   - Coluna esquerda de **Métricas de Uso**:
     - *Pranchas mais usadas*: exibe a prancha e contagem de cliques em tempo real.
     - *Frases mais usadas*: exibe a frase e contagem de cliques em tempo real.
   - Coluna direita de **Gerenciamento de Frases**:
     - Dropzone para envio ou escolha de imagem.
     - Campo de texto da nova frase.
     - Seleção da prancha de destino.
     - Salva a frase na prancha da criança com sincronização no banco de dados.
   - Botão para alternar facilmente de volta para o *Modo Criança*.

---

## ⚡ Como Rodar o Projeto

1. Instale as dependências (já instaladas):
   ```bash
   yarn install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   yarn dev
   ```
   Acesse: [http://localhost:3000](http://localhost:3000)

3. Para rodar a suíte de testes de autenticação e métricas:
   ```bash
   yarn test
   ```

4. Para gerar o build de produção:
   ```bash
   yarn build
   ```

---

## 🗄️ Conectando com seu Banco de Dados Supabase

O projeto possui **duplo funcionamento**:
- **Modo Demonstração Instantâneo:** Funciona imediatamente sem configuração externa, salvando sessão, dados e métricas no `localStorage`.
- **Modo Supabase em Nuvem:** Para conectar ao seu projeto Supabase:

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Copie o arquivo `.env.local.example` para `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Preencha suas chaves no `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
   ```
4. Abra o **SQL Editor** no painel do Supabase e execute o conteúdo do arquivo `supabase_schema.sql` gerado na raiz do projeto (cria as tabelas `profiles`, `usage_logs` e `custom_phrases` com Row Level Security).
