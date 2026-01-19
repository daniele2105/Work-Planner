# Work Planner - Pianificazione Intelligente

Un'applicazione web moderna per la pianificazione intelligente dei giorni lavorativi con supporto per Smart Working, gestione festività italiane e monitoraggio quote.

## 🚀 Funzionalità

### 📅 Pianificazione Intelligente
- **Calendario Interattivo**: Vista mensile stile Google Calendar con gestione giorni tramite click
- **Tipi di Giornata**: Smart Working, Ufficio, Ferie o Non Lavorativo
- **Regole Automatiche**: Imposta la settimana tipo e il calendario si compilerà automaticamente

### 🇮🇹 Gestione Festività
- **Festività Nazionali**: Calcolo automatico di tutte le festività italiane (inclusi Pasqua e Lunedì dell'Angelo)
- **Festività Locali Custom**: Aggiungi ricorrenze personali o locali che si ripetono ogni anno

### 📊 Monitoraggio e Soglie
- **Quota Smart**: Monitora il limite di 12 giorni di smart working al mese con avvisi visivi
- **Riepiloghi Mensili**: Statistiche dettagliate su giorni lavorativi, giorni effettivi e suddivisione per tipologia

### 🛠️ Funzioni Extra
- **Export CSV**: Scarica report completo del mese per la rendicontazione
- **Sicurezza**: Accesso protetto da password con sessione persistente (7 giorni)
- **Design Moderno**: Interfaccia pulita, responsive e curata nei dettagli grafici

## 🛠️ Installazione

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

## 📦 Tecnologie Utilizzate

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool veloce
- **date-fns** - Gestione date
- **CSS Modules** - Styling modulare

## 🎯 Utilizzo

1. **Primo Accesso**: Imposta una password per proteggere i tuoi dati
2. **Calendario**: Clicca su un giorno per impostare il tipo di giornata
3. **Regole**: Vai su Impostazioni > Regole Settimanali per impostare pattern automatici
4. **Festività**: Aggiungi festività locali in Impostazioni > Festività Locali
5. **Statistiche**: Visualizza statistiche mensili e esporta in CSV

## 📝 Note

- I dati sono salvati localmente nel browser (localStorage)
- La sessione dura 7 giorni
- Le festività nazionali italiane sono calcolate automaticamente ogni anno
- La quota smart working è impostata a 12 giorni/mese (modificabile nel codice)

## 🔒 Sicurezza

L'applicazione utilizza password locale per proteggere i dati. La password è salvata in chiaro nel localStorage del browser. Per uso in produzione, si consiglia di implementare autenticazione server-side.

## 📄 Licenza

MIT
