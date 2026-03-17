# \## Asset Specification Document



\*\*Character\*\*: Zero Two (inspired variant)

\*\*Output\*\*: Production-ready layered assets for interactive 2D avatar



\---



\## 1. Canvas and Resolution Standards



\*\*Base canvas\*\*



\* Size: 2048 × 4096 px

\* Orientation: Vertical

\* Background: Transparent



\*\*Character placement\*\*



\* Center aligned horizontally

\* Feet near bottom margin, \~100 px padding

\* Head top margin \~150 px



\*\*Scaling rule\*\*



\* All assets must align perfectly when stacked at 100% scale

\* No resizing at runtime



\---



\## 2. Global Naming Convention



Use strict naming. No variation.



\*\*Format\*\*



```

\[category]\_\[side]\_\[state]\_\[index].png

```



\*\*Examples\*\*



\* eye\_left\_open\_01.png

\* mouth\_smile\_01.png

\* hair\_front\_base\_01.png



\*\*Rules\*\*



\* Lowercase only

\* Underscore separator

\* No spaces

\* Version index always included



\---



\## 3. Folder Structure



```

/assets

&#x20; /head

&#x20; /eyes

&#x20; /eyelids

&#x20; /pupils

&#x20; /eyebrows

&#x20; /mouth

&#x20; /hair

&#x20; /horns

&#x20; /body

&#x20; /arms

&#x20; /legs

&#x20; /overlays

```



\---



\## 4. Z-Index Layer Order (Render Order)



From back to front:



1\. hair\_back

2\. body\_base

3\. legs

4\. arms\_back

5\. torso\_details

6\. neck

7\. face\_base

8\. eyes

9\. pupils

10\. eyelids

11\. eyebrows

12\. mouth

13\. hair\_front

14\. horns

15\. overlays



\---



\## 5. Head Asset Specifications



\### Face Base



\* File: `head\_base\_01.png`

\* Size: \~900 × 1100 px

\* Position anchor: center of canvas



\---



\### Eyes



\*\*Files\*\*



\* `eye\_left\_base\_01.png`

\* `eye\_right\_base\_01.png`



\*\*Size\*\*



\* \~220 × 120 px each



\*\*Placement\*\*



\* Centered horizontally on face

\* Vertical position: upper third of face



\---



\### Pupils



\*\*Files\*\*



\* `pupil\_left\_01.png`

\* `pupil\_right\_01.png`



\*\*Size\*\*



\* \~60 × 60 px



\*\*Constraints\*\*



\* Must stay within eye boundary

\* Transparent padding required



\---



\### Eyelids



\*\*Files\*\*



\* `eyelid\_upper\_left\_01.png`

\* `eyelid\_upper\_right\_01.png`

\* `eyelid\_lower\_left\_01.png`

\* `eyelid\_lower\_right\_01.png`



\*\*Size\*\*



\* Same width as eye



\*\*States\*\*



\* open

\* half

\* closed



Example:



\* eyelid\_upper\_left\_closed\_01.png



\---



\### Eyebrows



\*\*Files\*\*



\* `eyebrow\_left\_neutral\_01.png`

\* `eyebrow\_left\_angry\_01.png`

\* `eyebrow\_left\_happy\_01.png`

\* Repeat for right



\*\*Size\*\*



\* \~180 × 60 px



\---



\### Mouth



\*\*Files\*\*



\* `mouth\_neutral\_01.png`

\* `mouth\_smile\_01.png`

\* `mouth\_annoyed\_01.png`



\*\*Size\*\*



\* \~180 × 100 px



\*\*Placement\*\*



\* Lower third of face



\---



\## 6. Hair Asset Specifications



\### Back Hair



\* File: `hair\_back\_base\_01.png`

\* Size: \~1400 × 2000 px



\---



\### Front Hair



\* File: `hair\_front\_base\_01.png`

\* Size: \~1200 × 1400 px



\---



\### Side Strands



\* `hair\_side\_left\_01.png`

\* `hair\_side\_right\_01.png`



\*\*Size\*\*



\* \~300 × 900 px



\---



\## 7. Horns



\*\*Files\*\*



\* `horn\_left\_01.png`

\* `horn\_right\_01.png`



\*\*Size\*\*



\* \~120 × 180 px



\*\*Placement\*\*



\* Above forehead

\* Symmetrical alignment



\---



\## 8. Body Asset Specifications



\### Torso Base



\* `body\_torso\_base\_01.png`

\* Size: \~1000 × 1600 px



\---



\### Neck



\* `body\_neck\_01.png`

\* Size: \~200 × 300 px



\---



\### Suit Details Overlay



\* `body\_overlay\_details\_01.png`

\* Same size as torso



\---



\## 9. Arms



\*\*Files\*\*



\* `arm\_left\_base\_01.png`

\* `arm\_right\_base\_01.png`



\*\*Size\*\*



\* \~300 × 1400 px



\*\*Optional split\*\*



\* upper\_arm

\* lower\_arm

\* hand



\---



\## 10. Legs



\*\*Files\*\*



\* `leg\_left\_base\_01.png`

\* `leg\_right\_base\_01.png`



\*\*Size\*\*



\* \~400 × 1800 px



\---



\## 11. Alignment Rules



\*\*Critical\*\*



\* All assets must share same canvas origin

\* No cropping based alignment



\*\*Anchor point\*\*



\* Center of full canvas

\* Use consistent export coordinates



\*\*Padding\*\*



\* Maintain transparent padding to avoid clipping



\---



\## 12. Animation Constraints (for coder)



\*\*Pupil movement\*\*



\* Max offset: ±20 px X, ±15 px Y



\*\*Blink\*\*



\* Use eyelid states:



&#x20; \* open → half → closed → half → open



\*\*Head movement\*\*



\* Max rotation simulation: ±5 degrees equivalent



\*\*Idle vertical shift\*\*



\* ±10 px



\---



\## 13. File Format Standards



\* Format: PNG

\* Background: transparent

\* Color: sRGB

\* Bit depth: 8-bit minimum



\---



\## 14. Performance Constraints



\* Total asset count under 80 files

\* Individual file size under 500 KB

\* Total bundle under 20 MB



\---



\## 15. Validation Checklist



Before handoff:



\* All files follow naming convention

\* All layers align perfectly in stack test

\* No visible seams between parts

\* Expressions render correctly

\* No clipping during movement



\---



\## 16. Optional Rigging Upgrade Path



If upgrading to Live2D Cubism:



\* Convert each part into deformable mesh

\* Add parameters:



&#x20; \* eye\_x

&#x20; \* eye\_y

&#x20; \* blink

&#x20; \* mouth\_form

&#x20; \* head\_angle



\---





