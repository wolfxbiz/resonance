# **Phase-2 Information Architecture: The Resonance Feedback System**

## **1\. Architectural Philosophy and System Goals**

The transition of the Resonance system from Phase-1 to Phase-2 marks a definitive architectural pivot. Where Phase-1 functioned as a generative planner—a canvas for identifying creative intent—Phase-2 operates as a deterministic feedback system. The primary objective is to rigidify the fluid ideas of the planning phase into a set of executable constraints, transforming the "plan" into a "blueprint" against which actual execution can be measured. This shift moves the user from a mode of open-ended ideation to one of structural enforcement.

The core goal of Phase-2 is to turn Resonance into a feedback system without the introduction of server-side databases or generative AI opinions. The system remains strictly local-first, leveraging the user's device for state management and validation. This architectural decision aligns with the principles of local-first software, which prioritize user ownership, privacy, and zero-latency interaction.1 By eschewing a central database, Resonance ensures that the "truth" of a project resides in the local file system, accessible and mutable only by the user, yet rigorously validated by the application's logic.

This report articulates the authoritative Information Architecture (IA) for Phase-2. It introduces exactly four new layers: **Blueprint (Frozen)**, **Execution Mapping (Translation)**, **Validation Signals (Constraint Engine)**, and **Outcome Review (Closing the Loop)**. Each layer is designed to reduce ambiguity. The system does not offer "suggestions"; it provides binary judgments based on the deviation between the user's Blueprint and their Execution. This creates a closed-loop control system where the input (Blueprint) dictates the parameters of the output (Execution), and the Validation layer serves as the error detector.

### **1.1 The Deterministic Nature of Phase-2**

In a landscape saturated with probabilistic AI tools that offer "fuzzy" creative advice, Resonance Phase-2 stands apart by offering deterministic structural validation. The system does not "think" a video is good; it "calculates" whether a video adheres to the structural rules established by the user's own Blueprint and the physics of the target platform.

The prohibition of "AI opinions" and "generative fluff" necessitates a rigorous reliance on algorithmic heuristics. For example, "Pacing" is not treated as an artistic feeling but as a mathematical derivative of Average Shot Length (ASL) relative to the audio track's Beats Per Minute (BPM).3 "Cognitive Load" is not a subjective assessment but a calculated ratio of visual cut density to dialogue word count.4 This report details the data structures and logic required to implement this deterministic engine.

### **1.2 The Local-First State Machine**

To satisfy the "No databases yet" requirement, Phase-2 employs a strict Redux-style state machine architecture.5 The state of the application is a single, immutable tree containing the four layers. Transitions between states are handled via pure functions (reducers), ensuring that the history of the project is predictable and debuggable without server logs.

This approach leverages the useReducer hook pattern in React, combined with Immer for managing immutable updates.7 The project file is a JSON document that serves as the single source of truth, containing the locked Blueprint, the mutable Execution Map, the computed Validation Signals, and the appended Outcome Review. This ensures that a Resonance project is a self-contained artifact, portable and resilient to network failure, satisfying the "Seven Ideals for Local-First Software".2

## ---

**2\. Layer 1: Blueprint (Locked – Phase-1 Output)**

The Blueprint layer is the foundational bedrock of Phase-2. It represents the historical truth of the project's intent. Architecturally, this layer acts as the "Reference Input" for the feedback system. Crucially, in Phase-2, the Blueprint is **Read-Only**.

The necessity of locking this layer cannot be overstated. In any feedback control system, if the reference input is allowed to drift alongside the output, error detection becomes impossible. If a user can retroactively change their "Plan" to match their "Execution," the system ceases to be a feedback loop and becomes merely a documentation tool. Therefore, Phase-2 enforces strict immutability on the Blueprint.

### **2.1 The Philosophy of the "Locked" State**

Immutability in this context is not just a technical constraint; it is a psychological one. It establishes a "designed intent" that serves as an anchor. Technically, this is implemented by freezing the JavaScript object representing the Phase-1 output. Any attempt to modify the Blueprint data structure in Phase-2 triggers a state violation.

This aligns with the React philosophy that "state is immutable".9 When the project transitions from Phase-1 to Phase-2, the Phase-1 state is deep-cloned and wrapped in a Phase-2 Blueprint container. This container is then flagged as read\_only: true, preventing the UI from rendering edit controls for these fields.10

### **2.2 Structural Additions in Phase-2**

While the content of the Blueprint is frozen, the container requires specific metadata to function within the Phase-2 ecosystem. We add exactly three elements: the **Blueprint ID**, the **Timestamp**, and the **Platform Context**.

#### **2.2.1 Blueprint ID (Immutable)**

A unique identifier is generated using a UUID v4 standard upon the creation of the Blueprint. This ID is immutable and serves as the foreign key for all subsequent layers.

* **Purpose:** It links the mutable Execution Mapping back to the immutable Blueprint. In a file-based system, this allows for the potential separation of files (e.g., a lightweight Validation report that references a heavy Blueprint file) while maintaining data integrity.  
* **Implementation:** blueprint\_id: "550e8400-e29b-41d4-a716-446655440000"

#### **2.2.2 Timestamp (The Anchor)**

An ISO 8601 timestamp marks the exact moment the Blueprint was locked.

* **Relevance:** This is distinct from a "Last Modified" date. It is the "Point of Conception." It allows the Outcome Review layer to calculate the "Idea-to-Publish" velocity.  
* **Format:** locked\_at: "2026-01-16T10:00:00Z"

#### **2.2.3 Platform Context (The Physics Engine)**

