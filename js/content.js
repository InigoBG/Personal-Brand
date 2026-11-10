// Pure data. No side effects on import (ruling R4). Copy follows spec §4, §6, §8.

export const EXPERIENCE = [
  {
    n: '01',
    dates: 'May–Dec 2022 · Sep 2024 – May 2025',
    role: 'Corporate/M&A trainee',
    org: 'ONTIER Madrid',
    story: 'On the deal team in Madrid: cross-border work between Spain and Latin America, with the due-diligence review done in virtual data rooms.',
    points: [
      '8–10 deals and 3 due diligences.',
      'Spain–Latin America deals involving Peru, Argentina, Colombia and Mexico: purchase agreements and a restructuring.',
      'Earlier: ONTIER Lima (2017).',
    ],
    tags: ['M&A', 'Due diligence', 'Spain–LatAm'],
  },
  {
    n: '02',
    dates: 'May 2025 – Jan 2026',
    role: 'Co-founder',
    org: 'Agentic Labs',
    story: 'Legal AI that began as a retrieval (RAG) tool and became an agentic workflow. It drafted first versions of SPAs and SHAs from the firm\'s own documents, for lawyer review. I led sales and leads, plus the backend; my co-founder led the interface and code review.',
    points: [
      // the funnel facts (FUNNEL, FUNNEL_NOTE, PILOT_USAGE, NDA line) live in the sales proof block, not here
      'The buyer was the managing partner.',
      'Lesson: firms want AI, but their document storage is not AI-ready, and older users need hands-on training.',
      'Closed because hosting costs did not fit what small and mid-sized firms would pay.',
    ],
    tags: ['Agentic workflows', 'Sales', 'Backend', 'TypeScript', 'Postgres'],
  },
  {
    n: '03',
    dates: 'Jan 2026 – present',
    role: 'AI product builder',
    org: 'Independent',
    story: 'Since Agentic Labs closed, I have kept building: paid work for clients, under NDA, and my own apps alongside it.',
    points: [
      'Product builds for founders and companies with an idea but no technical team.',
      'Websites for clients who came through referrals.',
      'Own apps for iOS, macOS and the web.',
    ],
    tags: ['Product builds', 'SwiftUI', 'Shopify'],
  },
];

export const FUNNEL = [
  { key: 'contacted', value: '25+' },
  { key: 'met', value: 'About half' },
  { key: 'paid', value: '3' },
];

export const FUNNEL_NOTE = 'Paid for document analysis, vectorisation and a trial run.';

export const PILOT_USAGE = 'About 20 lawyers took part in the pilots; pilot users prompted it 10–15 times a day for 2–3 finished documents.';

export const PROJECTS = [
  { name: 'Agentic Labs', line: 'Legal AI that drafts SPAs and SHAs from a firm\'s own precedents.', stack: ['Claude Opus', 'Kimi K2', 'TypeScript', 'Postgres', 'AWS'], status: 'Archived' },
  { name: 'Liftlog', line: 'iOS strength-training app with its own sync backend.', stack: ['SwiftUI', 'SwiftData', 'FastAPI', 'PostgreSQL with row-level security'], status: 'In development' },
  { name: 'Fanout', line: 'iOS app that publishes one video to 13+ platforms at once, with checks before upload and a scheduling backend.', stack: ['SwiftUI', 'Cloudflare Workers (Hono, TypeScript)', 'D1', 'R2', 'OAuth broker with encrypted tokens', 'Scheduled jobs'], status: 'In development' },
  { name: 'Grano', line: 'Nutrition tracker for iPhone and Mac. Local-first, in English, Spanish and French, with a bundled food database.', stack: ['SwiftUI', 'Modular Swift packages', 'Bundled USDA and Ciqual food database', 'iCloud Drive sync'], status: 'In development' },
  { name: 'Clementine', line: 'macOS file converter that works offline.', stack: ['Swift', 'AppKit', 'SwiftUI'], status: 'In development' },
  { name: 'Casa Manjar', line: 'Online shop for a Madrid bakery.', stack: ['Custom Shopify theme'], status: 'In development' },
];

// title and line are i18n keys; Task 6 adds them to i18n.js.
export const LATAM_TIERS = [
  { id: 'home', countries: ['PER'], title: 'latam.tier.home.title', line: 'latam.tier.home.line' },
  { id: 'worked', countries: ['MEX', 'COL'], title: 'latam.tier.worked.title', line: 'latam.tier.worked.line' },
  { id: 'network', countries: ['ECU', 'CHL', 'CRI', 'BOL', 'HND', 'SLV'], title: 'latam.tier.network.title', line: 'latam.tier.network.line' },
];


