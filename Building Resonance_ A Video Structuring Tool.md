# **RESONANCE PHASE 1: TECHNICAL ARCHITECTURE AND PRODUCT SPECIFICATION**

## **1\. Architectural Philosophy and Product Definition**

### **1.1 The Paradigm Shift: Decision Engineering vs. Creative Editing**

The prevailing mental model for digital video creation relies on the Non-Linear Editor (NLE). Tools such as Premiere Pro, DaVinci Resolve, and CapCut operate on a philosophy of infinite flexibility. They function as blank canvases, accepting any input and allowing any arrangement. While powerful for professional editors, this "blank slate" creates a distinct paralysis for the modern creator focused on algorithmic retention and emotional impact. The primary friction point in the current landscape is not a lack of footage or technical capability, but the absence of structural certainty.

Resonance is defined not as a creative tool, but as a constraint engine. It operates on the core principle that structure must precede editing. By inverting the workflow—enforcing rigid temporal structures before a single clip is cut—Resonance acts as a firewall against poor pacing decisions. It does not promise artistic masterpieces; it guarantees structural integrity. The system functions as a deterministic decision engine: given a specific set of inputs (Emotion, Duration, Platform, Structure), it generates a singular, non-negotiable "Blueprint."

This distinction is critical for the development team. The mental model for Resonance is explicitly **not AI**.1 There is no machine learning, no neural network "hallucination," and no probabilistic generation of content. The system relies on a rigid, rule-based logic matrix. If the inputs match a defined criteria set, the rules trigger a specific, unchangeable output structure. This determinism ensures that the tool is reliable, predictable, and strictly adheres to the "System Truths" defined in the product specification.

### **1.2 The "Music-First" Logic**

The architecture of Resonance is grounded in the concept of "Music-First" structuring. In traditional video editing, the visual narrative often dictates the timing. In the Resonance model, the emotional intent (manifested through pacing and sound density) dictates the time-domain constraints.

This approach requires the system to treat a video timeline less like a visual storyboard and more like a musical score. The timeline is divided into measures and beats—represented here as "Segments" (Hook, Build, Peak, Resolve). Just as a waltz cannot exist without a 3/4 time signature, a "Surge" video structure cannot exist without an accelerating cut speed and a mandatory silence before the peak. Phase 1 of Resonance focuses entirely on generating this temporal map. It does not process audio files or render video; it outputs the logic that the editor must follow.

### **1.3 Scope and Boundaries**

To ensure a successful Phase 1 deployment, the technical scope is tightly bounded. The system supports video durations between 30 seconds and 3 minutes. This range covers the critical short-form content window (TikTok, Reels, Shorts) while allowing for slightly longer music video or narrative structures.2

The system supports exactly seven "Fixed Emotional Structures." These are immutable. A user cannot create a custom structure in Phase 1; they must choose the structure that best fits their primary emotion. This restriction is a feature, not a limitation, ensuring that the user is guided toward mathematically proven pacing models rather than being left to guess.

**Explicit Phase 1 Exclusions:**

* **Audio Analysis:** The system does not analyze BPM or waveforms. It creates a container for audio, not a reaction to it.  
* **Video Rendering:** The browser will not process pixels. The output is a document (PDF Blueprint), not a video file (.mp4).  
* **Cloud State:** The session is client-side and stateless for Phase 1\.  
* **AI/LLM Integration:** No "smart" suggestions based on content. The "intelligence" is hard-coded conditional logic.

## ---

**2\. The Physics of the System: Fixed Emotional Structures**

The core of the Resonance engine is the "Emotional-Structural Logic Matrix." This matrix maps abstract emotional concepts (e.g., "Excitement") to concrete, mathematical timeline behaviors. These structures are stored as constant data objects within the application state and serve as the source of truth for all calculations.

### **2.1 The Seven Immutable Structures**

Each structure is defined by a unique "Pacing Signature," which dictates the velocity of cuts, the density of sound, and the placement of key events (Peaks, Silences).

#### **2.1.1 Surge**

The **Surge** structure is the primary engine for high-energy retention. It is designed to hook the viewer instantly and accelerate rapidly toward an early payoff.

* **Core Behavior:** Fast rise $\\rightarrow$ Early peak $\\rightarrow$ Quick release.  
* **Target Emotions:** Excitement, Tension.  
* **Pacing Signature:**  
  * **Cut Speed:** Accelerating. The timeline begins with moderate cuts (1.0–1.5s) to establish the subject, then drastically compresses cut duration as it approaches the peak, reaching hyper-fast speeds (0.25–0.4s).  
  * **Peak Position:** Early. The peak must occur between 40% and 60% of the total duration. This ensures the viewer receives the dopamine hit before they have a chance to scroll.  
  * **Silence:** Mandatory. A specific "breath" of silence (0.2–0.4s) is hard-coded immediately preceding the peak. This contrast creates the "impact" of the drop.  
  * **Sound Density:** Low (Start) $\\rightarrow$ Very High (Build) $\\rightarrow$ Drop (Peak).