This is the most critical addition to Layer 1\. The "Platform Context" defines the constraints and physical laws of the environment where the video will exist. A video intended for TikTok exists in a fundamentally different physical reality than one intended for YouTube Shorts or a 16:9 Cinema display.

The Platform Context is not merely a label; it is a configuration object that seeds the Validation Layer (Layer 3). It defines the aspect ratio, the maximum duration, the "safe zones" for UI overlays, and the algorithmic preferences of the target platform. By embedding this in the Blueprint, we ensure that the Validation Engine knows *which* rulebook to apply.

### **2.3 Detailed Platform Context Specifications**

To build an authoritative system, we must define the specific constraints for the major short-form platforms as of 2026\. These constraints are derived from technical specifications and user retention data.11

**Table 1: Platform Context Specifications (2026 Standards)**

| Parameter | TikTok | Instagram Reels | YouTube Shorts |
| :---- | :---- | :---- | :---- |
| **Aspect Ratio** | 9:16 (Vertical) | 9:16 (Vertical) | 9:16 (Vertical) |
| **Resolution** | 1080 x 1920 | 1080 x 1920 | 1080 x 1920 |
| **Hard Max Duration** | 600s (10 min) | 180s (3 min) | 180s (3 min) |
| **Soft "Sweet Spot"** | 21-34s (Viral) / 60-180s (Depth) | 15-30s (Viral) / 60-90s (Depth) | 13s (Loop) / 50-60s (Retention) |
| **Safe Zone Top** | 108px (from top edge) | 220px (from top edge) | 96px (from top edge) |
| **Safe Zone Bottom** | 320px (from bottom edge) | 420px (from bottom edge) | 192px (from bottom edge) |
| **Safe Zone Sides** | 60px (Left), 120px (Right) | 60px (Left/Right) | \~40px (Left/Right) |
| **Loop Bias** | High (Auto-looping preferred) | High | Very High (13s loop optimization) |

Data Structure Implications:  
The platform\_context object in the JSON schema must carry these pixel values. This allows the Validation Engine to perform geometric checks. For instance, if a text element in the Execution Mapping is positioned at y: 1800 on an Instagram Reel, the system can mathematically determine that it falls within the 420px bottom exclusion zone ($1920 \- 420 \= 1500$, so $1800 \> 1500$, resulting in occlusion).13

### **2.4 Layer 1 JSON Schema Definition**

The following JSON schema defines the authoritative structure for the Blueprint layer. It utilizes the standard JSON Schema specification 17 to enforce the "read-only" nature and the presence of platform context.

JSON

{  
  "$schema": "https://resonance.app/schemas/v2/blueprint.json",  
  "title": "Resonance Phase-2 Blueprint",  
  "type": "object",  
  "required": \["blueprint\_id", "timestamp", "platform\_context", "phase\_1\_data"\],  
  "properties": {  
    "blueprint\_id": {  
      "type": "string",  
      "format": "uuid",  
      "description": "Immutable unique identifier for the locked blueprint."  
    },  
    "timestamp": {  
      "type": "string",  
      "format": "date-time",  
      "description": "ISO 8601 timestamp of when the plan was locked."  
    },  
    "platform\_context": {  
      "type": "object",  
      "required": \["platform\_id", "constraints", "safe\_zones"\],  
      "properties": {  
        "platform\_id": {  
          "type": "string",  
          "enum":  
        },  
        "constraints": {  
          "type": "object",  
          "properties": {  
            "max\_duration\_sec": { "type": "integer" },  
            "preferred\_hook\_duration\_sec": { "type": "number" }  
          }  
        },  
        "safe\_zones": {  
          "type": "object",  
          "properties": {  
            "top\_px": { "type": "integer" },  
            "bottom\_px": { "type": "integer" },  
            "left\_px": { "type": "integer" },  
            "right\_px": { "type": "integer" }  
          }  
        }  
      }  
    },  
    "phase\_1\_data": {  
      "type": "object",  
      "readOnly": true,  
      "description": "The frozen output from Phase-1. Treated as a black box payload."  
    }  
  },  
  "additionalProperties": false  
}

## ---

**3\. Layer 2: Execution Mapping (The Translation Engine)**

Execution Mapping is the operational core of Phase-2. If the Blueprint is the "Strategy," Execution Mapping is the "Tactics." This layer earns the system's existence by translating abstract rules (e.g., "Make it high energy") into editor-level actions (e.g., "Cut every 1.2 seconds").

This layer does not generate the video file itself. Instead, it generates a structured metadata representation of the *intended* video timeline. It creates a bridge between the conceptual Blueprint and the Non-Linear Editor (NLE). By mapping execution details *before* the actual editing begins, users create a specification that can be validated.

The IA divides Execution Mapping into three distinct sub-domains: **Audio Plan**, **Edit Rhythm**, and **Visual Density**. These correspond to the three primary sensory channels manipulated during video editing: Time (Audio), Pacing (Rhythm), and Information (Visual).

### **3.1 Audio Plan: The Temporal Grid**

In modern short-form video editing, audio is the primary driver of structure. Music and dialogue determine the grid upon which visual cuts are placed. The Audio Plan formalizes this grid.

#### **3.1.1 Music BPM and the Frame Grid**

The foundational unit of the Audio Plan is the **Beats Per Minute (BPM)**. The IA requires the user to define a BPM range or specific value. This is not merely for musicality; it is for mathematical precision in editing.3

Video editing operates in Frames Per Second (FPS). Music operates in Beats Per Minute (BPM). The Audio Plan translates BPM into a "Frame Grid" using the following logic 18:

BPM to Frame Conversion Formula:

