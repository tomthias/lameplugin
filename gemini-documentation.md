Creazione di un Plugin FigJam per l'Importazione di WorkshopQuesto documento fornisce una guida tecnica completa per lo sviluppo di un plugin per FigJam. L'obiettivo del plugin è automatizzare il processo di trascrizione delle note di un workshop, trasformando un documento di testo strutturato in una board FigJam organizzata. Questa soluzione è pensata per ottimizzare il flusso di lavoro degli strateghi UX e dei loro team, eliminando la necessità di trascrivere manualmente le considerazioni emerse durante le sessioni collaborative.Il plugin analizzerà un file di input, inizialmente in formato Markdown (.md), per generare sezioni titolate e popolarle con note adesive (sticky notes) precompilate. Il documento guiderà lo sviluppatore attraverso l'intero ciclo di vita del progetto: dalla configurazione dell'ambiente di sviluppo all'interazione con l'API di FigJam, fino a delineare una roadmap per una futura integrazione con l'API di Notion. Le tecnologie principali utilizzate sono TypeScript, HTML e l'API per i Plugin di Figma.Parte 1: Fondamenta e Configurazione dell'AmbienteQuesta sezione illustra i passaggi necessari per stabilire un ambiente di sviluppo solido ed efficiente, ponendo le basi per la creazione del plugin. L'adozione degli strumenti e delle pratiche consigliate è fondamentale per accelerare il processo e garantire la manutenibilità del progetto.1.1. Prerequisiti e Concetti FondamentaliPrima di iniziare lo sviluppo, è essenziale disporre degli strumenti corretti e comprendere l'architettura di base dei plugin di Figma.Software Richiesto:Figma Desktop App: È un requisito obbligatorio. Lo sviluppo, il testing e la pubblicazione dei plugin possono essere eseguiti solo tramite l'applicazione desktop per Mac o Windows.1Node.js: È necessario per la gestione delle dipendenze e l'esecuzione degli script di compilazione. Si raccomanda l'uso della versione 22 o successiva.3Editor di Codice: Si consiglia Visual Studio Code, in quanto offre un eccellente supporto per TypeScript, con funzionalità come l'autocompletamento e il type-checking in tempo reale, raccomandate direttamente da Figma.4Architettura del Plugin:I plugin di Figma operano in un ambiente sandboxed con una netta separazione tra la logica principale e l'interfaccia utente (UI).6Logica Principale (code.ts): Questo script viene eseguito nel thread principale di Figma. Ha accesso diretto all'API del canvas tramite l'oggetto globale figma e può creare, modificare ed eliminare nodi (forme, testi, sticky notes, ecc.). Tuttavia, non ha accesso alle API del browser come fetch o localStorage.8Interfaccia Utente (ui.html o .tsx): La UI viene renderizzata all'interno di un iframe isolato. Questo ambiente ha accesso alle API standard del browser, consentendo di effettuare richieste di rete, gestire l'input dell'utente e interagire con il DOM. Crucialmente, la UI non può accedere direttamente all'oggetto figma e quindi non può manipolare il canvas.6La comunicazione tra questi due contesti avviene esclusivamente tramite un sistema di messaggistica basato su eventi, che verrà approfondito nella Parte 2. Comprendere questa architettura a due contesti è il primo passo fondamentale per progettare un plugin funzionale.1.2. Scaffolding del Progetto con create-figma-pluginPer semplificare la configurazione iniziale, si raccomanda vivamente l'utilizzo del toolkit create-figma-plugin.3 Questo strumento non è solo una comodità, ma una best practice consolidata nell'ecosistema di sviluppo di Figma. Automatizza la configurazione di esbuild per compilazioni quasi istantanee, gestisce la compilazione di TypeScript e genera automaticamente i file di progetto necessari, incluso il manifest.json. Questo approccio previene errori comuni di configurazione e migliora significativamente la produttività dello sviluppatore.Per avviare un nuovo progetto con un'interfaccia basata su React, eseguire il seguente comando nel terminale:Bashnpx --yes create-figma-plugin --template plugin/react-editor
Questo comando creerà una directory con la seguente struttura di file essenziale:package.json: Il file centrale del progetto. Contiene gli script npm (per compilare e monitorare le modifiche) e, soprattutto, il blocco di configurazione "figma-plugin", che funge da unica fonte di verità per il manifest del plugin.src/main.ts: Il punto di ingresso per la logica principale del plugin che interagirà con il canvas di FigJam.src/ui.tsx: Il punto di ingresso per il componente React che definirà l'interfaccia utente del plugin.manifest.json: Il file manifest richiesto da Figma. È importante notare che questo file viene generato automaticamente ad ogni compilazione a partire dalle informazioni in package.json. Pertanto, non deve essere modificato manualmente.31.3. Configurazione del Manifest del Plugin (package.json)Tutta la configurazione del plugin va definita all'interno dell'oggetto "figma-plugin" nel file package.json.10 Questa centralizzazione della configurazione è una scelta architetturale deliberata del toolkit create-figma-plugin per garantire coerenza e prevenire la sovrascrittura manuale del manifest.Per questo specifico progetto, la configurazione dovrà includere i seguenti campi chiave:Chiave della ProprietàDescrizioneValore di Esempio per questo ProgettonameIl nome del plugin visualizzato dagli utenti nella community e nell'interfaccia di Figma."Workshop Importer"idUn identificatore unico generato da Figma al momento della prima pubblicazione. Inizialmente può essere omesso.3""editorTypeSpecifica in quali editor di Figma il plugin può essere eseguito. Questo è un campo critico.["figjam"]mainIl percorso del file di entry point per la logica principale del plugin.10"src/main.ts"uiIl percorso del file di entry point per l'interfaccia utente del plugin.10"src/ui.tsx"networkAccessDichiara i domini esterni a cui il plugin necessita di accedere. Obbligatorio per la futura integrazione con Notion.1{ "allowedDomains": ["https://api.notion.com"] }L'impostazione editorType a ["figjam"] è fondamentale. Non è un semplice metadato, ma un interruttore che modifica il contesto di esecuzione del plugin. Solo con questa configurazione, l'ambiente di runtime di Figma esporrà le API specifiche di FigJam, come figma.createSticky() e figma.createSection, che sono il cuore della funzionalità richiesta.5 Senza questa riga, qualsiasi chiamata a queste funzioni fallirebbe.1.4. Compilazione e Installazione del Plugin per lo SviluppoIl file package.json generato da create-figma-plugin include due script principali:npm run build: Esegue una compilazione singola, ottimizzata per la produzione.npm run watch: Avvia un processo di compilazione continua che monitora le modifiche ai file sorgente e ricompila automaticamente il plugin, ideale per lo sviluppo.1Per installare e testare il plugin in locale, seguire questi passaggi:Eseguire npm run watch nel terminale dalla directory del progetto. Questo genererà la directory build/ e il file manifest.json.Aprire l'app desktop di Figma.Aprire un qualsiasi file (preferibilmente un file FigJam per il testing).Utilizzare la barra di ricerca delle azioni rapide (Cmd/Ctrl + /) e cercare "Import plugin from manifest...".Selezionare il file manifest.json generato nella directory del progetto.Il plugin apparirà ora nel menu Plugins > Development, pronto per essere eseguito.11Parte 2: Progettazione dell'Interfaccia Utente del PluginL'interfaccia utente (UI) è il punto di ingresso per l'utente e il canale attraverso cui i dati vengono immessi nel plugin. Anche se semplice, la sua progettazione e implementazione devono rispettare l'architettura sandboxed di Figma.2.1. Architettura della UI e Comunicazione Main-UICome accennato, la UI vive in un iframe isolato.6 La comunicazione tra la UI e la logica principale (main.ts) è unidirezionale e basata su eventi.Dalla UI al Main: La UI invia messaggi al thread principale utilizzando la funzione parent.postMessage().6Dal Main alla UI: Il thread principale ascolta questi messaggi tramite il gestore di eventi figma.ui.onmessage.6Questo meccanismo è l'unico ponte tra i due contesti. È una buona pratica definire una struttura di messaggi chiara, che agisca come un contratto tra le due parti. Un formato comune è un oggetto con una proprietà type per identificare l'azione e un payload (o data) per i dati. Questo approccio trasforma il gestore onmessage in un router scalabile, capace di gestire diverse azioni man mano che il plugin cresce in complessità, evitando la necessità di importanti refactoring futuri.Per l'aspetto visivo, si consiglia di utilizzare una libreria di componenti come @create-figma-plugin/ui, che replica lo stile nativo di Figma e FigJam, garantendo un'esperienza utente coerente e professionale.132.2. Costruzione del Form di Input per il MarkdownLa UI del plugin sarà un semplice form per permettere all'utente di incollare il contenuto del file Markdown. Di seguito è riportato un esempio completo del file src/ui.tsx utilizzando React e la sintassi TypeScript.TypeScript// src/ui.tsx
import { render } from '@create-figma-plugin/ui';
import { h } from 'preact';
import { useState } from 'preact/hooks';
import '!./output.css'; // Assumendo l'uso di Tailwind CSS o CSS custom