#### **2.1.2 Climb**

The **Climb** structure is linear. It avoids the early drop in favor of a sustained, gradual increase in intensity.

* **Core Behavior:** Slow start $\\rightarrow$ Steady rise $\\rightarrow$ Late payoff.  
* **Target Emotions:** Hope, Authority (Narrative).  
* **Pacing Signature:**  
  * **Cut Speed:** Linear Deceleration of Segment Length (increasing frequency). The video starts with long, establishing shots (2–3s) and progressively shortens them. Unlike Surge, which accelerates exponentially, Climb accelerates linearly.  
  * **Peak Position:** Late. The payoff occurs at 85–90% of the timeline.  
  * **Silence:** Minimal. The Climb relies on continuous, driving audio energy without breaks until the final resolution.

#### **2.1.3 Pulse**

The **Pulse** structure rejects the concept of a single climax. It establishes a rhythmic consistency that is hypnotic rather than startling.

* **Core Behavior:** Constant rhythm, no extreme peaks.  
* **Target Emotions:** Calm, Reflection, Cool/Vibe.  
* **Pacing Signature:**  
  * **Cut Speed:** Uniform. The cut length remains consistent throughout the timeline (e.g., every 1.2 seconds), creating a metronomic feel.  
  * **Peak Position:** Distributed. Energy is maintained at a "Medium" level throughout, with no single moment dominating the timeline.  
  * **Silence:** Rhythmic. Silence is used as a texture rather than a dramatic device.

#### **2.1.4 Drop**

The **Drop** structure is binary. It exists in two states: Normal and Chaos.

* **Core Behavior:** Normal energy $\\rightarrow$ Break/Silence $\\rightarrow$ Impact.  
* **Target Emotions:** Excitement, Surprise.  
* **Pacing Signature:**  
  * **Cut Speed:** Binary. The "Setup" uses standard pacing. The "Drop" uses maximum density cuts.  
  * **Silence:** High Priority. The "Break" segment separating the Setup and Drop is 100% silence. This is the most critical constraint of this structure.

#### **2.1.5 Breathe**

The **Breathe** structure prioritizes negative space. It is the antithesis of the "retention hacking" style, focusing instead on luxury and atmosphere.

* **Core Behavior:** Minimal energy, long holds.  
* **Target Emotions:** Calm, Reflection.  
* **Pacing Signature:**  
  * **Cut Speed:** Very Slow. Cuts are rare, with durations exceeding 3.0 seconds.  
  * **Peak Position:** Non-existent. The energy curve is flat and low.  
  * **Silence:** High density. The soundscape is dominated by quiet or sparse ambient layers.

#### **2.1.6 Wave**

The **Wave** structure is complex, featuring multiple oscillation cycles. It is only valid for longer durations where a single peak would feel monotonous.

* **Core Behavior:** Multiple rises and falls.  
* **Target Emotions:** Hope, Storytelling (Long Form).  
* **Pacing Signature:**  
  * **Cut Speed:** Oscillating. Fast $\\rightarrow$ Slow $\\rightarrow$ Fast $\\rightarrow$ Slow.  
  * **Peak Position:** Multiple. At least two distinct peaks are required.  
  * **Constraint:** Requires a minimum duration of 20 seconds to execute effectively.

#### **2.1.7 Resolve**

The **Resolve** structure inverts the Surge. It captures attention with chaos and then settles into authority.

* **Core Behavior:** Early tension $\\rightarrow$ Calm authority.  
* **Target Emotions:** Authority, Tension (Resolution).  
* **Pacing Signature:**  
  * **Cut Speed:** Decelerating. Starts fast and chaotic, ending with long, steady holds.  
  * **Peak Position:** Very Early (10–20%).  
  * **Silence:** Used at the end to emphasize the final authority statement.

### **2.2 Data Structure Representation**

In the application codebase (React/TypeScript), these structures must be represented as rigid JSON objects.4 This allows the Rule Engine to query them against user inputs programmatically.

TypeScript

type SegmentType \= 'HOOK' | 'BUILD' | 'PEAK' | 'SUSTAIN' | 'RESOLVE' | 'BREAK';  
type CutSpeed \= 'FAST' | 'SLOW' | 'ACCEL' | 'DECEL' | 'CONSTANT';

