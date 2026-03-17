# Interactive 2D Character Avatar - Implementation Plan

**Project**: Zero Two-inspired Interactive Avatar  
**Version**: V1 MVP  
**Tech Stack**: HTML, CSS, JavaScript/TypeScript, Canvas API  
**Target FPS**: 60 FPS

---

## Phase Overview

| Phase | Name | Plans | Focus |
|-------|------|-------|-------|
| 01 | Foundation | 2 | Project setup, asset management |
| 02 | Core Rendering | 2 | Canvas setup, layer rendering |
| 03 | Input System | 1 | Mouse tracking, click handling |
| 04 | Eye & Blink | 2 | Eye tracking, blinking system |
| 05 | Expressions & Idle | 2 | State management, expressions, idle animation |
| 06 | Optimization | 1 | Performance tuning, final polish |

**Total**: 6 phases, 10 execution plans

---

## Phase 01: Foundation

### Phase Goal
Set up project structure, create asset loading system, and generate placeholder assets for testing.

### Dependencies
- None (first phase)

### Requirements Covered
- **PRD-F1**: Create layered assets
- **PRD-F2**: Set up rendering environment
- **TECH-1**: Asset Manager implementation
- **TECH-2**: Project folder structure

### Plans

#### Plan 01-01: Project Setup & Asset Manager

**Wave**: 1  
**Files Modified**:
- `index.html`
- `src/main.js`
- `src/styles/main.css`
- `src/managers/AssetManager.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Create project structure | `index.html`, `src/main.js`, `src/styles/main.css` | Create folder structure per asset spec: /assets/{head,eyes,eyelids,pupils,eyebrows,mouth,hair,horns,body,arms,legs,overlays}, /src/{managers,engines,components,utils}. Create index.html with canvas element 2048x4096, CSS for centering and responsive scaling | Folder structure exists, index.html loads | Project builds without errors |
| 2. Implement AssetManager | `src/managers/AssetManager.js` | Create AssetManager class with: load(), loadAll(), get(), cache, progress tracking. Support naming convention pattern matching | `npm test` or manual verification | Assets load and cache correctly |

**Must-Haves**:
- Truths: AssetManager loads all assets, caches them, provides quick access by key
- Artifacts: Folder structure, AssetManager.js, index.html

---

#### Plan 01-02: Placeholder Assets

**Wave**: 2  
**Depends On**: 01-01  
**Files Modified**:
- `/assets/**/*.png` (generated placeholders)

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Generate placeholder assets | `/assets/**/*.png` | Create minimal placeholder PNGs for each layer per asset spec. Use solid colors with labels for identification. Follow naming: category_side_state_index.png | All placeholder files exist | Placeholder assets render without errors |

**Must-Haves**:
- Truths: All required layers have placeholder images, naming follows convention
- Artifacts: PNG files in each assets subfolder

---

## Phase 02: Core Rendering Engine

### Phase Goal
Implement the canvas rendering system with proper layer ordering and frame loop.

### Dependencies
- Phase 01 (AssetManager must work)

### Requirements Covered
- **PRD-R1**: Layered 2D character composition
- **TECH-3**: Rendering Engine with requestAnimationFrame
- **TECH-4**: Z-index layer order

### Plans

#### Plan 02-01: Rendering Engine Core

**Wave**: 1  
**Depends On**: 01-02  
**Files Modified**:
- `src/engines/RenderingEngine.js`
- `src/components/Layer.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Create RenderingEngine | `src/engines/RenderingEngine.js` | Implement RenderingEngine class with: init(canvas), start(), stop(), render(), clear(), setLayers(). Use requestAnimationFrame for 60 FPS loop. Handle device pixel ratio | `console.log` FPS counter works | Canvas clears and redraws at 60 FPS |
| 2. Create Layer component | `src/components/Layer.js` | Create Layer class with: image, x, y, width, height, opacity, visible, zIndex. Support offset transformations for animation | Layers render in correct order | Layers stack correctly (zIndex respected) |

**Must-Haves**:
- Truths: Canvas renders at 60 FPS, layers draw in correct z-order
- Artifacts: RenderingEngine.js, Layer.js

---

#### Plan 02-02: Layer Configuration & Testing