function Plugin() {
  const = useState('');

  const handleGenerateClick = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'import-markdown',
          markdown: markdownText,
        },
      },
      '*'
    );
  };

  return (
    <div class="p-4 space-y-4">
      <div class="flex flex-col space-y-2">
        <label for="markdown-input" class="text-xs font-semibold">
          Contenuto Markdown del Workshop
        </label>
        <p class="text-xs text-gray-500">
          Incolla qui le tue note. Usa `##` per i titoli delle sezioni e `-` per le singole sticky notes.
        </p>
        <textarea
          id="markdown-input"
          rows={15}
          className="w-full p-2 border rounded-md text-xs"
          value={markdownText}
          onInput={(e) => setMarkdownText((e.target as HTMLTextAreaElement).value)}
          placeholder="## Sezione 1&#10;- Prima nota&#10;- Seconda nota&#10;&#10;## Sezione 2&#10;- Altra nota"
        />
      </div>
      <button
        onClick={handleGenerateClick}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        disabled={!markdownText.trim()}
      >
        Genera Board
      </button>
    </div>
  );
}

export default render(Plugin);
2.3. Acquisizione e Trasmissione dell'Input UtenteIl codice sopra implementa i seguenti passaggi chiave:Stato Locale: Utilizza l'hook useState di React per mantenere il contenuto della <textarea> in una variabile di stato markdownText.9Gestore di Eventi: La funzione handleGenerateClick viene eseguita al click del pulsante "Genera Board".Invio del Messaggio: All'interno di handleGenerateClick, viene chiamato parent.postMessage. Questo invia un oggetto al thread principale. L'oggetto contiene una chiave pluginMessage con un type ('import-markdown') e il contenuto del Markdown (markdown).9Validazione: Il pulsante è disabilitato se la textarea è vuota, fornendo un feedback visivo immediato all'utente.Parte 3: Parsing del Markdown e Strutturazione dei DatiUna volta che il testo Markdown grezzo viene ricevuto dalla logica principale, deve essere trasformato in una struttura dati organizzata che possa essere facilmente mappata agli oggetti di FigJam. Questa fase di elaborazione è cruciale per la logica del plugin.3.1. Selezione di un Parser MarkdownL'analisi sintattica (parsing) del Markdown è un'attività complessa che richiede una libreria specializzata. Le due opzioni più popolari e ben supportate nell'ecosistema JavaScript sono markdown-it e marked.Caratteristicamarkdown-it 15marked 16VelocitàMolto veloce, prestazioni simili a marked in modalità CommonMark.15Leggermente più veloce nei benchmark semplici.15Conformità100% conforme alle specifiche CommonMark, considerato uno standard di riferimento.Altamente conforme, ma markdown-it è spesso citato per la sua aderenza rigorosa.EstensibilitàAltamente estensibile tramite un robusto sistema di plugin.Estensibile, ma il sistema di plugin di markdown-it è più maturo e flessibile.PopolaritàMolto popolare, ampiamente utilizzato in progetti su larga scala.18Estremamente popolare e con una lunga storia.18Raccomandazione: Per questo progetto, si consiglia l'uso di markdown-it. Sebbene marked possa avere un leggero vantaggio in termini di velocità pura su input semplici, la rigorosa aderenza di markdown-it allo standard CommonMark e la sua superiore architettura a plugin lo rendono una scelta più robusta e scalabile per il futuro.15 La differenza di prestazioni è trascurabile per la quantità di testo che un utente tipicamente incollerà da un workshop.3.2. Definizione della Convenzione dei Dati di InputPer garantire un parsing affidabile, è fondamentale stabilire una convenzione chiara per il formato del file .md di input. Questa convenzione funge da contratto tra l'utente e il plugin.Titolo della Sezione: Qualsiasi riga che inizia con ## (un'intestazione di livello 2 in Markdown) definirà il titolo di una nuova Section in FigJam.Contenuto della Sticky Note: Qualsiasi riga che inizia con -  (un elemento di una lista non ordinata) definirà il testo di una Sticky Note. Ogni sticky note apparterrà all'ultima sezione definita.Tutto il resto (testo normale, altre intestazioni, liste ordinate, ecc.) verrà ignorato.3.3. Implementazione della Logica di ParsingLa logica di parsing deve trasformare la stringa di Markdown in una struttura dati intermedia. Questo disaccoppiamento tra l'analisi dei dati e la loro visualizzazione è un pattern architetturale fondamentale. Permette di modificare la fonte dei dati (ad esempio, passando a Notion) senza dover riscrivere il codice che genera gli oggetti su FigJam.Di seguito è riportata una funzione TypeScript che implementa questa logica.TypeScript// In un file separato, es. src/parser.ts
import MarkdownIt from 'markdown-it';

