# Lame FigJam Plugin

Plugin scaffolding per FigJam con configurazione TypeScript base.

## Setup Ambiente di Sviluppo

1. **Installare Node.js e npm**
   ```bash
   # Verifica installazione
   node --version
   npm --version
   ```

2. **Installare dipendenze**
   ```bash
   npm install
   ```

3. **Compilare TypeScript**
   ```bash
   # Build singolo
   npm run build
   
   # Watch mode per sviluppo
   npm run watch
   ```

## Struttura Progetto

```
lame/
├── manifest.json       # Configurazione plugin
├── package.json        # Dipendenze npm
├── tsconfig.json      # Configurazione TypeScript
├── ui.html           # Interfaccia utente HTML
├── src/
│   └── code.ts       # Codice principale plugin
└── dist/             # File compilati (generati)
```

## Come Usare il Plugin in Figma

1. Aprire Figma Desktop App
2. Andare in **Plugins > Development > Import plugin from manifest**
3. Selezionare il file `manifest.json` del progetto
4. Il plugin apparirà nella lista dei plugin di sviluppo

## Sviluppo

1. Modificare i file in `src/`
2. Compilare con `npm run watch` (modalità continua)
3. Ricaricare il plugin in Figma per testare le modifiche

## File Principali

### manifest.json
Configurazione del plugin con metadata, permessi e entry points.

### src/code.ts
Codice principale che viene eseguito nel context di Figma. Gestisce la logica del plugin.

### ui.html
Interfaccia utente HTML con CSS e JavaScript per l'interazione con l'utente.

## API Figma

Il plugin utilizza l'API Figma attraverso l'oggetto globale `figma`:
- `figma.showUI()` - Mostra UI personalizzata
- `figma.createRectangle()` - Crea forme
- `figma.currentPage` - Pagina corrente
- `figma.ui.onmessage` - Comunica tra UI e codice principale

## Prossimi Passi

1. Personalizzare il nome del plugin in `manifest.json`
2. Modificare `src/code.ts` per la tua logica specifica
3. Aggiornare `ui.html` con la tua interfaccia
4. Aggiungere funzionalità specifiche per FigJam (sticky notes, connectors, etc.)