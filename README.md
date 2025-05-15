## Object Types
- Application: Unique top-level structural class
  - Mediator object housing and managing the subsystems
  - Application as a coordinator and container for subsystems (audio, graphics, UI, state, scheduler, etc.)  
  - Contains top level state, interacts with external shit, Bootstraps
  - Provides channels for subsystem comms (events)
  
  - Subsystem: Self contained context representing an app domain
    - pluggable and modular behaviors (i.e. features)
    - SvgCanvas/Graphic, UI, audio, state
    - 
    

Subsystems as 

## Layers and Scenes
Scenes and layers = containers, not features or entities

Entities live in layers, and carry their own behavior via features

Use events or a mediator (Application) for communication

Keep concerns separated: layout/grouping ≠ behavior/logic