// Definiamo la nostra struttura dati intermedia
export interface BoardSection {
  sectionTitle: string;
  stickies: string;
}

export function parseMarkdownToBoardStructure(markdown: string): BoardSection {
  const md = new MarkdownIt();
  const tokens = md.parse(markdown, {});

  const boardStructure: BoardSection =;
  let currentSection: BoardSection | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Rileva un'intestazione di livello 2 (##)
    if (token.type === 'heading_open' && token.tag === 'h2') {
      const inlineToken = tokens[i + 1];
      if (inlineToken && inlineToken.type === 'inline') {
        currentSection = {
          sectionTitle: inlineToken.content,
          stickies:,
        };
        boardStructure.push(currentSection);
      }
      i++; // Salta il token inline
    }

    // Rileva un elemento di una lista non ordinata (-)
    if (token.type === 'bullet_list_open' && currentSection) {
      // Itera attraverso gli elementi della lista
      let j = i + 1;
      while (j < tokens.length && tokens[j].type!== 'bullet_list_close') {
        if (tokens[j].type === 'list_item_open') {
          const inlineToken = tokens[j + 1];
          if (inlineToken && inlineToken.type === 'inline') {
            currentSection.stickies.push(inlineToken.content);
          }
        }
        j++;
      }
      i = j; // Salta l'intero blocco della lista
    }
  }

  return boardStructure;
}
Questa funzione analizza il flusso di token generato da markdown-it e costruisce un array di oggetti BoardSection, che rappresenta fedelmente la struttura desiderata per la board di FigJam.Parte 4: Interazione con il Canvas di FigJam tramite l'API del PluginCon i dati strutturati pronti, il passo successivo è tradurli in elementi visivi sulla board di FigJam. Questa sezione si concentra sulle chiamate API specifiche e sulla logica di posizionamento algoritmico.4.1. Creazione delle Sezioni (figma.createSection)Le sezioni sono i contenitori principali per le sticky notes. Vengono create utilizzando la funzione figma.createSection(). Sebbene non esplicitamente dettagliata negli snippet di ricerca, la sua esistenza è una parte fondamentale dell'API di FigJam, seguendo il pattern figma.create<NodeType>().19TypeScript// Esempio di creazione e configurazione di una sezione
const sectionNode = figma.createSection();
sectionNode.name = "Titolo della Sezione";
figma.currentPage.appendChild(sectionNode); // Aggiunge la sezione alla pagina corrente
4.2. Creazione e Popolamento delle Sticky Notes (figma.createSticky)Le sticky notes sono l'elemento centrale del plugin. L'API per crearle è figma.createSticky().5TypeScript// Esempio di creazione di una sticky note
const stickyNode = figma.createSticky();
stickyNode.text.characters = "Contenuto della nota.";