$$FramesPerBeat \= \\frac{FPS \\times 60}{BPM}$$  
**Example:**

* **FPS:** 30  
* **BPM:** 120  
* **Calculation:** $(30 \\times 60\) / 120 \= 15$ Frames per Beat.

This calculation is critical for the "Edit Rhythm" layer. If the user selects a 120 BPM track, the system knows that "on-beat" cuts must occur at intervals of 15 frames. This creates a validation rule: cuts occurring at frame 17 or 18 are "off-grid" and can be flagged as rhythmic errors.

#### **3.1.2 Silence Markers (The "Breath" Structure)**

Continuous sound creates auditory fatigue. Silence is a structural element used to reset the viewer's attention.20 The Audio Plan explicitly maps "Silence Markers"—exact timestamp ranges where the audio track is planned to drop to near-zero decibels.

* **IA Structure:** An array of TimeRange objects.  
* **Validation Utility:** Layer 3 will check if these silence markers align with "Visual Density" drops (Layer 3.3.2). High visual information combined with silence allows for processing; high visual information combined with loud audio creates overload.

#### **3.1.3 Ducking Rules**

"Ducking" is the reduction of background audio volume to make room for dialogue. Instead of leaving this to the mixing phase, Execution Mapping defines explicit **Ducking Rules**.

* **Logic:** IF segment.type \== DIALOGUE THEN background\_audio.target\_db \= \-15dB.21  
* **IA Structure:** A boolean flag is\_ducked applied to timeline segments. This prevents the common error of "muddy" audio where music competes with the voiceover.

### **3.2 Edit Rhythm: The Pacing Engine**

Edit Rhythm translates the "Vibe" of the blueprint into cut frequency. It moves beyond vague adjectives like "fast" or "slow" and uses quantitative metrics, specifically **Average Shot Length (ASL)**.22

#### **3.2.1 Cut Frequency by Segment**

The timeline is divided into segments (Hook, Body, Climax, Outro). Each segment is assigned a target\_cut\_density derived from the content's intent.

Table 2: Target Average Shot Length (ASL) by Segment Type 24

| Segment Type | Visual Intent | Target ASL (Seconds) | Target Frames (at 30fps) |
| :---- | :---- | :---- | :---- |
| **Hook** | High Energy / Disruption | 0.5s \- 1.5s | 15 \- 45 frames |
| **Action** | Kinetic / Chaos | 1.0s \- 2.5s | 30 \- 75 frames |
| **Dialogue** | Information Transfer | 3.0s \- 5.0s | 90 \- 150 frames |
| **B-Roll/Vibe** | Aesthetic Appreciation | 2.5s \- 4.0s | 75 \- 120 frames |

The Execution Mapping layer stores these targets. The editor's actual cuts are later compared against these targets in Layer 3\.

#### **3.2.2 Acceleration / Deceleration Flags**

Pacing is dynamic. A "Ramp Up" or "Ramp Down" is a standard editing technique to build tension or release it.27 The IA includes specific flags for these pacing curves.

* **Acceleration:** The ASL decreases over time (e.g., Shot 1 \= 4s, Shot 2 \= 3s, Shot 3 \= 1s).  
* **Deceleration:** The ASL increases over time (e.g., transitioning from a fast montage to a slow, emotional close-up).  
* **IA Structure:** pacing\_curve: "LINEAR\_ACCEL" | "EXPONENTIAL\_DECEL" | "STATIC"

### **3.3 Visual Density: The Cognitive Load Map**

Visual Density controls the amount of information the viewer must process through the visual channel. This is distinct from the cut rate; a single shot can be visually dense (e.g., a complex infographic) or visually sparse (e.g., a solid color background).4

#### **3.3.1 Shot Change Rate**

This metric tracks the frequency of significant visual variation *within* shots or across cuts. It is the "Refresh Rate" of the visual stimulus.

#### **3.3.2 Motion Intensity (The "Motion Microscopy" Metric)**

Leveraging concepts from motion estimation and microscopy 29, we quantify the intensity of movement within the frame. Since we are avoiding AI analysis, this is a user-declared or heuristic-based classification in Phase-2.

* **Levels:**  
  * **LOW:** Talking head, tripod shot, minimal pixel displacement.  
  * **MED:** Walking shot, hand gestures, slow pan/zoom.  
  * **HIGH:** Fast action, whip pans, running, high-frequency pixel displacement.  
* **Why it matters:** High Motion Intensity requires higher bitrate processing by the brain. Combining **HIGH** Motion Intensity with **HIGH** Dialogue Density violates cognitive load principles (Layer 3.3).

### **3.4 Interoperability: OTIO Integration**

To ensure that Execution Mapping is not an isolated silo, the data structure is designed to map directly to **OpenTimelineIO (OTIO)** schemas.31 This allows the "Execution Plan" to be exported to professional NLEs like Premiere Pro or DaVinci Resolve.

**Mapping Logic:**

* Audio Plan $\\rightarrow$ OTIO Stack (Audio Tracks).  
* Edit Rhythm $\\rightarrow$ OTIO Clip durations and OTIO Transition objects.  
* Silence Markers $\\rightarrow$ OTIO Markers or Gap objects.  
* Visual Density $\\rightarrow$ Metadata attached to OTIO Clip objects.

By adhering to this standard, Resonance acts as a pre-processor for the editing workflow, creating a structured EDL (Edit Decision List) before a single file is imported.

### **3.5 Layer 2 JSON Schema Definition**

The Execution Mapping schema is the mutable workspace for Phase-2.

JSON

