# \## Character Design Specification



\*\*Reference\*\*: Zero Two

\*\*Purpose\*\*: Full-body 2D interactive avatar, anime style, “inspired by” not identical



\---



\## 1. Overall Proportions



\* Height ratio: \~7 to 7.5 heads tall

\* Head slightly larger than realistic human ratio to maintain anime style

\* Slim, athletic build

\* Long limbs, especially legs

\* Narrow waist, balanced shoulder width



\*\*Posture (default idle)\*\*



\* Relaxed stance

\* Slight weight shift to one leg

\* Subtle S-curve in body

\* Arms relaxed at sides or slightly bent



\---



\## 2. Head and Face



\*\*Shape\*\*



\* Oval face

\* Tapered chin

\* Smooth jawline



\*\*Skin tone\*\*



\* Pale, smooth, uniform



\*\*Eyes\*\*



\* Large, horizontally wide

\* Slight upward tilt at outer corners

\* Iris color: teal with gradient toward lighter center

\* Dark pupil, high contrast



\*\*Eyelashes\*\*



\* Upper lashes thicker and darker

\* Lower lashes minimal



\*\*Eyebrows\*\*



\* Thin, slightly arched

\* Positioned close to eyes for expressive range



\*\*Nose\*\*



\* Minimal detail

\* Small line or dot



\*\*Mouth\*\*



\* Small and centered

\* Neutral default slight line

\* Alternate shapes for smile and annoyed



\---



\## 3. Hair



\*\*Color\*\*



\* Light pink base

\* Slight tonal variation for depth



\*\*Structure\*\*



\* Long, flowing past shoulders

\* Layered cut

\* Slight outward flick at ends



\*\*Front\*\*



\* Framing strands on both sides of face

\* Slight asymmetry for natural look



\*\*Back\*\*



\* Volume maintained, not flat

\* Extends to upper back



\*\*Movement\*\*



\* Very subtle sway during idle

\* Small vertical oscillation



\---



\## 4. Horns



\*\*Form\*\*



\* Two small horns

\* Smooth, slightly curved



\*\*Color\*\*



\* Deep red



\*\*Placement\*\*



\* Symmetrical, emerging from upper forehead area



\*\*Orientation\*\*



\* Angled slightly outward



\---



\## 5. Neck and Upper Body



\*\*Neck\*\*



\* Slim, slightly elongated



\*\*Shoulders\*\*



\* Narrow to medium width

\* Soft contours



\*\*Torso\*\*



\* Defined but not muscular

\* Smooth transitions between chest, waist, and hips



\---



\## 6. Outfit (Pilot Suit Inspired)



\*\*Base concept\*\*



\* Form-fitting bodysuit



\*\*Primary color\*\*



\* Red



\*\*Secondary accents\*\*



\* White and dark gray



\---



\### Upper Torso



\*\*Chest area\*\*



\* Structured paneling

\* White accent shapes forming geometric patterns



\*\*Collar\*\*



\* High collar, snug around neck



\*\*Material\*\*



\* Smooth, slightly reflective finish



\---



\### Arms



\*\*Sleeves\*\*



\* Full-length, tight fit



\*\*Details\*\*



\* White striping or panel lines along arms



\*\*Gloves\*\*



\* Integrated into suit or separate layer

\* Same red base with accent details



\---



\### Waist and Midsection



\*\*Waist\*\*



\* Narrow, clearly defined



\*\*Paneling\*\*



\* White or darker segments to break solid color

\* Adds visual structure



\---



\### Lower Body



\*\*Hips\*\*



\* Slightly wider than waist

\* Smooth transition



\*\*Legs\*\*



\* Long and slender



\*\*Suit continuation\*\*



\* Same red material continues seamlessly



\*\*Thigh details\*\*



\* Subtle panel lines or accents



\---



\### Feet / Footwear



\*\*Boots\*\*



\* Integrated into suit

\* Slightly thicker sole



\*\*Design\*\*



\* Minimalistic

\* Matching color scheme



\---



\## 7. Layering Structure for Implementation



\*\*Head\*\*



\* face\_base

\* eyes

\* pupils

\* eyelids

\* eyebrows

\* mouth



\*\*Hair\*\*



\* hair\_back

\* hair\_front

\* side\_strands



\*\*Accessories\*\*



\* horns



\*\*Torso\*\*



\* upper\_body\_base

\* chest\_details



\*\*Arms\*\*



\* left\_arm

\* right\_arm

\* hands



\*\*Lower body\*\*



\* hips

\* left\_leg

\* right\_leg



\*\*Overlay\*\*



\* suit\_details\_layer



\---



\## 8. Movement and Animation Constraints



\*\*Head\*\*



\* Slight tilt left and right

\* Minimal vertical movement



\*\*Eyes\*\*



\* Track cursor

\* Movement limited to natural radius



\*\*Blinking\*\*



\* Full eyelid closure

\* Smooth transition



\*\*Body idle\*\*



\* Subtle vertical motion using sine wave

\* Very small amplitude



\*\*Hair\*\*



\* Slight delay relative to head movement

\* Minimal oscillation



\*\*Arms and legs\*\*



\* Static in MVP

\* No complex joint animation



\---



\## 9. Expression Set



\*\*Neutral\*\*



\* Relaxed eyes

\* Straight mouth



\*\*Happy\*\*



\* Slight upward mouth curve

\* Softer eyes



\*\*Annoyed\*\*



\* Eyebrows angled downward

\* Slight frown



\---



\## 10. Color Palette (Guideline)



\* Hair: light pink

\* Horns: deep red

\* Suit: saturated red

\* Accents: white

\* Eyes: teal/cyan

\* Skin: pale



Use flat colors with minimal gradients. Avoid heavy shading.



\---



\## 11. Interaction Behavior Mapping



\*\*Mouse move\*\*



\* Eyes follow

\* Slight head adjustment



\*\*Click\*\*



\* Cycle expressions



\*\*Idle\*\*



\* Blink

\* Subtle body sway

\* Hair micro movement



\---



\## 12. Design Constraints



\* Avoid hyper-realism

\* Keep shapes clean and readable

\* Maintain symmetry except for natural hair variation

\* Keep all movements subtle



\---



\## 13. Legal Constraint



\* Do not replicate exact copyrighted design

\* Slightly modify:



&#x20; \* hair styling

&#x20; \* outfit patterns

&#x20; \* proportions



Goal is recognizability without duplication



\---



\## 14. Completion Criteria



\* Full body renders cleanly in layered form

\* All parts align correctly

\* Expressions are readable

\* Character maintains visual consistency during interaction



\---