// Aggiunge la sticky note come figlia di una sezione
sectionNode.appendChild(stickyNode);
Un passaggio critico e spesso trascurato è la gestione dei font. Prima di poter assegnare del testo a qualsiasi nodo di testo (incluse le sticky notes), il font utilizzato da quel nodo deve essere caricato in modo asincrono. L'omissione di questo passaggio causerà un errore o un fallimento silenzioso dell'operazione.8TypeScript// Caricamento asincrono del font prima di impostare il testo
const stickyNode = figma.createSticky();
const fontNameToLoad = stickyNode.text.fontName as FontName;
await figma.loadFontAsync(fontNameToLoad);
stickyNode.text.characters = "Contenuto della nota.";
4.3. Layout Algoritmico e PosizionamentoPer evitare che tutti gli elementi vengano creati sovrapposti nell'angolo in alto a sinistra, è necessaria una logica per disporli in modo ordinato sulla board. Un buon layout migliora drasticamente l'usabilità del risultato finale.La strategia consiste nel calcolare le dimensioni e le posizioni prima di creare i nodi, per poi disporli in una griglia flessibile.TypeScript// Funzione di layout principale
async function renderBoard(boardData: BoardSection) {
  const nodesToSelect: SceneNode =;
  const PADDING = 100;
  const STICKY_WIDTH = 200;
  const STICKY_HEIGHT = 100;
  const STICKY_PADDING = 24;
  const STICKIES_PER_ROW = 4;
  
  let currentX = 0;
  let currentY = 0;
  let maxRowHeight = 0;

  for (const sectionData of boardData) {
    // 1. Crea la sezione
    const sectionNode = figma.createSection();
    sectionNode.name = sectionData.sectionTitle;
    figma.currentPage.appendChild(sectionNode);
    nodesToSelect.push(sectionNode);

    // 2. Calcola le dimensioni della sezione
    const numRows = Math.ceil(sectionData.stickies.length / STICKIES_PER_ROW);
    const sectionWidth = (STICKY_WIDTH * STICKIES_PER_ROW) + (STICKY_PADDING * (STICKIES_PER_ROW + 1));
    const sectionHeight = (STICKY_HEIGHT * numRows) + (STICKY_PADDING * (numRows + 1));
    sectionNode.resize(sectionWidth, sectionHeight);

    // 3. Posiziona la sezione
    sectionNode.x = currentX;
    sectionNode.y = currentY;

    // 4. Crea e posiziona le sticky notes all'interno della sezione
    for (let i = 0; i < sectionData.stickies.length; i++) {
      const stickyText = sectionData.stickies[i];
      const stickyNode = figma.createSticky();
      
      // Carica il font
      const font = stickyNode.text.fontName as FontName;
      await figma.loadFontAsync(font);
      stickyNode.text.characters = stickyText;

      // Calcola la posizione relativa alla sezione
      const row = Math.floor(i / STICKIES_PER_ROW);
      const col = i % STICKIES_PER_ROW;
      stickyNode.x = STICKY_PADDING + col * (STICKY_WIDTH + STICKY_PADDING);
      stickyNode.y = STICKY_PADDING + row * (STICKY_HEIGHT + STICKY_PADDING);

      sectionNode.appendChild(stickyNode);
    }
    
    // 5. Aggiorna le coordinate per la prossima sezione
    currentX += sectionWidth + PADDING;
    maxRowHeight = Math.max(maxRowHeight, sectionHeight);

    // Gestione del "wrapping" a una nuova riga
    if (currentX > (sectionWidth * 2 + PADDING)) { // Limite arbitrario di 2 sezioni per riga
        currentX = 0;
        currentY += maxRowHeight + PADDING;
        maxRowHeight = 0;
    }
  }
  
  // Seleziona e zooma sui nodi creati per un feedback immediato
  figma.currentPage.selection = nodesToSelect;
  figma.viewport.scrollAndZoomIntoView(nodesToSelect);
}
Questa funzione non solo crea gli elementi, ma li organizza in una griglia leggibile, calcolando le dimensioni dei contenitori in base al loro contenuto. Questo approccio garantisce che il risultato sia immediatamente utilizzabile, senza richiedere riorganizzazione manuale.Parte 5: Assemblaggio del Flusso di Lavoro CompletoQuesta sezione finale unisce tutti i componenti sviluppati finora — UI, parsing e rendering — in un unico flusso di lavoro coerente all'interno del file main.ts.5.1. Il Controller Logico Principale (main.ts)Il file main.ts agisce da orchestratore. Il suo compito è lanciare la UI, attendere i messaggi e attivare le funzioni appropriate.TypeScript// src/main.ts
import { parseMarkdownToBoardStructure, BoardSection } from './parser';