// contract: {id, name, short, pages, cells}
// cell: [risk 'hi'|'mid'|'lo', answer, ref ('—' when no clause), quote (string with {{…}} highlights, or null)]
export const DEMO = {
  questions: [
    { id: 'coc', label: 'Change of control' },
    { id: 'ces', label: 'Assignment' },
    { id: 'ley', label: 'Governing law & forum' },
    { id: 'lim', label: 'Liability cap' },
    { id: 'dur', label: 'Term & exit' },
  ],
  contracts: [
    {
      id: 'loan', name: "Préstamo sindicado · Banco Ibérico y otros", short: "Préstamo sindicado", pages: 58,
      cells: {
        coc: ["hi","Sí. Es supuesto de vencimiento anticipado si un tercero adquiere el control sin consentimiento de la Mayoría de Prestamistas.","Cl. 21.1(f)","Constituirá Supuesto de Vencimiento Anticipado que {{cualquier persona o grupo de personas actuando de forma concertada adquiera el Control de la Acreditada}} sin el consentimiento previo de la Mayoría de las Entidades Acreditantes."],
        ces: ["mid","La acreditada no puede ceder. Las entidades sí, a otras entidades de crédito.","Cl. 27.2","La Acreditada {{no podrá ceder ni transmitir sus derechos u obligaciones}} bajo el presente Contrato. Las Entidades Acreditantes podrán ceder su posición a cualquier entidad de crédito."],
        ley: ["lo","Ley española. Juzgados y tribunales de Madrid capital.","Cl. 32","El presente Contrato se regirá por la {{legislación común española}}. Las partes se someten a los {{Juzgados y Tribunales de Madrid capital}}."],
        lim: ["mid","Sin límite a favor de la acreditada. Indemnidad amplia a las entidades.","Cl. 24","La Acreditada {{mantendrá indemnes a las Entidades Acreditantes}} frente a cualquier coste, pérdida o responsabilidad derivada del presente Contrato."],
        dur: ["mid","Vencimiento final 30/06/2028. Covenant DFN/EBITDA ≤ 3,00x.","Cl. 8 y 19.3","La Fecha de Vencimiento Final será el {{30 de junio de 2028}}. La Acreditada se obliga a mantener un {{ratio Deuda Financiera Neta / EBITDA no superior a 3,00x}}."],
      },
    },
    {
      id: 'dist', name: "Distribución exclusiva · Distribuidora Levante, S.L.", short: "Distribución Levante", pages: 22,
      cells: {
        coc: ["lo","No hay cláusula de cambio de control.","—",null],
        ces: ["mid","Solo con consentimiento previo y escrito de la otra parte.","Cl. 18","Ninguna de las Partes podrá ceder su posición contractual {{sin el consentimiento previo y por escrito}} de la otra Parte."],
        ley: ["lo","Ley española. Arbitraje de la Corte de Arbitraje de Madrid.","Cl. 22","Cualquier controversia será resuelta definitivamente mediante {{arbitraje administrado por la Corte de Arbitraje de Madrid}}."],
        lim: ["mid","Limitada a lo facturado en los 12 meses anteriores, salvo dolo.","Cl. 16","La responsabilidad total de cada Parte {{no excederá del importe facturado en los doce (12) meses anteriores}}, salvo en caso de dolo."],
        dur: ["mid","Indefinido, 6 meses de preaviso. Riesgo de indemnización por clientela por analogía con la Ley de Agencia.","Cl. 20","Cualquiera de las Partes podrá resolver el Contrato {{con un preaviso mínimo de seis (6) meses}}."],
      },
    },
    {
      id: 'lease', name: "Arrendamiento de nave industrial · Getafe", short: "Arrendamiento Getafe", pages: 31,
      cells: {
        coc: ["hi","Sí. Transmitir más del 50% del capital equivale a cesión y requiere consentimiento del arrendador.","Cl. 9.3","A efectos de este Contrato, {{la transmisión de más del 50% del capital social de la Arrendataria tendrá la consideración de cesión}} y requerirá el consentimiento previo del Arrendador."],
        ces: ["hi","Excluye el art. 32 LAU. Cesión y subarriendo prohibidos sin consentimiento.","Cl. 9.1","Las partes {{excluyen expresamente lo dispuesto en el artículo 32 de la Ley de Arrendamientos Urbanos}}; la cesión y el subarriendo requerirán consentimiento expreso del Arrendador."],
        ley: ["lo","Ley española (LAU, Título III). Juzgados de Getafe.","Cl. 25","Las partes se someten a los {{Juzgados y Tribunales de Getafe}}, por ser el lugar donde radica la finca."],
        lim: ["lo","No se pacta.","—",null],
        dur: ["mid","10 años desde 01/03/2021. Desistimiento del arrendatario desde el año 3, con 6 meses de preaviso.","Cl. 3","El plazo de duración será de {{diez (10) años}}. La Arrendataria podrá desistir {{a partir del tercer año}}, con un preaviso de seis (6) meses."],
      },
    },
    {
      id: 'supply', name: "Suministro · Supermercados Valdebrezo, S.A. (31% de ventas)", short: "Suministro Valdebrezo", pages: 27,
      cells: {
        coc: ["hi","Sí. Valdebrezo puede resolver con 30 días si un tercero toma el control. Es el 31% de las ventas (Anexo 3).","Cl. 17.2","Valdebrezo podrá resolver el presente Contrato, {{con un preaviso de treinta (30) días}}, en caso de que {{el Proveedor pase a estar controlado, directa o indirectamente, por un tercero}}."],
        ces: ["mid","Requiere autorización previa y escrita de Valdebrezo.","Cl. 18","El Proveedor {{no podrá ceder}} el Contrato sin la previa autorización escrita de Valdebrezo."],
        ley: ["lo","Ley española. Juzgados de Madrid.","Cl. 24","Para cualquier controversia, las partes se someten a los {{Juzgados y Tribunales de Madrid}}."],
        lim: ["hi","Responsabilidad del proveedor ilimitada por retirada de producto.","Cl. 13.4","El Proveedor asumirá {{sin límite cuantitativo}} los costes derivados de cualquier retirada de producto."],
        dur: ["mid","Vence el 31/12/2027. Prórroga anual salvo 3 meses de preaviso.","Cl. 15","El Contrato vencerá el {{31 de diciembre de 2027}} y se prorrogará por años salvo preaviso de {{tres (3) meses}}."],
      },
    },
    {
      id: 'jv', name: "Pacto de socios · Lumbre México, S.A. de C.V.", short: "JV México", pages: 34,
      cells: {
        coc: ["hi","Sí. Si un socio cambia de control, el otro tiene opción de compra sobre su 60% a valor razonable.","Cl. 12.1","En caso de Cambio de Control de cualquiera de los Accionistas, el otro Accionista tendrá {{una opción de compra sobre la totalidad de las acciones}} del Accionista afectado, {{a Valor Razonable}}."],
        ces: ["mid","Derecho de tanteo del otro socio.","Cl. 10","Cualquier transmisión de acciones estará sujeta al {{derecho de preferencia}} del otro Accionista."],
        ley: ["mid","Leyes de México. Arbitraje CCI con sede en Ciudad de México.","Cl. 25","Las controversias se resolverán mediante {{arbitraje conforme al Reglamento de la Cámara de Comercio Internacional}}, con sede en {{la Ciudad de México}}."],
        lim: ["lo","No se pacta.","—",null],
        dur: ["lo","Indefinido mientras ambos sean accionistas.","Cl. 3","El presente Convenio estará vigente {{mientras ambas partes sean accionistas}} de la Sociedad."],
      },
    },
    {
      id: 'agency', name: "Agencia comercial · Norte Ventas, S.L.", short: "Agencia Norte", pages: 12,
      cells: {
        coc: ["lo","No hay cláusula de cambio de control.","—",null],
        ces: ["mid","Requiere consentimiento previo.","Cl. 14","El Agente {{no podrá ceder}} el Contrato sin consentimiento previo del Empresario."],
        ley: ["lo","Ley 12/1992. Fuero imperativo del domicilio del agente (Bilbao).","Cl. 19","Serán competentes los {{Juzgados del domicilio del Agente}}, conforme a la disposición adicional de la Ley 12/1992."],
        lim: ["lo","No se pacta.","—",null],
        dur: ["mid","Indefinido. Un mes de preaviso por año, hasta 6. Indemnización por clientela (art. 28).","Cl. 16","El preaviso será de {{un mes por cada año de vigencia, con un máximo de seis meses}}, sin perjuicio de la indemnización por clientela."],
      },
    },
  ],
};