interface StructureSegmentDef {  
  type: SegmentType;  
  basePercentage: number;  
  minDurationSec?: number;  
  cutSpeedGuidance: CutSpeed;  
  soundDensity: 'HIGH' | 'MED' | 'LOW' | 'SILENCE';  
}

interface StructureDef {  
  id: string;  
  name: string;  
  pacing: {  
    start: CutSpeed;  
    peakPositionMax: number; // 0.0 to 1.0  
    silenceRequired: boolean;  
  };  
  segments: StructureSegmentDef;  
}

// Example Data Store  
const STRUCTURES: Record\<string, StructureDef\> \= {  
  SURGE: {  
    id: 'surge',  
    name: 'Surge',  
    pacing: { start: 'FAST', peakPositionMax: 0.6, silenceRequired: true },  
    segments:  
  },  
  //... Definitions for Climb, Pulse, Drop, Breathe, Wave, Resolve  
};

This JSON-driven architecture separates the "System Truths" from the UI code, allowing for rapid iteration of the pacing rules without rewriting the core components.

## ---

**3\. The Mathematics of Time: Algorithmic Timeline Generation**

The heart of Resonance is the algorithm that translates theoretical percentage allocations into precise, integer-based timeline segments.

### **3.1 The "Floating Point" Danger in Video**

Video editing operates on discrete frames. At 30 frames per second (fps), one frame is approximately 0.0333 seconds. A standard Javascript calculation for 33% of a 10-second video ($10 \\times 0.33$) results in 3.3333... seconds. In an NLE timeline, this results in a "sub-frame" cut, which the software must round to either frame 99 or frame 100\. Over the course of a 60-second video with multiple segments, these rounding errors accumulate, causing "drift." A video that should be 60.0 seconds might end up being 59.94 seconds or 60.06 seconds, breaking sync with the music or platform limits.

Resonance solves this using **Integer Partitioning** via the **Largest Remainder Method**.4 The system calculates durations in "base units" (Phase 1 uses Seconds as the base unit for simplicity, but the logic handles frame-level precision if needed).

### **3.2 The Largest Remainder Method (LRM) Implementation**

To split a Total Duration ($T$) into segments ($S\_1, S\_2,... S\_n$) based on percentages ($P\_1, P\_2,... P\_n$) where $\\sum P \= 100\\%$, we cannot simply round the result of $T \\times P\_x$.

**Logic Flow:**

1. **Calculate Raw Values:** Multiply the Total Duration by each segment's percentage to get the raw float values.  
2. **Floor and Remainder:** Separate the integer part from the decimal part for each segment.  
   * $Integer \= \\lfloor Raw \\rfloor$  
   * $Remainder \= Raw \- Integer$  
3. **Sum Integers:** Calculate the sum of the floored integer values.  
4. **Calculate Deficit:** Determine the difference between the Total Duration and the Sum of Integers.  
   * $Deficit \= T \- \\sum Integers$  
5. **Distribute Deficit:** Sort the segments by their decimal remainder (highest to lowest). Add 1 unit (1 second) to the segments with the highest remainders until the deficit is exhausted.  
6. **Re-Sort:** Return the segments to their original chronological order.

**Example Calculation:**

* **Scenario:** 60s Duration, Surge Structure.  
* **Raw Calculation:**  
  * Hook (15%): 9.0s $\\rightarrow$ Int: 9, Rem: 0  
  * Build (35%): 21.0s $\\rightarrow$ Int: 21, Rem: 0  
  * Peak (10%): 6.0s $\\rightarrow$ Int: 6, Rem: 0  
  * Sustain (25%): 15.0s $\\rightarrow$ Int: 15, Rem: 0  
  * Resolve (15%): 9.0s $\\rightarrow$ Int: 9, Rem: 0  
* **Result:** In this perfect case, Deficit is 0\.  
* **Scenario:** 45s Duration, Surge Structure.  
  * Hook (15%): 6.75s $\\rightarrow$ Int: 6, Rem: 0.75  
  * Build (35%): 15.75s $\\rightarrow$ Int: 15, Rem: 0.75  
  * Peak (10%): 4.5s $\\rightarrow$ Int: 4, Rem: 0.50  
  * Sustain (25%): 11.25s $\\rightarrow$ Int: 11, Rem: 0.25  
  * Resolve (15%): 6.75s $\\rightarrow$ Int: 6, Rem: 0.75  
  * **Sum of Integers:** $6+15+4+11+6 \= 42$.  
  * **Deficit:** $45 \- 42 \= 3$.  
  * **Distribution:** The top 3 remainders are Hook (0.75), Build (0.75), and Resolve (0.75). We add 1s to each.  
  * **Final Timeline:** Hook (7s), Build (16s), Peak (4s), Sustain (11s), Resolve (7s). Total \= 45s.