{  
  "$schema": "https://resonance.app/schemas/v2/execution\_mapping.json",  
  "title": "Resonance Phase-2 Execution Mapping",  
  "type": "object",  
  "properties": {  
    "layer\_id": { "type": "string", "default": "execution\_v1" },  
    "blueprint\_ref": { "type": "string", "format": "uuid" },  
    "audio\_plan": {  
      "type": "object",  
      "properties": {  
        "bpm": { "type": "integer", "minimum": 40, "maximum": 200 },  
        "frame\_grid\_offset": { "type": "integer", "description": "Frame offset for beat 1" },  
        "silence\_markers": {  
          "type": "array",  
          "items": {  
            "type": "object",  
            "properties": {  
              "start\_frame": { "type": "integer" },  
              "end\_frame": { "type": "integer" }  
            }  
          }  
        },  
        "ducking\_enabled": { "type": "boolean" }  
      }  
    },  
    "edit\_rhythm": {  
      "type": "object",  
      "properties": {  
        "segments": {  
          "type": "array",  
          "items": {  
            "type": "object",  
            "properties": {  
              "label": { "type": "string" },  
              "start\_frame": { "type": "integer" },  
              "end\_frame": { "type": "integer" },  
              "target\_asl\_frames": { "type": "integer" },  
              "pacing\_curve": { "type": "string", "enum": }  
            }  
          }  
        }  
      }  
    },  
    "visual\_density": {  
      "type": "array",  
      "items": {  
        "type": "object",  
        "properties": {  
          "time\_range": { "type": "string" },  
          "motion\_intensity": { "type": "string", "enum": }  
        }  
      }  
    }  
  }  
}

## ---

**4\. Layer 3: Validation Signals (The Constraint Engine)**

Validation Signals is the defining layer of Phase-2. It transforms the system from a passive planner into an active feedback loop. This layer operates as a **Constraint Engine**—a logic processor that compares the *Execution Mapping* (Layer 2\) against the *Blueprint* (Layer 1\) and a set of universal video physics rules.

It is crucial to distinguish this from analytics. Analytics measures performance *post-publication* (e.g., "This video got 100 views"). Validation measures structural integrity *pre-publication* (e.g., "This video violates the 3-second hook rule").

The output of this layer is strictly binary or ternary: **PASS**, **WARNING**, **FAIL**. We avoid granular scores (e.g., "87/100") because they introduce ambiguity. A "B+" implies the video is "good enough," whereas a **WARNING** explicitly signals a structural risk that must be accepted or resolved.34

### **4.1 Platform Constraints (The "Hard" Physics)**

These validators ensure the video is technically viable for the chosen Platform Context defined in Layer 1\. Failure here is often a "Hard Fail," meaning the content will be functionally compromised on the target platform.

#### **4.1.1 Hook Length Compliance**

The "Hook" is the most critical structural component of short-form video. Platform data suggests that retention decisions are made within the first 3 seconds.26

* **Constraint:** The primary visual or auditory hook must occur within the window $\[0, t\_{hook}\]$.  
* **Metric:** For TikTok/Reels, $t\_{hook} \= 3.0s$.  
* **Validation Logic:**  
  1. Query ExecutionMapping.edit\_rhythm for the first segment (Segment 0).  
  2. Check Segment.visual\_density.  
  3. **Rule:** IF Segment.duration \> 3.0s AND Segment.visual\_density\!= HIGH THEN return FAIL.  
  * *Interpretation:* If the first shot is a long, static low-motion shot exceeding 3 seconds, the hook has failed technically. The viewer is likely to scroll before the first cut or action occurs.

#### **4.1.2 Total Duration Risk and "Sweet Spots"**

Platforms favor specific duration brackets. A video that falls into a "dead zone" (e.g., too long for a quick loop, too short for a narrative payoff) is a structural risk.

* **Data:**  
  * *YouTube Shorts:* Bimodal success distribution at \~13s (Loop) and \~60s (Narrative).14  
  * *TikTok:* 21-34s (Viral) vs 60s+ (Engagement).14  
* **Validation Logic:**  
  1. Calculate Total\_Duration \= Total\_Frames / FPS.  
  2. Compare against Blueprint.platform\_context.constraints.sweet\_spots.  
  3. **Rule:** IF Total\_Duration NOT IN THEN return WARNING("Duration Dead Zone").  
  4. **Rule:** IF Total\_Duration \> Hard\_Limit THEN return FAIL("Exceeds Platform Cap").

#### **4.1.3 Safe Zone Collision Detection**

Using the safe zone pixel data from Layer 1 (Table 1), the validator checks for UI occlusion.

* **Validation Logic:**  
  1. Iterate through all text/graphic elements defined in ExecutionMapping.  
  2. Check coordinates $(x, y)$.  
  3. **Rule (Instagram Example):** IF y \> (1920 \- 420\) OR y \< 220 THEN return FAIL("UI Occlusion Risk").13

### **4.2 Structural Integrity (The "Skeleton" Check)**

This sub-layer validates the narrative architecture of the edit. It ensures the video has a pulse.

#### **4.2.1 Peak Presence**

A video without a climax or "Peak" induces boredom. The energy curve must not be flat.

* **Rule:** There must be at least one segment where motion\_intensity \== HIGH OR audio\_volume \== MAX.  
* **Validation Logic:**  
  1. Scan visual\_density map.  
  2. Count segments with HIGH intensity.  
  3. IF High\_Count \== 0 THEN return WARNING("Flatline Structure: No Peak Detected").

#### **4.2.2 Energy Contrast Score**

