# Istruzioni per il Push su GitHub

Il codice è stato committato localmente. Per completare il push su GitHub, hai due opzioni:

## Opzione 1: Usando GitHub CLI (consigliato)

Se hai GitHub CLI installato:

```bash
gh auth login
git push -u origin main
```

## Opzione 2: Usando un Personal Access Token

1. Vai su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Crea un nuovo token con permessi `repo`
3. Quando richiesto durante il push, usa il token come password:

```bash
git push -u origin main
# Username: daniele2105
# Password: [incolla il tuo token]
```

## Opzione 3: Configurare SSH (una volta per tutte)

1. Genera una chiave SSH (se non ce l'hai già):
```bash
ssh-keygen -t ed25519 -C "daniele2105@users.noreply.github.com"
```

2. Aggiungi la chiave pubblica a GitHub:
```bash
cat ~/.ssh/id_ed25519.pub
# Copia l'output e aggiungilo su GitHub → Settings → SSH and GPG keys
```

3. Cambia il remote a SSH:
```bash
git remote set-url origin git@github.com:daniele2105/Work-Planner.git
git push -u origin main
```

## Stato Attuale

✅ Repository Git inizializzato
✅ Tutti i file committati
✅ Branch rinominato a `main`
✅ Remote configurato

⏳ **Manca solo il push finale** - usa una delle opzioni sopra!
