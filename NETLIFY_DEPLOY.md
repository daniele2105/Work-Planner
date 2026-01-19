# 🚀 Deploy su Netlify - Guida Completa

## Metodo 1: Connessione Automatica da GitHub (Consigliato)

### Passo 1: Accedi a Netlify
1. Vai su [https://app.netlify.com](https://app.netlify.com)
2. Accedi con il tuo account GitHub (o crea un account)

### Passo 2: Connetti il Repository
1. Clicca su **"Add new site"** → **"Import an existing project"**
2. Seleziona **"GitHub"** come provider
3. Autorizza Netlify ad accedere ai tuoi repository (se richiesto)
4. Cerca e seleziona **"daniele2105/Work-Planner"**

### Passo 3: Configura il Build
Netlify dovrebbe rilevare automaticamente le impostazioni dal file `netlify.toml`, ma verifica che siano corrette:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Branch to deploy**: `main`

### Passo 4: Deploy!
1. Clicca su **"Deploy site"**
2. Netlify inizierà automaticamente il build e il deploy
3. Attendi qualche minuto per il completamento

### Passo 5: Personalizza l'URL (Opzionale)
1. Vai su **Site settings** → **Change site name**
2. Scegli un nome personalizzato (es. `work-planner-daniele`)
3. Il tuo sito sarà disponibile su: `https://work-planner-daniele.netlify.app`

---

## Metodo 2: Deploy Manuale con Netlify CLI

### Installazione Netlify CLI
```bash
npm install -g netlify-cli
```

### Login
```bash
netlify login
```

### Deploy
```bash
# Build del progetto
npm run build

# Deploy
netlify deploy --prod
```

---

## ⚙️ Configurazione Attuale

Il file `netlify.toml` è già configurato con:
- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ Redirect SPA (Single Page Application)
- ✅ Node version: 18

---

## 🔄 Deploy Automatici

Dopo la configurazione iniziale, Netlify farà automaticamente:
- ✅ **Deploy automatico** ad ogni push su `main`
- ✅ **Preview deploy** per ogni Pull Request
- ✅ **Notifiche** via email o Slack

---

## 📝 Note Importanti

1. **LocalStorage**: I dati sono salvati nel browser dell'utente, non sul server
2. **Password**: La password è salvata localmente, ogni utente ha la sua
3. **HTTPS**: Netlify fornisce SSL automatico per tutti i siti

---

## 🐛 Risoluzione Problemi

### Build Fallisce
- Verifica che tutte le dipendenze siano in `package.json`
- Controlla i log di build su Netlify per errori specifici

### Sito Non Funziona
- Verifica che il `publish directory` sia `dist`
- Controlla che i redirect SPA siano configurati correttamente

### Problemi con date-fns
- Assicurati che la versione di Node sia 18+ (già configurato in `.nvmrc`)

---

## 🎉 Fatto!

Una volta completato il deploy, il tuo Work Planner sarà disponibile pubblicamente su Netlify!