Uniformity kills attention. "If every moment is cut to peak intensity, nothing feels intense".36 The timeline must exhibit variance in pacing (Standard Deviation of ASL).

* **Metric:** Energy Contrast ($E\_c$) \= Standard Deviation ($\\sigma$) of the Segment ASLs.  
* **Validation Logic:**  
  1. Calculate ASL for all segments $S\_1, S\_2,... S\_n$.  
  2. Calculate $\\sigma(ASL)$.  
  3. **Rule:** IF \\sigma(ASL) \< Threshold (e.g., 0.5s) THEN return WARNING("Monotonous Pacing").  
  * *Interpretation:* This flags "drone" editing where every shot is exactly the same length, creating a robotic and hypnotic (in a bad way) effect.

### **4.3 Cognitive Load (The "Brain" Check)**

This is the most sophisticated validation layer, applying **Cognitive Load Theory (CLT)** 4 to video editing. CLT posits that the human brain has limited processing capacity for concurrent visual and auditory streams.

#### **4.3.1 Cut Density vs. Dialogue (Split-Attention Effect)**

The "Split-Attention Effect" occurs when learners are forced to split their attention between disparate sources of information. In video, this happens when complex dialogue (Auditory Load) competes with rapid visual cuts (Visual Load).

* **Heuristic:** High Auditory Load requires Low Visual Load (Stability).  
* **Validation Logic:**  
  1. Identify segments where Audio\_Type \== DIALOGUE and Word\_Count \> Threshold.  
  2. Check ASL (Average Shot Length) for that segment.  
  3. **Rule:** IF Dialogue\_Density \== HIGH AND ASL \< 1.5s THEN return WARNING("Cognitive Overload: Rapid cuts during complex dialogue").  
  * *Correction:* The system suggests lengthening shots or using B-roll that is less kinetically intense to allow the viewer to process the words.

#### **4.3.2 Silence Placement Validity (The "Processing Gap")**

Silence creates the necessary "processing time" for heavy information.21 This is the "Breath" of the edit.

* **Rule:** Significant information blocks (Peaks) must be followed by a "Breath" (Silence/Low Intensity).  
* **Validation Logic:**  
  1. Find segments tagged information\_density: HIGH.  
  2. Check the immediate subsequent segment.  
  3. **Rule:** IF Next\_Segment.audio\_level \> \-40dB AND Next\_Segment.duration \< 0.5s THEN return WARNING("No Processing Gap").  
  * *Interpretation:* The viewer is not given time to digest the previous point before the next one begins.

### **4.4 Layer 3 JSON Schema Definition**

The Validation Signals layer produces a report object.

JSON

{  
  "$schema": "https://resonance.app/schemas/v2/validation\_signals.json",  
  "title": "Resonance Validation Report",  
  "type": "object",  
  "properties": {  
    "execution\_ref": { "type": "string" },  
    "validation\_timestamp": { "type": "string" },  
    "global\_status": { "type": "string", "enum": },  
    "signals": {  
      "type": "object",  
      "properties": {  
        "platform\_constraints": {  
          "type": "array",  
          "items": {  
            "type": "object",  
            "properties": {  
              "check\_name": { "type": "string", "enum": },  
              "result": { "type": "string", "enum": },  
              "message": { "type": "string" }  
            }  
          }  
        },  
        "cognitive\_load": {  
          "type": "array",  
          "items": {  
             "type": "object",  
             "properties": {  
               "check\_name": { "type": "string", "enum": },  
               "result": { "type": "string" },  
               "segment\_index": { "type": "integer" }  
             }  
          }  
        }  
      }  
    }  
  }  
}

## ---

**5\. Layer 4: Outcome Review (New – Lightweight)**

Phase-2 concludes with the Outcome Review. This layer prevents "Over-Engineering." We do not need complex dashboards or API integrations with social platforms, which are brittle, maintenance-heavy, and violate the local-first simplicity. We need *just enough* data to validate the architectural hypothesis: "Did the structure hold?"

This layer functions as a **Manual Log** (or lightweight API fetch if available) stored in the local JSON. It acts as the "Test Result" corresponding to the "Blueprint Hypothesis."

### **5.1 Outcome Data Points**

The IA restricts the Outcome Review to exactly five data points. Collecting more dilutes the focus.38 The goal is not to track vanity metrics (Likes) but structure-validating metrics (Retention).

#### **5.1.1 Posted? (Yes / No)**

* **Type:** Boolean.  
* **Purpose:** Filters the dataset. Many Blueprints are created but never executed. To learn from the system, we must only analyze executed blueprints.

#### **5.1.2 Platform**

* **Type:** Enum (Must match Blueprint.platform\_context).  
* **Purpose:** Context verification. If a TikTok Blueprint was posted to YouTube Shorts, the retention data is invalid for testing the TikTok-specific rules (Layer 3.1).

#### **5.1.3 First 3s Retention**

* **Type:** Percentage (0-100) or User Estimate.  
* **Source:** Platform analytics (User inputs this manually).  
* **Significance:** This explicitly validates **Layer 3.1.1 (Hook Length)**.  
  * *Feedback Loop:* If Validation said "PASS" (Hook is \<3s) but Retention is 10%, the content was weak even if the structure was correct. If Validation said "FAIL" (Hook \>3s) and Retention is 10%, the rule is validated.

#### **5.1.4 Drop-off Moment (Timestamp)**

* **Type:** Timecode/Frame count.  
* **Significance:** This is the most critical feedback signal for structural integrity. It identifies the exact moment the structure failed.  
* **Correlation:** The system compares this timestamp against the Execution Mapping.  
  * *Scenario:* Drop-off occurs at 0:45.  
  * *System Check:* Was there a WARNING in Layer 3 at 0:45 (e.g., Cognitive Overload)?  
  * *Result:* If Yes, the warning is validated. If No, the system identifies a blind spot in the rules.