**Wave**: 2  
**Depends On**: 02-01  
**Files Modified**:
- `src/main.js`
- `src/config/layers.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Define layer configuration | `src/config/layers.js` | Create layer config per asset spec z-order: hair_back, body_base, legs, arms_back, torso_details, neck, face_base, eyes, pupils, eyelids, eyebrows, mouth, hair_front, horns, overlays. Include offsets and positions | Config file valid | All layers render in stack order |
| 2. Wire rendering to main | `src/main.js` | Integrate AssetManager, RenderingEngine, and layer config. Initialize on DOMContentLoaded. Add loading screen during asset preload | Character displays | Full character renders without flickering |

**Must-Haves**:
- Truths: All 15 layers render in correct order, no misalignment
- Artifacts: layers.js config, updated main.js

---

## Phase 03: Input System

### Phase Goal
Implement mouse tracking and click detection for eye tracking and expression changes.

### Dependencies
- Phase 02 (Rendering must work)

### Requirements Covered
- **PRD-I1**: Capture cursor position
- **PRD-I2**: Detect click events
- **TECH-5**: Input Handler with coordinate normalization

### Plans

#### Plan 03-01: Input Handler

**Wave**: 1  
**Depends On**: 02-02  
**Files Modified**:
- `src/handlers/InputHandler.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Implement InputHandler | `src/handlers/InputHandler.js` | Create InputHandler class with: trackMouse(), onClick(), getCursorPosition(), normalizeCoordinates(). Clamp coordinates within canvas bounds. Emit events for mouse move and click | Cursor position logs correctly | Mouse tracking and click detection work |
| 2. Connect to rendering | `src/main.js` | Integrate InputHandler with RenderingEngine. Pass cursor position for eye tracking. Handle click for expression cycling | Eyes respond to cursor | Click cycles expressions |

**Must-Haves**:
- Truths: Cursor position tracked, clicks detected, coordinates normalized
- Artifacts: InputHandler.js, integrated main.js

---

## Phase 04: Eye Tracking & Blinking

### Phase Goal
Implement pupil movement following cursor and automatic blinking system.

### Dependencies
- Phase 03 (InputHandler must work)

### Requirements Covered
- **PRD-E1**: Pupils follow cursor position
- **PRD-E2**: Movement constrained within natural bounds
- **PRD-B1**: Automatic blinking at randomized intervals (2-5 seconds)
- **TECH-6**: Eye tracking and blinking subsystems

### Plans

#### Plan 04-01: Eye Tracking System

**Wave**: 1  
**Depends On**: 03-01  
**Files Modified**:
- `src/engines/AnimationEngine.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Implement eye tracking | `src/engines/AnimationEngine.js` | Add eyeTracking module: calculatePupilOffset(cursorPos, eyeCenter). Apply sensitivity factor. Clamp within max offset (±20px X, ±15px Y per asset spec). Use smooth interpolation (lerp) for natural movement | Pupils follow cursor smoothly | Eyes track cursor without clipping |
| 2. Integrate with render loop | `src/engines/RenderingEngine.js` | Update pupil layer positions each frame based on eye tracking calculations | Visual verification | Pupils move with cursor |

**Must-Haves**:
- Truths: Pupils follow cursor smoothly, constrained to eye boundaries
- Artifacts: Eye tracking in AnimationEngine

---

#### Plan 04-02: Blinking System

**Wave**: 2  
**Depends On**: 04-01  
**Files Modified**:
- `src/engines/AnimationEngine.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Implement blinking | `src/engines/AnimationEngine.js` | Add blinking module: startBlinkCycle(). Random interval 2-5 seconds using setTimeout. State machine: open → closing → closed → opening. Use eyelid layers to swap states | Blinking occurs randomly | Character blinks every 2-5 seconds |
| 2. Smooth transitions | `src/engines/AnimationEngine.js` | Add easing for eyelid movement. Duration: close 100ms, hold 100ms, open 150ms. Prevent blink during expression change | Smooth blink animation | No jerky blinking |

**Must-Haves**:
- Truths: Blinks occur at random intervals, smooth open/close
- Artifacts: Blinking system in AnimationEngine

---

## Phase 05: Expression System & Idle Animation

### Phase Goal
Implement state management, expression switching (neutral/happy/annoyed), and idle body sway.

### Dependencies
- Phase 04 (Eye tracking and blinking must work)

