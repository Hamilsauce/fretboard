## 🧠 Project Summary: Modular Entity-Feature Architecture for SVG + Audio System

### 🌱 Core Concepts

- **Entity-Feature System**:  
  - `Entity` is a dynamic object that gains behaviors by attaching modular `Features`.
  - Features are self-contained units of functionality.
  - Entities act as *mini event hubs*, allowing attached features to interact via events.

- **BaseObject**:  
  - Common superclass for both `Entity` and `Feature`.
  - Extends `EventTarget` to allow consistent event handling.
  - Accepts an optional `type` string (e.g., "entity", "feature") for context-sensitive event logic.

- **FeatureManager**:  
  - Attached to each `Entity` to manage its features.
  - Acts as a **conduit** for feature-related events: features emit to the manager, the manager relays/adapts to the entity.
  - Reduces tight coupling and keeps a clean feature-to-entity communication boundary.
  - Supports `add`, `remove`, and `has` for feature lifecycle.

### 🧩 Feature Lifecycle

- **Features are Classes**, not mixins.
  - When added to an entity, they're instantiated with `(entity, options)` and may register event listeners or expose methods.
  - Each feature is responsible for registering and deregistering itself cleanly.

- **Feature Aliases**:
  - Entities can alias feature properties via `.features.alias(name, map)` for ergonomic access (e.g., `entity.notePitch` → `note.pitch`).

- **Feature Registration**:
  - Feature classes self-register their name (e.g., `NoteFeature` → `"note"`) to reduce boilerplate.

### 🎛 Audio Architecture

- **AudioEngine**:
  - Singleton-style interface over `AudioContext`.
  - Owns and provides core audio infrastructure (e.g., context, clock, global nodes).
  - Can provide `AudioFeature` instances to entities, rather than each entity creating its own.

- **AudioFeature**:
  - Integrates audio behavior into an entity (e.g., oscillator, gain, scheduling).
  - Depends on the `AudioEngine` for its context.

### 🎨 Graphics (SVG) Architecture

- **GraphicsFeature**:
  - Attaches SVG visuals (e.g., `SVGCircle`, `SVGRect`) to an entity.
  - Uses document-managed SVG elements.

- **SVGFretboard**:
  - A composite visual class for displaying a guitar/bass fretboard.
  - Lives in `/graphics/svg/`.
  - Handles note layout and rendering logic.
  - May be expanded with `SVGLayer`, `SVGScene`, etc.

### 🧭 Event Design

- **Scoped Event Propagation**:
  - Feature events are scoped to their entity.
  - Entity may selectively emit feature-originated events outward.

- **PubSub Possibility**:
  - Entity acts as a mediator—no global event bus is needed.

### 🏗 Folder Structure

```
/src
  /core
    BaseObject.js
    Entity.js
    Feature.js
    FeatureManager.js

  /features
    /audio
      AudioFeature.js
    /note
      NoteFeature.js
    /graphics
      GraphicsFeature.js

  /systems
    AudioEngine.js

  /graphics
    /svg
      SVGFretboard.js
      SVGLayer.js
      SVGNote.js

  /utils
    circleLooper.js
    scheduler.js

  /app
    Application.js
```

### 🔁 Utilities

- **circleLooper**:
  - General-purpose circular generator with optional index override.
  - Wrapped in a `CircularIterator` class to support `.next()`, `.peekNext()`, and reset.
  - Lives in `/utils/circleLooper.js`.

### 🔄 Design Principles & Philosophy

- Keep modules **small, composable, and reactive** via events.
- **Entity acts as a scope**, not a monolith.
- Prefer **event-driven systems** with strict flow: `Feature → FeatureManager → Entity`.
- Don’t over-engineer; avoid adding systems like `Application` as entities unless truly justified.
- `Application.use()` may be used for subsystem bootstrapping (optional).