#### **5.1.5 User Confidence Rating (1–5)**

* **Type:** Integer.  
* **Purpose:** Subjective calibration. Did the user *feel* the video was good?  
  * *Mismatch Detection:* If Confidence is 5 (High) but Retention is Low, there is a mismatch between the user's taste and the market reality. This suggests the Blueprint itself (Layer 1\) needs adjustment for future projects.

### **5.2 Closing the Loop**

The data from Layer 4 flows back into the system's heuristic engine (locally). Over time, if the user consistently sees drop-offs at moments flagged as "Cognitive Overload," they learn to trust the Validation Signal. The system effectively "trains" the user to adhere to the Blueprint.

## ---

**6\. Technical Implementation: No-Database Architecture**

The constraint "No databases yet" mandates a **Local-First Architecture**. This implies that the state of Phase-2 resides entirely on the client device (browser/disk) in the form of structured files (JSON). This approach offers superior privacy, zero latency, and true ownership of data.2

### **6.1 State Management Pattern: React \+ Immer**

To manage the complexity of four distinct layers without a backend, Phase-2 employs a **Redux-style State Machine** pattern using React's useReducer hook and the Immer library.7

* **Store:** A single JSON tree representing the Project.  
* **Slices:** Each layer (Blueprint, Execution, Validation, Outcome) is a separate "Slice" of the state.40  
* **Immutability:** Immer allows us to write code that *looks* mutable (e.g., state.execution.bpm \= 120\) while generating immutable state updates under the hood. This provides the safety of immutability (essential for history/undo) with the developer ergonomics of mutable objects.

**State Machine Logic:**

1. **Action:** LOCK\_BLUEPRINT \-\> Transitions state from Phase-1 to Phase-2. Freezes Layer 1\.  
2. **Action:** UPDATE\_EXECUTION \-\> Modifies Layer 2\. Triggers RUN\_VALIDATION.  
3. **Action:** RUN\_VALIDATION \-\> Reads Layers 1 & 2\. Computes Layer 3\. (Pure Function).  
4. **Action:** LOG\_OUTCOME \-\> Appends Layer 4\.

### **6.2 Data Persistence: File System Access API**

Instead of a database, the system uses the browser's **File System Access API** (or IndexedDB as a fallback) to read/write the .resonance project files directly to the user's hard drive.41

* **Format:** .resonance (Standard JSON file).  
* **Advantage:** The user can email a project file, back it up to Dropbox, or version control it with Git. The data is never trapped in a proprietary cloud silo.  
* **Read-Only Enforcement:** The application logic enforces the readOnly flags defined in the JSON schemas.

### **6.3 Performance Optimization: Web Workers**

Since the Validation Engine (Layer 3\) performs complex calculations (Standard Deviation, pixel collision detection) on potentially large datasets (thousands of frames), running this on the main thread could block the UI.

* **Solution:** The Validation Logic runs in a **Web Worker**. The main thread sends the ExecutionMapping JSON to the worker; the worker computes the ValidationSignals and sends back the result. This ensures the UI remains buttery smooth (60fps) even during complex validation.43

### **6.4 The Single Source of Truth**

The entire project is serialized into a single JSON structure.

JSON

// project\_container.json  
{  
  "meta": {  
    "version": "2.0",  
    "created\_at": "2026-01-16T10:00:00Z"  
  },  
  "layers": {  
    "blueprint": {... },       // LOCKED  
    "execution": {... },       // MUTABLE  
    "validation": {... },      // COMPUTED  
    "outcome": {... }          // APPEND ONLY  
  }  
}

## **7\. Conclusion**

The Phase-2 Information Architecture successfully transforms Resonance from a passive planner into a rigorous, feedback-driven system. By strictly defining the four layers—**Blueprint, Execution, Validation, Outcome**—and enforcing interactions between them via a local-first, immutable state machine, we create a tool that does not merely suggest better videos but structurally enforces them.

This architecture respects the constraints of "No AI opinions" and "No databases" while delivering a professional-grade validation engine rooted in the physics of video platforms and the psychology of cognitive load. It is a system built for trust, precision, and outcome-driven iteration.

#### **Works cited**