This guarantees that the timeline never drifts from the user's selected duration.

### **3.3 Dynamic Scaling Logic**

The "Duration" input scales the structure, it never changes it. However, strict constraints apply to scaling:

* **Minimum Segment Floor:** No segment can be less than 1 second (unless explicitly defined as a "micro-cut"). If the LRM algorithm yields a 0s segment for a very short video, the Rules Engine triggers a block.  
* **Hook Preservation:** For TikTok and Instagram platforms, the Hook segment is capped at 3 seconds.7 If the percentage calculation yields a Hook \> 3s, the generator clamps the Hook to 3s and redistributes the excess time to the "Build" segment to maintain the total duration.

## ---

**4\. Platform Constraints and "System Truths"**

Resonance acknowledges that a 60-second video on YouTube Shorts behaves differently than a 60-second video on Instagram Reels. The system incorporates "Platform Physics" derived from research into platform algorithms and user behavior.2

### **4.1 TikTok: The High-Velocity Loop**

TikTok's algorithm prioritizes completion rate and re-watchability (loops).

* **Constraint:** Max Duration 10 minutes (in-app) to 60 minutes (upload).2  
* **Retention Sweet Spot:** 21–34 seconds.10  
* **Hook Physics:** The first 2-3 seconds are critical. If a user does not engage here, the video fails.  
* **Resonance Enforcement:**  
  * **Hook Cap:** The Hook segment is forced to $\\le$ 3 seconds.  
  * **Loop Protocol:** The "Resolve" segment instructions are modified. Instead of "Fade out," the system instructs "Match Cut to Start" to facilitate seamless looping.11  
  * **Pacing Bias:** The "Cut Speed" ranges are compressed by 15% (faster) to match Gen Z attention spans.

### **4.2 Instagram Reels: The Aesthetic Hold**

Instagram Reels shares the vertical format but favors slightly more "aesthetic" or polished content compared to TikTok's raw chaos.

* **Constraint:** Max Duration 3 minutes (recently increased from 90s).3  
* **Retention Sweet Spot:** 30–60 seconds.13  
* **Resonance Enforcement:**  
  * **Hook Cap:** $\\le$ 3 seconds.  
  * **Pacing Bias:** Standard. The "Breathe" structure is fully supported here, whereas it is flagged as risky on TikTok.

### **4.3 YouTube Shorts: The Hard Limit**

YouTube Shorts enforces the strictest duration limit for classification.

* **Constraint:** Hard limit of 60 seconds.9 Any video \> 60s is classified as long-form and removed from the Shorts shelf.  
* **Resonance Enforcement:**  
  * **Duration Block:** If Platform \== Youtube Shorts and Duration \> 60, the system triggers a **BLOCK** severity conflict. Generation is disabled.  
  * **Structure Lock:** The "Wave" structure (requiring multiple peaks) is disabled for Shorts \< 45s, as there is insufficient time to resolve two peaks effectively.

### **4.4 Music Video / General: The Open Canvas**

For standard YouTube or generic video outputs, constraints are relaxed.

* **Constraint:** Supports full range (up to 3 minutes in Phase 1).  
* **Resonance Enforcement:**  
  * **Hook Cap:** Relaxed (up to 10s allowed for "Intro").  
  * **Structure Freedom:** All 7 structures are valid. "Climb" and "Wave" are recommended for durations \> 90s.

## ---

**5\. The Rules Engine and Conflict Detection**

The Rules Engine is the system's "conscience." It replaces the "AI" prediction model with a deterministic "Condition-Action" logic gates system. It evaluates the compatibility of the user's inputs against the System Truths.

### **5.1 Logic Architecture**

The Rules Engine runs a validation pass every time an input is changed.

1. **Gather Facts:** Current Duration, Structure, Platform, Dialogue State.  
2. **Evaluate Rules:** Iterate through the rulebook.  
3. **Action:** Return a list of Conflict objects.

### **5.2 Severity Levels**

* **INFO:** Educational guidance. Does not stop generation. (e.g., "Note: Surge works best with high-BPM audio.")  
* **WARNING:** A potential quality issue. The user is warned but can choose to ignore. (e.g., "Breathe structure on TikTok may result in low retention.")  
* **BLOCK:** A fundamental incompatibility. The "Generate" button is disabled. (e.g., "YouTube Shorts cannot exceed 60 seconds.")

### **5.3 The Rulebook (Sample Definitions)**