### Requirements Covered
- **PRD-X1**: Minimum 3 expression states (neutral, happy, annoyed)
- **PRD-X2**: Click triggers expression change
- **PRD-I1**: Idle animation (head sway, vertical motion)
- **TECH-7**: State Manager
- **TECH-8**: Expression transitions

### Plans

#### Plan 05-01: State Manager & Expression System

**Wave**: 1  
**Depends On**: 04-02  
**Files Modified**:
- `src/managers/StateManager.js`
- `src/config/expressions.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Implement StateManager | `src/managers/StateManager.js` | Create StateManager with: getState(), setExpression(), setBlinking(), setIdle(). State structure: {expression, eyePosition, isBlinking, idleState, lastInteraction}. Prevent state conflicts | State changes are atomic | Only one expression active at a time |
| 2. Create expression config | `src/config/expressions.js` | Define expression mappings: neutral, happy, annoyed. Map mouth, eyebrows, eyes to specific asset files per expression. Support asset swapping | Expressions load correctly | Click cycles through 3 expressions |
| 3. Wire click to expression | `src/main.js` | Connect InputHandler click to StateManager expression cycling. Update mouth, eyebrow layers on expression change | Click cycles: neutral → happy → annoyed → neutral | Expression changes on click |

**Must-Haves**:
- Truths: Three expressions work, click cycles correctly, no conflicts
- Artifacts: StateManager.js, expressions.js

---

#### Plan 05-02: Idle Animation

**Wave**: 2  
**Depends On**: 05-01  
**Files Modified**:
- `src/engines/AnimationEngine.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Implement idle animation | `src/engines/AnimationEngine.js` | Add idle module: startIdleAnimation(). Sinusoidal vertical offset (±10px). Subtle head sway (optional rotation simulation). Track idle vs active via lastInteraction timestamp | Character idle animates | Subtle movement visible |
| 2. Idle detection | `src/handlers/InputHandler.js` | Update lastInteraction on mouse move. Enable idle animation after 3 seconds of inactivity. Disable on any input | Idle activates after 3s | Idle stops on mouse move |

**Must-Haves**:
- Truths: Idle animation runs continuously, subtle and non-distracting
- Artifacts: Idle animation in AnimationEngine

---

## Phase 06: Optimization & Polish

### Phase Goal
Optimize performance, add FPS monitoring, final integration testing.

### Dependencies
- Phase 05 (All features must work)

### Requirements Covered
- **PRD-P1**: Target 60 FPS
- **PRD-P2**: Minimize unnecessary re-renders
- **TECH-9**: Performance optimization strategies

### Plans

#### Plan 06-01: Performance & Final Polish

**Wave**: 1  
**Depends On**: 05-02  
**Files Modified**:
- `src/main.js`
- `src/engines/RenderingEngine.js`
- `src/utils/FPSMonitor.js`

**Tasks**:

| Task | Files | Action | Verify | Done |
|------|-------|--------|--------|------|
| 1. Add FPS monitoring | `src/utils/FPSMonitor.js` | Create FPSMonitor with: start(), stop(), getFPS(). Track using performance.now(). Log frame drops | FPS displays in console | Stable 60 FPS |
| 2. Optimize render loop | `src/engines/RenderingEngine.js` | Cache computed values, avoid object allocation in loop. Only redraw layers that changed. Use dirty flag for layer updates | No frame drops on testing | Render time under 16ms |
| 3. Final integration test | `src/main.js` | Verify all systems work together: rendering, input, eye tracking, blinking, expressions, idle | Full system test | All features function correctly |

**Must-Haves**:
- Truths: 60 FPS stable, no memory leaks, all features work
- Artifacts: FPSMonitor.js, optimized rendering

---

## Requirement Coverage Mapping