1. Local-First Architecture Series III: Building the Local Database Layer \- Welcome, Developer, accessed on January 16, 2026, [https://www.welcomedeveloper.com/posts/local-first-architecture-3-database-layer/](https://www.welcomedeveloper.com/posts/local-first-architecture-3-database-layer/)  
2. Local-first software: You own your data, in spite of the cloud \- Ink & Switch, accessed on January 16, 2026, [https://www.inkandswitch.com/essay/local-first/](https://www.inkandswitch.com/essay/local-first/)  
3. How to use the BPM Tempo to loop and extend Music for Videos \- Jan Baumann, accessed on January 16, 2026, [https://www.baumannmusic.com/2019/how-to-use-the-bpm-tempo-to-loop-and-extend-music-for-videos/](https://www.baumannmusic.com/2019/how-to-use-the-bpm-tempo-to-loop-and-extend-music-for-videos/)  
4. Cognitive Load Essentials for Effective Instructional Videos \- Teaching Resources, accessed on January 16, 2026, [https://teaching-resources.delta.ncsu.edu/applying-cognitive-load-theory-to-multimedia-in-your-class/](https://teaching-resources.delta.ncsu.edu/applying-cognitive-load-theory-to-multimedia-in-your-class/)  
5. React 19 useReducer Deep Dive — From Basics to Complex State Patterns, accessed on January 16, 2026, [https://dev.to/a1guy/react-19-usereducer-deep-dive-from-basics-to-complex-state-patterns-3fpi](https://dev.to/a1guy/react-19-usereducer-deep-dive-from-basics-to-complex-state-patterns-3fpi)  
6. A guide to the React useReducer Hook \- LogRocket Blog, accessed on January 16, 2026, [https://blog.logrocket.com/react-usereducer-hook-ultimate-guide/](https://blog.logrocket.com/react-usereducer-hook-ultimate-guide/)  
7. Simplify immutable data structures in useReducer with Immer \- Prateek Surana, accessed on January 16, 2026, [https://prateeksurana.me/blog/simplify-immutable-data-structures-in-usereducer-with-immer/](https://prateeksurana.me/blog/simplify-immutable-data-structures-in-usereducer-with-immer/)  
8. Writing Reducers with Immer \- Redux Toolkit \- JS.ORG, accessed on January 16, 2026, [https://redux-toolkit.js.org/usage/immer-reducers](https://redux-toolkit.js.org/usage/immer-reducers)  
9. State in React is Immutable, accessed on January 16, 2026, [https://reacttraining.com/blog/state-in-react-is-immutable](https://reacttraining.com/blog/state-in-react-is-immutable)  
10. Local copy of React prop is read-only \- javascript \- Stack Overflow, accessed on January 16, 2026, [https://stackoverflow.com/questions/41582357/local-copy-of-react-prop-is-read-only](https://stackoverflow.com/questions/41582357/local-copy-of-react-prop-is-read-only)  
11. Instagram Reels Safe Zones and Tips \- Verve Creative Studio, accessed on January 16, 2026, [https://vervecreative.studio/instagram-reels-safe-zones-and-tips/](https://vervecreative.studio/instagram-reels-safe-zones-and-tips/)  
12. Instagram Safe Zone Explained: Dimensions, Best Practices & Tips \- Outfy, accessed on January 16, 2026, [https://www.outfy.com/blog/instagram-safe-zone/](https://www.outfy.com/blog/instagram-safe-zone/)  
13. Instagram Safe Zone: Guidelines, Free Template & Best Practices for Better Performance, accessed on January 16, 2026, [https://www.minta.ai/blog-post/instagram-safe-zone](https://www.minta.ai/blog-post/instagram-safe-zone)  
14. Video Length Sweet Spots: Tiktok, Reels & Shorts (2025), accessed on January 16, 2026, [https://www.shortimize.com/blog/video-length-sweet-spots-tiktok-reels-shorts](https://www.shortimize.com/blog/video-length-sweet-spots-tiktok-reels-shorts)  
15. What are the "Safe Zones" for TikToks and Instagram Reels? \- Ignite Social Media, accessed on January 16, 2026, [https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/](https://www.ignitesocialmedia.com/content-creation/what-are-the-safe-zones-for-tiktoks-and-instagram-reels/)  
16. YouTube Shorts Statistics 2026: The Complete Data Report, accessed on January 16, 2026, [https://www.loopexdigital.com/blog/youtube-shorts-statistics](https://www.loopexdigital.com/blog/youtube-shorts-statistics)  
17. A Media Type for Describing JSON Documents \- JSON Schema, accessed on January 16, 2026, [https://json-schema.org/draft/2020-12/json-schema-core](https://json-schema.org/draft/2020-12/json-schema-core)  
18. Looking for a way to easily calculate BPM based on amount of measures I want within a certain time : r/musictheory \- Reddit, accessed on January 16, 2026, [https://www.reddit.com/r/musictheory/comments/luj302/looking\_for\_a\_way\_to\_easily\_calculate\_bpm\_based/](https://www.reddit.com/r/musictheory/comments/luj302/looking_for_a_way_to_easily_calculate_bpm_based/)  
19. BPM to FPS Calculator \- Silverman Sound Studios, accessed on January 16, 2026, [https://www.silvermansound.com/bpm-to-fps-calculator](https://www.silvermansound.com/bpm-to-fps-calculator)  
20. The psychology of pacing in video edits, how do you approach it? \- Reddit, accessed on January 16, 2026, [https://www.reddit.com/r/videography/comments/1q6h6as/the\_psychology\_of\_pacing\_in\_video\_edits\_how\_do/](https://www.reddit.com/r/videography/comments/1q6h6as/the_psychology_of_pacing_in_video_edits_how_do/)  
21. The Psychology Behind Great Video Editing Choices \- Spiel Creative, accessed on January 16, 2026, [https://www.spielcreative.com/blog/great-video-editing-choices/](https://www.spielcreative.com/blog/great-video-editing-choices/)  
22. (PDF) Video Shot Boundary Detection Algorithm \- ResearchGate, accessed on January 16, 2026, [https://www.researchgate.net/publication/221551920\_Video\_Shot\_Boundary\_Detection\_Algorithm](https://www.researchgate.net/publication/221551920_Video_Shot_Boundary_Detection_Algorithm)  
23. Editing: It's the Pace, Ace\! \- Videomaker, accessed on January 16, 2026, [https://www.videomaker.com/article/9848-editing-its-the-pace-ace/](https://www.videomaker.com/article/9848-editing-its-the-pace-ace/)  
24. Average shot length in modern movies is around 2.5 seconds : r/StableDiffusion \- Reddit, accessed on January 16, 2026, [https://www.reddit.com/r/StableDiffusion/comments/1m2dqjn/average\_shot\_length\_in\_modern\_movies\_is\_around\_25/](https://www.reddit.com/r/StableDiffusion/comments/1m2dqjn/average_shot_length_in_modern_movies_is_around_25/)  
25. FILM DIRECTORS and their Average Shot Length (ASL) : r/Filmmakers \- Reddit, accessed on January 16, 2026, [https://www.reddit.com/r/Filmmakers/comments/1p2ik4y/film\_directors\_and\_their\_average\_shot\_length\_asl/](https://www.reddit.com/r/Filmmakers/comments/1p2ik4y/film_directors_and_their_average_shot_length_asl/)  
26. TikTok Hook Formulas That Drive 3-Second Holds \- OpusClip Blog, accessed on January 16, 2026, [https://www.opus.pro/blog/tiktok-hook-formulas](https://www.opus.pro/blog/tiktok-hook-formulas)  
27. Master Pacing in Video Editing for Maximum Story Impact \- Inside The Edit, accessed on January 16, 2026, [https://www.insidetheedit.com/blog/pacing-in-video-editing](https://www.insidetheedit.com/blog/pacing-in-video-editing)  
28. Cognitive Load and Cognitive Demand: How the Brain Makes Design Decisions \- Attention Insight, accessed on January 16, 2026, [https://attentioninsight.com/cognitive-load-and-cognitive-demand/](https://attentioninsight.com/cognitive-load-and-cognitive-demand/)  
29. Motion microscopy for visualizing and quantifying small motions \- PNAS, accessed on January 16, 2026, [https://www.pnas.org/doi/10.1073/pnas.1703715114](https://www.pnas.org/doi/10.1073/pnas.1703715114)  
30. Motion Estimation \- AKOOL, accessed on January 16, 2026, [https://akool.com/knowledge-base-article/motion-estimation](https://akool.com/knowledge-base-article/motion-estimation)  
31. Schema Proposal and Development Workflow \- OpenTimelineIO \- Read the Docs, accessed on January 16, 2026, [https://opentimelineio.readthedocs.io/en/latest/tutorials/developing-a-new-schema.html](https://opentimelineio.readthedocs.io/en/latest/tutorials/developing-a-new-schema.html)  
32. OpenTimelineIO/docs/tutorials/write-an-adapter.md at main \- GitHub, accessed on January 16, 2026, [https://github.com/PixarAnimationStudios/OpenTimelineIO/blob/master/docs/tutorials/write-an-adapter.md](https://github.com/PixarAnimationStudios/OpenTimelineIO/blob/master/docs/tutorials/write-an-adapter.md)  
33. File Format Specification — OpenTimelineIO 0.13.0 documentation \- Read the Docs, accessed on January 16, 2026, [https://opentimelineio.readthedocs.io/en/v0.13/tutorials/otio-file-format-specification.html](https://opentimelineio.readthedocs.io/en/v0.13/tutorials/otio-file-format-specification.html)  
34. Limiting Generation Using Validation Rules \- Idomoo Academy, accessed on January 16, 2026, [https://academy.idomoo.com/support/solutions/articles/4000165011-limiting-generation-using-validation-rules](https://academy.idomoo.com/support/solutions/articles/4000165011-limiting-generation-using-validation-rules)  
35. Short Form Video Statistics 2025: 97+ Stats & Insights \[Expert Analysis\] \- Marketing LTB, accessed on January 16, 2026, [https://marketingltb.com/blog/statistics/short-form-video-statistics/](https://marketingltb.com/blog/statistics/short-form-video-statistics/)  
36. The Economics of Editing: Why Repetition Kills Impact \- Inside The Edit, accessed on January 16, 2026, [https://www.insidetheedit.com/blog/why-repetition-in-editing-kills-impact](https://www.insidetheedit.com/blog/why-repetition-in-editing-kills-impact)  
37. “One Face, Many Roles”: The Role of Cognitive Load and Authenticity in Driving Short-Form Video Ads \- MDPI, accessed on January 16, 2026, [https://www.mdpi.com/0718-1876/20/4/272](https://www.mdpi.com/0718-1876/20/4/272)  
38. Video metrics: complete guide to measuring video performance \- Socialinsider, accessed on January 16, 2026, [https://www.socialinsider.io/blog/video-metrics/](https://www.socialinsider.io/blog/video-metrics/)  
39. React useReducer Hook \- The Basics \- Refine, accessed on January 16, 2026, [https://refine.dev/blog/react-usereducer/](https://refine.dev/blog/react-usereducer/)  
40. createSlice \- Redux Toolkit, accessed on January 16, 2026, [https://redux-toolkit.js.org/api/createSlice](https://redux-toolkit.js.org/api/createSlice)  
41. LocalStorage vs IndexedDB: JavaScript Guide (Storage, Limits & Best Practices), accessed on January 16, 2026, [https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5](https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5)  
42. LocalStorage vs IndexedDB: Choosing the Right Solution for Your Web Application, accessed on January 16, 2026, [https://shiftasia.com/community/localstorage-vs-indexeddb-choosing-the-right-solution-for-your-web-application/](https://shiftasia.com/community/localstorage-vs-indexeddb-choosing-the-right-solution-for-your-web-application/)  
43. The React Hook That Lets You Update State Without Blocking the UI | by Skanda Aryal, accessed on January 16, 2026, [https://aryalskanda1.medium.com/the-react-hook-that-lets-you-update-state-without-blocking-the-ui-eaabac1f68d6](https://aryalskanda1.medium.com/the-react-hook-that-lets-you-update-state-without-blocking-the-ui-eaabac1f68d6)