| ID | Rule Name | Condition | Severity | Message | Fix |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **R01** | The Boredom Protocol | Structure \== "Breathe" AND Platform \== "TikTok" | WARNING | "Breathe structure is high-risk on TikTok." | "Switch to Pulse or Drop." |
| **R02** | The Speed Trap | Duration \< 20s AND Structure \== "Wave" | BLOCK | "Duration too short for Wave." | "Increase duration or choose Surge." |
| **R03** | The Dialogue Clash | Dialogue \== ON AND Structure \== "Drop" | WARNING | "Drop structure relies on density." | "Ensure dialogue clears the Drop." |
| **R04** | Shorts Limit | Platform \== "YT Shorts" AND Duration \> 60 | BLOCK | "Shorts limit exceeded." | "Reduce duration to 60s." |

### **5.4 Language Rules (Sanitization)**

To strictly adhere to the requirement of "No Neuroscience, No Hz" (Point 15), the UI text generation passes through a sanitizer.

* **Prohibited:** "Amygdala," "Dopamine," "Frequency," "Hz," "BPM," "Cognitive Load."  
* **Allowed:** "Fast," "Slow," "Dense," "Sparse," "Loud," "Quiet," "Early," "Late."  
* **Implementation:** All output strings from the Rules Engine and Quality Analyzer are pulled from a strict dictionary. There is no LLM generation of text, preventing accidental usage of forbidden terms.

## ---

**6\. Dialogue and Audio Logic**

The Dialogue toggle (Point 9\) is a binary switch that fundamentally alters the density calculations of the timeline. Audio density and dialogue intelligibility are often at odds; Resonance enforces rules to manage this conflict.

### **6.1 Dialogue \= OFF (Music-Driven)**

* **Logic:** The music is the primary driver.  
* **Sound Density:** Can reach "Maximum" levels.  
* **Cut Speed:** Tightly coupled to the theoretical beat. Fast cuts are encouraged during Peaks.  
* **SFX:** Unrestricted. Risers, hits, and whooshes are allowed anywhere.

### **6.2 Dialogue \= ON (Speech-Driven)**

* **Logic:** Intelligibility overrides energy.  
* **Sound Density Cap:** The calculated Sound Density for all segments is capped at "Medium." The "Peak" segment in a Surge structure, which normally demands "Max" density, is downgraded to "High" to ensure the voice is heard.  
* **Cut Speed Modifier:** The recommended cut speed is slowed by 20%. Rapid-fire cuts can be disorienting when accompanied by spoken words.  
* **SFX Constraint:** The "Do/Don't" list in the blueprint explicitly instructs: "No SFX during speech segments."  
* **Duck Guidance:** The blueprint includes markers for "Duck Music" (lower volume) during segments identified as heavy dialogue areas (typically Hook and Build).

## ---

**7\. Iteration Logic: The "Correction" Commands**

Point 13 of the spec defines strict iteration commands. These are not vague requests; they are mathematical modifiers applied to the Blueprint generation parameters.

### **7.1 "More Intense"**

* **Logic:** Increase energy density.  
* **Mathematical Modifier:**  
  * Decrease average cut duration guidance by 15% (creating faster cuts).  
  * Upgrade Sound Density: "Low" becomes "Med," "Med" becomes "High."  
  * *Conflict Check:* If Dialogue is ON, this command may trigger a "Dialogue Clash" warning.

### **7.2 "Calmer"**

* **Logic:** Reduce energy density.  
* **Mathematical Modifier:**  
  * Increase average cut duration guidance by 20% (longer holds).  
  * Downgrade Sound Density: "High" becomes "Med."  
  * Expand "Silence" markers: The duration of mandatory silence in Surge/Drop structures increases by 0.2s.

### **7.3 "More Contrast"**

* **Logic:** Widen the gap between the quietest and loudest segments.  
* **Mathematical Modifier:**  
  * Quiet segments (Hook, Resolve) get *quieter* (Sound Density $\\rightarrow$ Low/Silence).  
  * Loud segments (Peak, Drop) get *louder* (Sound Density $\\rightarrow$ Max).  
  * Silence durations are doubled.

### **7.4 "Clearer"**

* **Logic:** Simplify the timeline for readability.  
* **Mathematical Modifier:**  
  * Reduce layer density instructions (fewer SFX).  
  * Slow pacing by 10%.  
  * Enforce "Linear" cut speeds (removing acceleration/deceleration curves).

## ---

**8\. Quality Analyzer and Scoring Logic**

The Quality Analyzer (Point 11\) is the visible "Teacher" in the UI. It provides a real-time feedback loop. The score is not random; it is calculated based on the delta between the user's inputs and the optimal configuration for the selected structure/platform.

### **8.1 Sub-Score Algorithms (0–100)**

**1\. Hook Strength**

