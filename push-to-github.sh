#!/bin/bash

echo "🚀 Push su GitHub - Work Planner"
echo "================================"
echo ""
echo "Questo script ti aiuterà a completare il push su GitHub."
echo ""

# Verifica che siamo nel branch main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  Attenzione: sei sul branch $current_branch, non su main"
    read -p "Vuoi continuare comunque? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

echo "📦 Stato del repository:"
git status --short
echo ""

echo "🔐 Per autenticarti su GitHub, hai due opzioni:"
echo ""
echo "1️⃣  Personal Access Token (consigliato):"
echo "   - Vai su: https://github.com/settings/tokens"
echo "   - Crea un nuovo token con permessi 'repo'"
echo "   - Quando richiesto:"
echo "     Username: daniele2105"
echo "     Password: [incolla il tuo token]"
echo ""
echo "2️⃣  GitHub CLI:"
echo "   - Installa: sudo apt install gh (o brew install gh)"
echo "   - Esegui: gh auth login"
echo ""

read -p "Premi INVIO quando sei pronto per il push... " -r
echo ""

echo "🔄 Tentativo di push..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push completato con successo!"
    echo "🌐 Vedi il tuo repository su: https://github.com/daniele2105/Work-Planner"
else
    echo ""
    echo "❌ Push fallito. Possibili cause:"
    echo "   - Credenziali non valide"
    echo "   - Token scaduto o senza permessi"
    echo "   - Problemi di connessione"
    echo ""
    echo "💡 Suggerimenti:"
    echo "   - Verifica le tue credenziali GitHub"
    echo "   - Assicurati che il token abbia permessi 'repo'"
    echo "   - Prova a usare GitHub CLI: gh auth login"
fi