// Mostra la UI all'avvio del plugin
figma.showUI(__html__, { width: 400, height: 480, title: "Workshop Importer" });

// Gestore di messaggi dalla UI
figma.ui.onmessage = async (msg: { type: string; markdown: string }) => {
  if (msg.type === 'import-markdown') {
    try {
      // 1. Parsa il markdown ricevuto
      const boardData = parseMarkdownToBoardStructure(msg.markdown);

      if (boardData.length === 0) {
        figma.notify('⚠️ Nessuna sezione o nota trovata nel formato corretto.', { error: true });
        return;
      }

      // 2. Renderizza la board sul canvas
      await renderBoard(boardData);

      // 3. Notifica il successo e chiudi il plugin
      figma.notify(`✅ Board generata con ${boardData.length} sezioni.`);
      figma.closePlugin();

    } catch (error) {
      console.error(error);
      figma.notify('❌ Si è verificato un errore durante la generazione della board.', { error: true });
      figma.closePlugin();
    }
  }
};

// La funzione renderBoard() definita nella Parte 4 va inclusa qui o importata
async function renderBoard(boardData: BoardSection) {
    //... implementazione dalla sezione 4.3...
}
5.2. Gestione degli Errori e Feedback all'UtenteUn plugin robusto deve gestire gli errori in modo elegante e fornire un feedback chiaro all'utente. L'uso di un blocco try...catch è essenziale per catturare eccezioni impreviste durante il parsing o la manipolazione del canvas.La funzione figma.notify() è lo strumento principale per comunicare con l'utente. Può visualizzare messaggi di successo, avvisi o errori.14 Fornire messaggi di errore specifici (es. "Formato Markdown non valido") aiuta l'utente a correggere l'input e a riprovare, migliorando notevolmente l'esperienza d'uso.5.3. Codice Finale e Protocollo di TestCon tutti i pezzi al loro posto, il plugin è pronto per essere testato.Protocollo di Test:Assicurarsi che il comando npm run watch sia in esecuzione nel terminale.Nell'app desktop di Figma, aprire un nuovo file FigJam.Eseguire il plugin dal menu Plugins > Development > Workshop Importer.Nella UI del plugin, incollare un testo Markdown che rispetti la convenzione definita (es. ## Titolo e - Nota).Cliccare su "Genera Board".Verifica: Controllare che le sezioni e le sticky notes siano state create e posizionate correttamente sulla board. Il viewport dovrebbe zoomare automaticamente sugli elementi creati.Test di Errore: Eseguire nuovamente il plugin, ma questa volta incollare un testo non valido o vuoto.Verifica: Controllare che venga visualizzata una notifica di errore appropriata e che non vengano creati elementi sulla board.Appendice: Roadmap per l'Integrazione con NotionQuesta sezione delinea i passaggi necessari per estendere il plugin, sostituendo l'input manuale di Markdown con il recupero diretto dei dati da una pagina Notion.A.1. Fondamenti dell'API di Notion e AutenticazionePer interagire con Notion, il plugin dovrà utilizzare l'API REST di Notion.Creazione di un'Integrazione: L'utente dovrà creare una nuova "Integrazione Interna" dal proprio workspace Notion. Questo processo genera un token API segreto.20Gestione del Token: Questo token è sensibile e deve essere gestito in modo sicuro. La UI del plugin dovrà avere un campo di input per permettere all'utente di inserire il proprio token, che verrà utilizzato per le richieste API.Condivisione della Pagina: L'utente deve esplicitamente "condividere" la pagina Notion che desidera importare con l'integrazione appena creata. Senza questo passaggio, l'API restituirà un errore di autorizzazione.20Autenticazione: Tutte le richieste all'API di Notion devono includere un header Authorization con il token, nel formato Bearer YOUR_TOKEN_HERE.23A.2. Recupero del Contenuto della Pagina con il Notion SDKPer semplificare le interazioni con l'API, si raccomanda l'uso del SDK JavaScript ufficiale di Notion, @notionhq/client.23Struttura del Contenuto: Il contenuto di una pagina Notion è rappresentato come una lista di oggetti "blocco".24Endpoint Chiave: L'endpoint principale da utilizzare è blocks.children.list, che restituisce un array paginato di tutti i blocchi di primo livello di una data pagina.24La UI del plugin andrà aggiornata per includere un campo per il token API di Notion e uno per l'ID della pagina Notion. Al click del pulsante, la UI eseguirà una funzione asincrona che:Inizializza il client di Notion con il token fornito.Chiama await notion.blocks.children.list({ block_id: pageId }).Invia l'array di blocchi risultante alla logica principale tramite parent.postMessage.A.3. Adattamento del Parser per la Struttura a Blocchi di NotionGrazie all'architettura disaccoppiata, solo la funzione di parsing (parseMarkdownToBoardStructure) dovrà essere modificata (o affiancata da una nuova funzione). La logica di rendering (renderBoard) rimarrà invariata.La nuova funzione di parsing dovrà iterare sull'array di blocchi di Notion invece che sui token di Markdown. La convenzione di mappatura sarà:Un blocco di tipo 'heading_2' corrisponde a una nuova sezione. Il testo si trova in block.heading_2.rich_text.plain_text.25Un blocco di tipo 'bulleted_list_item' corrisponde a una nuova sticky note. Il testo si trova in block.bulleted_list_item.rich_text.plain_text.24La nuova funzione di parsing accetterà l'array di blocchi di Notion e restituirà la stessa struttura dati intermedia BoardSection. Questo dimostra la potenza e la flessibilità di aver separato la logica di acquisizione e trasformazione dei dati dalla logica di presentazione.