* **Goal:** Measure the effectiveness of the first segment.  
* **Algorithm:**  
  * Start at 100\.  
  * If Hook Duration \> 3s (TikTok/IG) or \> 5s (YT), deduct 20 points.  
  * If Cut Speed is "Slow", deduct 15 points.  
  * *Output:* "Hook Strength: 65\. Issue: Hook is 5s long. Fix: Trim to 3s."

**2\. Emotional Consistency**

* **Goal:** Ensure the Structure fits the Emotion.  
* **Algorithm:** Matches user Input against Structure.compatibleEmotions.  
  * Match: 100\.  
  * Partial Match (defined in secondary list): 75\.  
  * Mismatch: 40\.  
  * *Output:* "Emotional Consistency: 40\. Issue: Calm emotion does not fit Drop structure. Fix: Change to Pulse."

**3\. Pacing Health**

* **Goal:** Determine if the duration allows the structure to breathe.  
* **Algorithm:** Calculate Average Segment Duration.  
  * If AvgDuration \< 2.0s (Too compressed): Score 50\.  
  * If AvgDuration \> 15s (Too dragging): Score 60\.  
  * Else: Score 100\.  
  * *Output:* "Pacing Health: 50\. Issue: Video is too short for this complexity. Fix: Switch to Surge or increase duration."

**4\. Contrast Use**

* **Goal:** Verify density variance.  
* **Algorithm:** Check the delta between the highest density segment and lowest density segment.  
  * If Max \- Min \< 2 steps: Deduct 30 points.  
  * *Output:* "Contrast Use: 70\. Issue: Energy is flat. Fix: Use 'More Contrast' command."

**5\. Resolution Quality**

* **Goal:** Ensure the ending fits the platform.  
* **Algorithm:**  
  * If Platform \== TikTok AND Structure \== "Resolve" (Fade out): Deduct 10 points (Loop preferred).  
  * If Platform \== YT Shorts AND Duration \== 60s AND EndBuffer \< 1s: Deduct 20 (Risk of cutting off).

## ---

**9\. Technical Stack Implementation**

Phase 1 is built as a web application. The architectural choices prioritize strict typing, immutability, and precise PDF rendering.

### **9.1 Core Framework: React \+ TypeScript**

* **React 18:** Functional components are ideal for the state-driven logic of the generator.  
* **TypeScript:** Essential for the Rules Engine. We define Structure, Segment, and Platform as strictly typed interfaces. This prevents "magic string" errors and ensures that math operations are performed on numbers, not strings.15

### **9.2 State Management: Context API \+ Reducers**

We avoid Redux for Phase 1 to reduce boilerplate. The application state is complex but synchronous.

* **ResonanceContext:** Holds Inputs, Blueprint, and Conflicts.  
* **RulesReducer:** A pure function that takes State \+ Action (e.g., SET\_DURATION) and calculates the new Blueprint and Conflicts. This ensures that every UI update triggers a full re-validation of the logic gates.16

### **9.3 Timeline Visualization: CSS Grid vs. Canvas**

Snippet research 17 compares Canvas and DOM-based rendering.

* **Decision:** **CSS Grid**.  
* **Reasoning:** Resonance Phase 1 is a *read-only* blueprint generator. We are not building a performant dragging/trimming NLE (yet). CSS Grid allows us to map the Segment.percentage directly to grid-template-columns: 15fr 35fr 10fr.... This is responsive, prints cleanly to PDF (vectors), and is easier to style with CSS Modules. Canvas is overkill for a static bar and introduces accessibility/printing hurdles.

### **9.4 PDF Generation Engine**

The output is a document. We utilize **@react-pdf/renderer**.20

* **Why not html2canvas?** html2canvas creates raster screenshots. These pixelate when printed and text is not selectable.  
* **Advantage:** @react-pdf/renderer allows us to write React components (\<View\>, \<Text\>, \<Page\>) that compile to a real PDF document. This ensures the "Blueprint" looks professional, crisp, and functions as a high-quality deliverable.

## ---

**10\. Blueprint Generation (The Artifact)**

The PDF Blueprint is the tangible product the user takes away. It translates the internal JSON logic into human-readable instructions.

### **10.1 Blueprint Layout**

1. **Header:** Project Metadata (Emotion, Duration, Platform).  
2. **Visual Timeline Strip:**  
   * Color-coded segments (Red=Peak, Blue=Calm).  
   * Exact timecodes (00:00 – 00:09).  
3. **Segment Detail Table:**  
   * **Segment:** Name (Hook).  
   * **Time:** 0:00–0:03.  
   * **Video Instruction:** "Fast Cuts (0.5s). Focus on faces."  
   * **Audio Instruction:** "High Density. No silence."  
