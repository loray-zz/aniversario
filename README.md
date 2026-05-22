# 🔥 Fernando 50 Anos — RSVP App

App de confirmação de presença com IA conversacional (Brasa) + painel admin em tempo real.

---

## Deploy no Vercel — Passo a Passo

### 1. GitHub

1. Crie um repositório no [github.com](https://github.com)
2. Faça upload de todos estes arquivos (ou use `git push`)

### 2. Vercel — Importar o Projeto

1. No Vercel, clique em **"Add New → Project"**
2. Conecte ao GitHub e selecione o repositório
3. Framework Preset: **Vite**
4. Clique em **Deploy** (vai falhar por enquanto — sem as variáveis de ambiente)

### 3. Vercel KV — Criar o Banco

1. No painel do Vercel, vá em **Storage → Create Database**
2. Escolha **KV** e clique em **Create**
3. Na tela do KV, clique em **"Connect Project"** e selecione seu projeto
4. O Vercel injeta as variáveis `KV_URL`, `KV_REST_API_URL`, etc. automaticamente ✅

### 4. Variáveis de Ambiente

No painel do Vercel, vá em **Settings → Environment Variables** e adicione:

| Nome               | Valor                          |
|--------------------|--------------------------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (do console.anthropic.com) |
| `ADMIN_PASSWORD`   | Uma senha forte de sua escolha |

### 5. Redeploy

1. Vá em **Deployments → ⋯ → Redeploy**
2. Aguarde o build finalizar
3. Acesse a URL gerada — o app estará funcionando! 🎉

---

## Funcionalidades

- 🔥 **Landing page** com visual Dark Mode idêntico ao convite
- 💬 **Brasa AI** — chat conversacional que coleta nome, nº de pessoas, WhatsApp, restrições e recado
- ✅ **Tela de sucesso** após confirmação
- 📊 **Painel admin** — clique **5 vezes no "50"** na tela inicial; use a senha definida em `ADMIN_PASSWORD`

---

## Campos coletados por convidado

- Nome completo
- Quantidade de pessoas
- WhatsApp com DDD
- Restrições alimentares
- Mensagem opcional para o Fernando

---

## Estrutura do Projeto

```
├── api/
│   ├── chat.js          ← Proxy para Anthropic (IA Brasa)
│   ├── rsvp.js          ← Salva confirmação no KV
│   └── admin-rsvps.js   ← Lê confirmações (protegido por senha)
├── src/
│   ├── App.jsx          ← Interface React completa
│   └── main.jsx         ← Entry point
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```
