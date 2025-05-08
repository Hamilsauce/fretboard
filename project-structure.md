/project-root
│
├── /src
│ ├── /core # Fundamental base classes and interfaces
│ │ ├── BaseObject.js # Extends EventTarget, base for Entity & Feature
│ │ ├── Entity.js
│ │ ├── FeatureManager.js
│ │ └── types.js # Shared type definitions or symbols
│ │
│ ├── /features
│ │ ├── /graphics
│ │ │ ├── GraphicsFeature.js
│ │ │ ├── GraphicObject.js (if still useful)
│ │ │ └── svgUtils.js
│ │ ├── /audio
│ │ │ ├── AudioFeature.js
│ │ │ ├── NoteFeature.js
│ │ │ └── envelopes.js / oscillators.js / schedulers/
│ │ └── index.js # Optionally re-export feature constructors
│ │
│ ├── /audio
│ │ ├── AudioEngine.js
│ │ ├── voice.js
│ │ └── utils.js
│ │
│ ├── /agents # For autonomous agents
│ │ └── FretAutoPlayer.js
│ │
│ ├── /ui
│ │ ├── components/ # HTML/CSS-based UI components
│ │ ├── mediator.js # App controller / message broker
│ │ └── state.js # Global state / reactive streams
│ │
│ ├── /data
│ │ └── notes.json
│ │
│ ├── /lib # Utilities (rxjs, dom helpers, ham, etc.)
│ │ └── ...
│ │
│ ├── main.js # App bootstrap
│ └── config.js # Configurable values/constants
│
├── /public # Static assets (fonts, media, svg templates)
├── /test # Unit tests
├── index.html
└── README.md