4. **Audio Timeline:** A separate strip showing "Sound Density" (Low/Med/High/Silence) to guide sound design.  
5. **Quality Scorecard:** The detailed breakdown from the Quality Analyzer.  
6. **Conflict Warnings:** If the user bypassed warnings, they are printed here (e.g., "Warning: Dialogue may clash with Drop").

## ---

**11\. Conclusion**

Resonance Phase 1 represents a fundamental shift in video creation tools. By moving the decision-making process *upstream* of the editing phase, it eliminates the "blank canvas" paralysis.

The architecture defined in this specification—relying on the **Largest Remainder Method** for integer partitioning, the **Seven Fixed Structures** for emotional logic, and the **Rules Engine** for platform physics—ensures that the system delivers on its core promise: **The prevention of bad decisions.**

The mental model is strictly deterministic. This is not AI. It is structural engineering for emotion. By building this rigid framework in Phase 1, we lay the groundwork for Phase 2, which can introduce audio waveform visualization and EDL export, transforming the Blueprint from a guide into a direct NLE integration.

## **12\. Technical Addendum: Implementation Schemas**

### **A. Segment Calculation Implementation (TypeScript)**

TypeScript

// The LRM Algorithm for Duration Allocation  
interface SegmentDef {  
  id: string;  
  percentage: number;  
}

const calculateSegmentDurations \= (  
  totalSeconds: number,   
  segments: SegmentDef  
): number \=\> {  
  // 1\. Calculate Raw Values  
  const rawValues \= segments.map(s \=\> (s.percentage / 100) \* totalSeconds);  
    
  // 2\. Floor and Remainder  
  const parts \= rawValues.map((val, index) \=\> ({  
    index,  
    integer: Math.floor(val),  
    remainder: val \- Math.floor(val)  
  }));  
    
  // 3\. Sum of Integers  
  const sumInt \= parts.reduce((acc, curr) \=\> acc \+ curr.integer, 0);  
    
  // 4\. Deficit  
  let deficit \= totalSeconds \- sumInt;  
    
  // 5\. Sort by Remainder Descending  
  parts.sort((a, b) \=\> b.remainder \- a.remainder);  
    
  // 6\. Distribute Deficit  
  for (let i \= 0; i \< deficit; i++) {  
    parts\[i\].integer \+= 1;  
  }  
    
  // 7\. Restore Order  
  parts.sort((a, b) \=\> a.index \- b.index);  
    
  return parts.map(p \=\> p.integer);  
};

### **B. Quality Analyzer Sub-Score Logic**

TypeScript

const calculatePacingHealth \= (  
  duration: number,   
  segmentCount: number  
): { score: number, issue?: string, fix?: string } \=\> {  
  const avgSegDuration \= duration / segmentCount;  
    
  if (avgSegDuration \< 2.0) {  
    return {  
      score: 50,  
      issue: "Timeline is too compressed.",  
      fix: "Increase duration or choose a simpler structure."  
    };  
  }  
    
  if (avgSegDuration \> 15.0) {  
    return {  
      score: 60,  
      issue: "Segments are dragging.",  
      fix: "Decrease duration or choose a Wave structure."  
    };  
  }  
    
  return { score: 100 };  
};

This completes the exhaustive specification for Resonance Phase 1\. The development team should proceed with setting up the React/TypeScript repository and implementing the JSON definitions for the 7 Fixed Structures.

#### **Works cited**