| Requirement ID | Description | Phase | Plan(s) |
|----------------|-------------|-------|---------|
| PRD-F1 | Create layered assets | 01 | 01-02 |
| PRD-F2 | Set up rendering environment | 01 | 01-01 |
| PRD-R1 | Layered 2D character composition | 02 | 02-01, 02-02 |
| PRD-E1 | Pupils follow cursor position | 04 | 04-01 |
| PRD-E2 | Movement constrained within bounds | 04 | 04-01 |
| PRD-B1 | Automatic blinking (2-5 sec) | 04 | 04-02 |
| PRD-X1 | 3 expression states | 05 | 05-01 |
| PRD-X2 | Click triggers expression change | 05 | 05-01 |
| PRD-I1 | Idle animation (sway, vertical motion) | 05 | 05-02 |
| PRD-I2 | Cursor interaction | 03 | 03-01 |
| PRD-P1 | Target 60 FPS | 06 | 06-01 |
| PRD-P2 | Minimize unnecessary re-renders | 06 | 06-01 |
| TECH-1 | Asset Manager | 01 | 01-01 |
| TECH-2 | Project folder structure | 01 | 01-01 |
| TECH-3 | Rendering Engine with RAF | 02 | 02-01 |
| TECH-4 | Z-index layer order | 02 | 02-02 |
| TECH-5 | Input Handler | 03 | 03-01 |
| TECH-6 | Eye tracking & blinking | 04 | 04-01, 04-02 |
| TECH-7 | State Manager | 05 | 05-01 |
| TECH-8 | Expression transitions | 05 | 05-01 |
| TECH-9 | Performance optimization | 06 | 06-01 |

---

## Success Criteria by Phase

### Phase 01: Foundation
- [ ] Project folder structure created
- [ ] AssetManager loads and caches all assets
- [ ] Placeholder assets exist for all layers
- [ ] Index.html displays canvas

### Phase 02: Core Rendering
- [ ] RenderingEngine runs at 60 FPS
- [ ] All 15 layers render in correct z-order
- [ ] No flickering or misalignment
- [ ] Character displays fully

### Phase 03: Input System
- [ ] Mouse position tracked in real-time
- [ ] Click events detected
- [ ] Coordinates normalized to canvas

### Phase 04: Eye & Blink
- [ ] Pupils follow cursor smoothly
- [ ] Pupils stay within eye boundaries
- [ ] Blinking occurs at random 2-5 second intervals
- [ ] Smooth open/close transitions

### Phase 05: Expressions & Idle
- [ ] Three expressions work: neutral, happy, annoyed
- [ ] Click cycles through expressions
- [ ] Idle animation runs continuously
- [ ] Motion is subtle and non-distracting

### Phase 06: Optimization
- [ ] 60 FPS stable
- [ ] No frame drops during interaction
- [ ] All features function together
- [ ] Ready for deployment

---

## Task Dependency Graph

```
Phase 01
├── 01-01 (Wave 1): Project Setup
│   └── Creates: index.html, AssetManager
└── 01-02 (Wave 2): Placeholder Assets
    └── Depends: 01-01

Phase 02
├── 02-01 (Wave 1): Rendering Engine Core
│   └── Depends: 01-02
└── 02-02 (Wave 2): Layer Configuration
    └── Depends: 02-01

Phase 03
└── 03-01 (Wave 1): Input Handler
    └── Depends: 02-02

Phase 04
├── 04-01 (Wave 1): Eye Tracking
│   └── Depends: 03-01
└── 04-02 (Wave 2): Blinking
    └── Depends: 04-01

Phase 05
├── 05-01 (Wave 1): State Manager & Expressions
│   └── Depends: 04-02
└── 05-02 (Wave 2): Idle Animation
    └── Depends: 05-01

Phase 06
└── 06-01 (Wave 1): Performance & Polish
    └── Depends: 05-02
```

---

## Execution Order

**Wave 1**: 01-01 → 02-01 → 03-01 → 04-01 → 05-01 → 06-01  
**Wave 2**: 01-02 → 02-02 → 04-02 → 05-02

---

## Notes

1. **Asset Generation**: Phase 01-02 requires creating placeholder PNGs. In production, these would be replaced with actual character art following the Asset Specification Document.

2. **TypeScript Consideration**: The plan uses JavaScript but can be adapted to TypeScript by adding type definitions and updating file extensions.

3. **Future Enhancements**: Voice reactions, keyboard controls, sound feedback, and Live2D upgrade path are deferred to post-MVP.

4. **Testing Approach**: Manual visual testing at each phase. Unit tests for StateManager and AnimationEngine calculations recommended.

---

*Plan generated for Zero Two-inspired Interactive Avatar Project*
*Canvas: 2048×4096 | Target: 60 FPS | Expressions: 3 states*