1. Anyone build a 'Video Editing' like application with React? : r/reactjs \- Reddit, accessed on January 15, 2026, [https://www.reddit.com/r/reactjs/comments/1k2cbqv/anyone\_build\_a\_video\_editing\_like\_application/](https://www.reddit.com/r/reactjs/comments/1k2cbqv/anyone_build_a_video_editing_like_application/)  
2. What is the Maximum Video Length on TikTok in 2025 \- Jogg AI, accessed on January 15, 2026, [https://www.jogg.ai/blog/how-long-can-a-tiktok-be-2025/](https://www.jogg.ai/blog/how-long-can-a-tiktok-be-2025/)  
3. How Long Can Instagram Reels Be in 2025? \[Best Lengths\] \- OneStream Live, accessed on January 15, 2026, [https://onestream.live/blog/how-long-can-instagram-reels-be/](https://onestream.live/blog/how-long-can-instagram-reels-be/)  
4. Uses the "Largest Remainder Method" to ensure rounded percentages add up to their correct total \- GitHub Gist, accessed on January 15, 2026, [https://gist.github.com/dochoffiday/333a22e937f7503cd770ed70a429df23](https://gist.github.com/dochoffiday/333a22e937f7503cd770ed70a429df23)  
5. Javascript implementation of the largest remainder method http://en.wikipedia.org/wiki/Largest\_remainder\_method · GitHub, accessed on January 15, 2026, [https://gist.github.com/hijonathan/e597addcc327c9bd017c](https://gist.github.com/hijonathan/e597addcc327c9bd017c)  
6. Getting 100% with rounded percentages | by João Ferreira \- Runtime Revolution, accessed on January 15, 2026, [https://revs.runtime-revolution.com/getting-100-with-rounded-percentages-273ffa70252b](https://revs.runtime-revolution.com/getting-100-with-rounded-percentages-273ffa70252b)  
7. TikTok Video Sizes: Ultimate 2025 Guide for Content Creators \- Stack Influence, accessed on January 15, 2026, [https://stackinfluence.com/tiktok-video-sizes-the-ultimate-2025-guide/](https://stackinfluence.com/tiktok-video-sizes-the-ultimate-2025-guide/)  
8. How Long Can TikTok Videos Be? 2025 Limits and Guidelines \- Metricool, accessed on January 15, 2026, [https://metricool.com/tiktok-video-length/](https://metricool.com/tiktok-video-length/)  
9. 7 YouTube Shorts Best Practices for Viral Growth in 2025 \- JoinBrands, accessed on January 15, 2026, [https://joinbrands.com/blog/youtube-shorts-best-practices/](https://joinbrands.com/blog/youtube-shorts-best-practices/)  
10. TikTok Video Formats \- 2025 Guide (Dimensions and Duration) \- Agence Utopia, accessed on January 15, 2026, [https://www.theutopia.fr/en/post/formats-videos-tiktok-guide](https://www.theutopia.fr/en/post/formats-videos-tiktok-guide)  
11. How to make your YouTube shorts watchable until the end (2025 Guide), accessed on January 15, 2026, [https://blog.matchfy.io/how-to-make-your-youtube-shorts-watchable-until-the-end-2025-guide/](https://blog.matchfy.io/how-to-make-your-youtube-shorts-watchable-until-the-end-2025-guide/)  
12. Instagram Reels Length Now 3 Minutes in 2025\! \- NearStream, accessed on January 15, 2026, [https://www.nearstream.us/blog/instagram-reel-length-in-2025](https://www.nearstream.us/blog/instagram-reel-length-in-2025)  
13. Ideal Instagram Video Length & TikTok Video Length in 2025 \- Bennofilms, accessed on January 15, 2026, [https://bennofilms.com/blog/ideal-instagram-tiktok-video-length](https://bennofilms.com/blog/ideal-instagram-tiktok-video-length)  
14. YouTube Shorts Length 2025: Ideal Duration Explained \- MAPSystems, accessed on January 15, 2026, [https://mapsystemsindia.com/resources/youtube-shorts-length.html](https://mapsystemsindia.com/resources/youtube-shorts-length.html)  
15. Twick: React SDK for Timeline-Based Video Editing, accessed on January 15, 2026, [https://ncounterspecialist.github.io/twick/](https://ncounterspecialist.github.io/twick/)  
16. React State Management in 2025: What You Actually Need, accessed on January 15, 2026, [https://www.developerway.com/posts/react-state-management-2025](https://www.developerway.com/posts/react-state-management-2025)  
17. Performance of moving image on web page via CSS vs HTML5 Canvas \- Stack Overflow, accessed on January 15, 2026, [https://stackoverflow.com/questions/4842872/performance-of-moving-image-on-web-page-via-css-vs-html5-canvas](https://stackoverflow.com/questions/4842872/performance-of-moving-image-on-web-page-via-css-vs-html5-canvas)  
18. Performance of the Canvas vs Performance of the DOM. : r/html5 \- Reddit, accessed on January 15, 2026, [https://www.reddit.com/r/html5/comments/2vnrvm/performance\_of\_the\_canvas\_vs\_performance\_of\_the/](https://www.reddit.com/r/html5/comments/2vnrvm/performance_of_the_canvas_vs_performance_of_the/)  
19. Optimizing canvas \- Web APIs | MDN, accessed on January 15, 2026, [https://developer.mozilla.org/en-US/docs/Web/API/Canvas\_API/Tutorial/Optimizing\_canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)  
20. 6 Open-Source PDF generation and modification libraries every React dev should know in 2025, accessed on January 15, 2026, [https://blog.react-pdf.dev/6-open-source-pdf-generation-and-modification-libraries-every-react-dev-should-know-in-2025](https://blog.react-pdf.dev/6-open-source-pdf-generation-and-modification-libraries-every-react-dev-should-know-in-2025)