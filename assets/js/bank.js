/* ==========================================================================
   COGNIFY · bank.js
   Curated static question pools for conceptual topics where procedural
   generation does not apply (awareness, language, theory).
   Format: [ questionText, [opt0, opt1, opt2, opt3], correctIndex, solution, difficulty? ]
   difficulty: 1 = easy, 2 = moderate, 3 = advanced (default 2)
   ========================================================================== */
(function (w) {
  'use strict';
  var C = (w.COGNIFY = w.COGNIFY || {});

  C.BANK = {

  /* =======================================================================
     REASONING
     ======================================================================= */
  analogy: [
    ['Doctor : Hospital :: Teacher : ?', ['School', 'Student', 'Book', 'Lesson'], 0, 'A doctor works in a hospital; a teacher works in a school — worker to workplace.', 1],
    ['Pen : Write :: Knife : ?', ['Cut', 'Sharp', 'Metal', 'Kitchen'], 0, 'A pen is used to write; a knife is used to cut — tool to function.', 1],
    ['Oxygen : Burn :: Carbon dioxide : ?', ['Extinguish', 'Breathe', 'Explode', 'Freeze'], 0, 'Oxygen supports burning; carbon dioxide extinguishes fire — opposite function.', 2],
    ['Cobbler : Leather :: Carpenter : ?', ['Wood', 'Hammer', 'Furniture', 'Nail'], 0, 'Each works with the raw material named: cobbler with leather, carpenter with wood.', 1],
    ['Hunger : Food :: Thirst : ?', ['Water', 'Drink', 'Glass', 'Dry'], 0, 'Hunger is satisfied by food; thirst by water — need to remedy.', 1],
    ['Ornithology : Birds :: Entomology : ?', ['Insects', 'Fossils', 'Plants', 'Reptiles'], 0, 'Entomology is the study of insects.', 2],
    ['Clock : Time :: Thermometer : ?', ['Temperature', 'Mercury', 'Heat', 'Weather'], 0, 'Each instrument measures the quantity named.', 1],
    ['Flock : Sheep :: Shoal : ?', ['Fish', 'Lions', 'Crows', 'Ants'], 0, 'A shoal is a collective noun for fish.', 2],
    ['Triangle : Three :: Octagon : ?', ['Eight', 'Six', 'Seven', 'Ten'], 0, 'An octagon has eight sides.', 1],
    ['Author : Book :: Composer : ?', ['Symphony', 'Piano', 'Orchestra', 'Audience'], 0, 'A composer creates a symphony as an author creates a book.', 2],
    ['Dermatology : Skin :: Nephrology : ?', ['Kidney', 'Liver', 'Heart', 'Lung'], 0, 'Nephrology deals with kidneys.', 2],
    ['Seismograph : Earthquake :: Barometer : ?', ['Atmospheric pressure', 'Wind speed', 'Humidity', 'Rainfall'], 0, 'A barometer measures atmospheric pressure.', 2]
  ],

  oddone: [
    ['Find the odd one out.', ['Mango', 'Apple', 'Potato', 'Banana'], 2, 'Potato is a vegetable (tuber); the rest are fruits.', 1],
    ['Find the odd one out.', ['Rupee', 'Dollar', 'Yen', 'Bank'], 3, 'Bank is an institution; the rest are currencies.', 1],
    ['Find the odd one out.', ['121', '144', '169', '150'], 3, '121=11², 144=12², 169=13². 150 is not a perfect square.', 1],
    ['Find the odd one out.', ['Copper', 'Iron', 'Mercury', 'Zinc'], 2, 'Mercury is liquid at room temperature; the others are solid metals.', 2],
    ['Find the odd one out.', ['Square', 'Circle', 'Rectangle', 'Rhombus'], 1, 'A circle has no straight sides or vertices.', 1],
    ['Find the odd one out.', ['23', '29', '31', '33'], 3, '33 = 3 × 11 is composite; the rest are prime.', 1],
    ['Find the odd one out.', ['Ganga', 'Yamuna', 'Godavari', 'Chilika'], 3, 'Chilika is a lake; the rest are rivers.', 2],
    ['Find the odd one out.', ['Eye', 'Ear', 'Nose', 'Hand'], 3, 'Hand is not a sense organ in the classical five; the rest are.', 1],
    ['Find the odd one out.', ['RAM', 'ROM', 'Cache', 'Printer'], 3, 'Printer is an output device; the rest are memory types.', 1],
    ['Find the odd one out.', ['Kilogram', 'Metre', 'Second', 'Litre'], 3, 'Litre is a derived unit; kg, m and s are SI base units.', 2]
  ],

  syllogism: [
    ['Statements: All pens are books. All books are tables.\nConclusions: I. All pens are tables. II. Some tables are pens.', ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither follows'], 0, 'Pens ⊆ books ⊆ tables, so all pens are tables, and its converse "some tables are pens" also holds.', 2],
    ['Statements: Some cats are dogs. All dogs are animals.\nConclusions: I. Some cats are animals. II. All animals are cats.', ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'], 0, 'The cats that are dogs must be animals, so I follows. II is an unjustified universal.', 2],
    ['Statements: No bird is a fish. All fish are swimmers.\nConclusions: I. No bird is a swimmer. II. Some swimmers are not birds.', ['Only II follows', 'Only I follows', 'Both follow', 'Neither follows'], 0, 'Fish are swimmers and no fish is a bird, so some swimmers (the fish) are not birds. I overreaches — other swimmers could be birds.', 3],
    ['Statements: All roses are flowers. Some flowers fade quickly.\nConclusions: I. Some roses fade quickly. II. All flowers are roses.', ['Neither I nor II follows', 'Only I follows', 'Only II follows', 'Both follow'], 0, 'The fading flowers need not be roses, and the converse of a universal does not follow.', 2],
    ['Statements: All engineers are graduates. Some graduates are employed.\nConclusions: I. Some engineers are employed. II. Some employed are graduates.', ['Only II follows', 'Only I follows', 'Both follow', 'Neither follows'], 0, 'II is the converse of the second premise and follows. I does not — the employed graduates may not be engineers.', 2],
    ['Statements: Some books are pens. No pen is a pencil.\nConclusions: I. Some books are not pencils. II. No book is a pencil.', ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'], 0, 'The books that are pens cannot be pencils, so I follows. II is too strong.', 3],
    ['Statements: All squares are rectangles. All rectangles are quadrilaterals.\nConclusions: I. All squares are quadrilaterals. II. Some quadrilaterals are squares.', ['Both I and II follow', 'Only I follows', 'Only II follows', 'Neither follows'], 0, 'Chained universals give I, and I implies II by conversion.', 1],
    ['Statements: No student is lazy. Some lazy people are rich.\nConclusions: I. Some rich people are not students. II. All rich are lazy.', ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'], 0, 'The lazy rich cannot be students, so I follows. II is unsupported.', 2]
  ],

  seating: [
    ['Six friends A, B, C, D, E, F sit in a row facing north. C is at an extreme end. B is second to the left of C. A is immediately right of B. Which is true?', ['A is third from one end', 'A is at an end', 'B is at an end', 'C is in the middle'], 0, 'With C at the right end, B is at position 4 and A at position 5 of 6 — A is third from the right end.', 2],
    ['Five people P, Q, R, S, T sit in a circle facing the centre. Q is to the immediate right of P, R is to the immediate left of P. Who sits opposite-most to P in the remaining pair?', ['S or T', 'Q', 'R', 'Cannot be determined at all'], 0, 'P, Q and R are fixed; only S and T remain for the two seats farthest from P.', 2],
    ['A is 3 ranks above B. B is 5 ranks above C. If C is 20th, what is A’s rank?', ['12th', '13th', '14th', '15th'], 0, 'C = 20, B = 20 − 5 = 15, A = 15 − 3 = 12.', 1],
    ['Eight people sit around a circular table facing the centre. If M is third to the left of N, how many people sit between them going clockwise from N to M?', ['Two', 'Three', 'Four', 'Five'], 0, 'Third to the left means two people sit between them on that side.', 2],
    ['In a row of 40 students, Ravi is 12th from the left. What is his position from the right?', ['29th', '28th', '30th', '27th'], 0, 'Position from right = 40 − 12 + 1 = 29.', 1],
    ['Four friends sit in a row. W is not at either end. X is to the immediate left of W. Y is at the right end. Who is at the left end?', ['Z', 'X', 'W', 'Y'], 0, 'Y is rightmost, W is interior with X on its left, so the only remaining person Z takes the left end.', 2],
    ['P, Q, R, S face south in a row. R is between P and S. Q is at an extreme end and is not adjacent to R. Who is adjacent to Q?', ['P', 'R', 'S', 'None'], 0, 'The order is Q, P, R, S, so P is next to Q.', 2]
  ],

  statement_arg: [
    ['Statement: "Carry an umbrella." Which assumption is implicit?', ['It may rain', 'Umbrellas are cheap', 'It is summer', 'You own an umbrella shop'], 0, 'The advice presupposes the possibility of rain.', 1],
    ['Statement: The college has raised its fees sharply.\nConclusion: Some students may discontinue.', ['The conclusion is probable', 'The conclusion is certain', 'The conclusion is irrelevant', 'The conclusion contradicts the statement'], 0, 'A sharp fee hike makes discontinuation plausible, not certain.', 2],
    ['Statement: "Read the instructions before using the device."\nAssumption: Users can read.', ['Implicit', 'Not implicit', 'Contradictory', 'Irrelevant'], 0, 'The instruction only makes sense if the user is able to read it.', 1],
    ['Statement: Water levels in reservoirs fell 40% this year.\nCourse of action: Restrict non-essential water use.', ['Follows', 'Does not follow', 'Partially follows', 'Contradicts'], 0, 'Restricting non-essential use directly addresses the shortage.', 2],
    ['Statement: All government offices will go paperless next year.\nConclusion: Paper consumption in these offices will fall.', ['Follows', 'Does not follow', 'Cannot be determined', 'Contradicts'], 0, 'Going paperless implies reduced paper consumption.', 1],
    ['Statement: "Exercise daily to stay healthy."\nAssumption: Health can be influenced by behaviour.', ['Implicit', 'Not implicit', 'Contradictory', 'Irrelevant'], 0, 'The advice is meaningless unless behaviour affects health.', 2]
  ],

  puzzle_misc: [
    ['If in a certain code FRIEND is written as GSJFOE, how is CANDLE written?', ['DBOEMF', 'DBPEMF', 'DBOFMF', 'EBOEMF'], 0, 'Each letter moves one step forward: C→D, A→B, N→O, D→E, L→M, E→F.', 1],
    ['A cube is painted on all faces and cut into 27 smaller cubes. How many have exactly two faces painted?', ['12', '8', '6', '24'], 0, 'Edge cubes (excluding corners) have two painted faces: 12 edges × 1 = 12.', 2],
    ['How many triangles are there in a triangle divided by its three medians?', ['6', '4', '8', '3'], 0, 'The three medians divide a triangle into 6 smaller triangles of equal area.', 2],
    ['A man has ₹100 in ₹5 and ₹10 notes, 12 notes in all. How many ₹10 notes?', ['8', '6', '4', '10'], 0, '5x + 10y = 100 and x + y = 12 → 5(12−y) + 10y = 100 → 60 + 5y = 100 → y = 8.', 2],
    ['If 5 machines make 5 items in 5 minutes, how long do 100 machines take to make 100 items?', ['5 minutes', '100 minutes', '20 minutes', '1 minute'], 0, 'Each machine makes one item in 5 minutes, so 100 machines make 100 items in the same 5 minutes.', 2],
    ['Pointing to a photograph, a man said, "She is the daughter of my grandfather’s only son." How is she related to him?', ['Sister', 'Daughter', 'Niece', 'Cousin'], 0, 'Grandfather’s only son is his own father, so she is his sister.', 2],
    ['Which number replaces the question mark? 7, 14, 28, 56, ?', ['112', '96', '84', '120'], 0, 'Each term doubles: 56 × 2 = 112.', 1],
    ['A clock is set right at 8 a.m. and gains 2 minutes per hour. What will it show at the true time of 8 p.m.?', ['8:24 p.m.', '8:20 p.m.', '8:12 p.m.', '8:30 p.m.'], 0, '12 hours elapse, gaining 2 × 12 = 24 minutes.', 2]
  ],

  nonverbal: [
    ['A figure is rotated 90° clockwise, then reflected in a vertical mirror. This is equivalent to a single:', ['Reflection in a diagonal line', 'Rotation of 180°', 'Rotation of 270°', 'Translation'], 0, 'A rotation followed by a reflection is always a single reflection, here across a diagonal axis.', 3],
    ['How many squares (of all sizes) are in a 3 × 3 grid of unit squares?', ['14', '9', '10', '13'], 0, '9 (1×1) + 4 (2×2) + 1 (3×3) = 14.', 2],
    ['A dice shows 1 opposite 6, 2 opposite 5 and 3 opposite 4. If 3 is on top and 1 faces you, what is at the bottom?', ['4', '6', '2', '5'], 0, 'Opposite of 3 is 4, so 4 is at the bottom.', 1],
    ['A paper folded twice and punched once at the centre will show how many holes when unfolded?', ['4', '2', '8', '1'], 0, 'Each fold doubles the holes: 1 → 2 → 4.', 2],
    ['Which is the mirror image of the word "MOM" in a vertical mirror?', ['MOM', 'WOW', 'MOW', 'NON'], 0, 'M and O are vertically symmetric, so MOM reads the same.', 1],
    ['A cube has 6 faces. If it is cut once by a plane through its centre parallel to a face, the new cross-section is a:', ['Square', 'Triangle', 'Hexagon', 'Circle'], 0, 'A plane parallel to a face cuts a square cross-section.', 1]
  ],

  geometry_basic: [
    ['The sum of the interior angles of a triangle is:', ['180°', '360°', '90°', '270°'], 0, 'Angle-sum property of a triangle.', 1],
    ['Each interior angle of a regular hexagon measures:', ['120°', '108°', '135°', '90°'], 0, 'Interior angle = (n−2)×180/n = 4×180/6 = 120°.', 1],
    ['In a right triangle, the side opposite the right angle is called the:', ['Hypotenuse', 'Base', 'Altitude', 'Median'], 0, 'Definition of hypotenuse.', 1],
    ['Two angles are supplementary if their sum is:', ['180°', '90°', '360°', '45°'], 0, 'Supplementary angles add to 180°.', 1],
    ['The point where the three medians of a triangle meet is the:', ['Centroid', 'Incentre', 'Circumcentre', 'Orthocentre'], 0, 'Medians meet at the centroid, which divides each in a 2:1 ratio.', 1],
    ['The exterior angle of a triangle equals:', ['The sum of the two opposite interior angles', 'The adjacent interior angle', '90°', 'Half the sum of all angles'], 0, 'Exterior angle theorem.', 2],
    ['If two triangles are similar, their corresponding sides are:', ['Proportional', 'Equal', 'Perpendicular', 'Parallel'], 0, 'Similarity preserves ratios of corresponding sides.', 1],
    ['The angle in a semicircle is:', ['90°', '60°', '180°', '45°'], 0, 'Angle subtended by a diameter at the circumference is a right angle.', 1],
    ['The number of diagonals in a polygon of n sides is:', ['n(n−3)/2', 'n(n−1)/2', 'n(n−2)/2', 'n²/2'], 0, 'Each vertex joins n−3 non-adjacent vertices, counted twice.', 2],
    ['In a parallelogram, the diagonals:', ['Bisect each other', 'Are equal', 'Are perpendicular', 'Trisect each other'], 0, 'Diagonals of a parallelogram bisect each other but need not be equal.', 2],
    ['The sum of all exterior angles of any convex polygon is:', ['360°', '180°', '540°', 'Depends on n'], 0, 'Exterior angles always sum to one full turn.', 2],
    ['If the angles of a triangle are in the ratio 1 : 2 : 3, the triangle is:', ['Right-angled', 'Equilateral', 'Obtuse-angled', 'Isosceles only'], 0, 'Angles are 30°, 60°, 90°.', 2]
  ],

  /* =======================================================================
     PHYSICS / CHEMISTRY / BIOLOGY CONCEPTS
     ======================================================================= */
  phy_concepts: [
    ['The SI unit of force is:', ['Newton', 'Joule', 'Watt', 'Pascal'], 0, '1 N = 1 kg·m/s².', 1],
    ['Which quantity is a vector?', ['Velocity', 'Speed', 'Mass', 'Temperature'], 0, 'Velocity has both magnitude and direction.', 1],
    ['Newton’s first law is also known as the law of:', ['Inertia', 'Action–reaction', 'Acceleration', 'Gravitation'], 0, 'A body stays in its state of rest or uniform motion unless acted on by a net force.', 1],
    ['The work done by a force perpendicular to displacement is:', ['Zero', 'Maximum', 'Negative', 'Equal to F·s'], 0, 'W = Fs cos 90° = 0.', 1],
    ['Which of these is a scalar quantity?', ['Work', 'Momentum', 'Torque', 'Impulse'], 0, 'Work is a dot product and therefore scalar.', 2],
    ['The escape velocity from the Earth’s surface is approximately:', ['11.2 km/s', '7.9 km/s', '9.8 km/s', '3.0 km/s'], 0, 'v = √(2gR) ≈ 11.2 km/s.', 2],
    ['Sound cannot travel through:', ['Vacuum', 'Water', 'Steel', 'Air'], 0, 'Sound is a mechanical wave and needs a medium.', 1],
    ['The unit of electrical resistance is:', ['Ohm', 'Volt', 'Ampere', 'Coulomb'], 0, 'R = V/I, measured in ohms.', 1],
    ['Which mirror is used as a rear-view mirror in vehicles?', ['Convex', 'Concave', 'Plane', 'Parabolic concave'], 0, 'A convex mirror gives an erect, diminished image and a wider field of view.', 1],
    ['The phenomenon responsible for the blue colour of the sky is:', ['Scattering of light', 'Refraction', 'Total internal reflection', 'Diffraction'], 0, 'Rayleigh scattering is stronger for shorter (blue) wavelengths.', 2],
    ['The power of a lens is measured in:', ['Dioptre', 'Watt', 'Lumen', 'Candela'], 0, 'P = 1/f with f in metres; unit is dioptre.', 1],
    ['A body in uniform circular motion has:', ['Constant speed but changing velocity', 'Constant velocity', 'Zero acceleration', 'Constant acceleration vector'], 0, 'The direction of velocity changes continuously, so velocity is not constant.', 2],
    ['The first law of thermodynamics is a statement of:', ['Conservation of energy', 'Entropy increase', 'Zeroth law', 'Heat flow direction'], 0, 'ΔU = Q − W expresses energy conservation.', 2],
    ['One horsepower is approximately equal to:', ['746 W', '1000 W', '550 W', '100 W'], 0, '1 hp ≈ 746 watts.', 2],
    ['Which particle has no charge?', ['Neutron', 'Proton', 'Electron', 'Positron'], 0, 'The neutron is electrically neutral.', 1]
  ],

  chem_concepts: [
    ['The chemical formula of common salt is:', ['NaCl', 'KCl', 'CaCO₃', 'NaOH'], 0, 'Sodium chloride.', 1],
    ['The pH of a neutral solution at 25 °C is:', ['7', '0', '14', '1'], 0, 'Pure water has [H⁺] = 10⁻⁷ M.', 1],
    ['Which gas is known as laughing gas?', ['Nitrous oxide', 'Nitric oxide', 'Nitrogen dioxide', 'Ammonia'], 0, 'N₂O is nitrous oxide.', 1],
    ['The most abundant gas in the Earth’s atmosphere is:', ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], 0, 'Nitrogen is about 78% by volume.', 1],
    ['Rusting of iron is an example of:', ['Oxidation', 'Reduction', 'Neutralisation', 'Sublimation'], 0, 'Iron is oxidised to hydrated iron(III) oxide.', 1],
    ['Avogadro’s number is approximately:', ['6.022 × 10²³', '6.022 × 10²²', '3.011 × 10²³', '1.602 × 10⁻¹⁹'], 0, 'Particles per mole.', 1],
    ['Which acid is present in the stomach?', ['Hydrochloric acid', 'Sulphuric acid', 'Acetic acid', 'Citric acid'], 0, 'Gastric juice contains dilute HCl.', 1],
    ['Heavy water is:', ['D₂O', 'H₂O₂', 'H₂SO₄', 'H₂O at 4 °C'], 0, 'Deuterium oxide.', 2],
    ['The hardest naturally occurring substance is:', ['Diamond', 'Quartz', 'Corundum', 'Graphite'], 0, 'Diamond tops the Mohs scale at 10.', 1],
    ['Baking soda is chemically:', ['Sodium bicarbonate', 'Sodium carbonate', 'Calcium carbonate', 'Sodium hydroxide'], 0, 'NaHCO₃.', 1],
    ['Which of the following is a noble gas?', ['Argon', 'Nitrogen', 'Hydrogen', 'Chlorine'], 0, 'Argon belongs to group 18.', 1],
    ['The process of converting a solid directly into vapour is:', ['Sublimation', 'Evaporation', 'Condensation', 'Fusion'], 0, 'Camphor and iodine sublime.', 1]
  ],

  atomic: [
    ['The maximum number of electrons in a shell with principal quantum number n is:', ['2n²', 'n²', '2n', '4n'], 0, 'Shell capacity = 2n².', 1],
    ['Isotopes of an element differ in the number of:', ['Neutrons', 'Protons', 'Electrons', 'Orbitals'], 0, 'Same Z, different mass number.', 1],
    ['The quantum number that describes the shape of an orbital is:', ['Azimuthal (l)', 'Principal (n)', 'Magnetic (m)', 'Spin (s)'], 0, 'l determines s, p, d, f shapes.', 2],
    ['Hund’s rule states that electrons:', ['Occupy degenerate orbitals singly first', 'Pair up before occupying new orbitals', 'Always have opposite spins', 'Fill the highest energy level first'], 0, 'Maximum multiplicity minimises repulsion.', 2],
    ['The number of orbitals in the d subshell is:', ['5', '3', '7', '1'], 0, 'l = 2 gives m = −2…+2, i.e. five orbitals.', 1],
    ['Which model introduced quantised electron orbits?', ['Bohr model', 'Thomson model', 'Rutherford model', 'Dalton model'], 0, 'Bohr quantised angular momentum as nh/2π.', 2],
    ['The electronic configuration of chromium (Z = 24) is:', ['[Ar] 3d⁵ 4s¹', '[Ar] 3d⁴ 4s²', '[Ar] 3d⁶', '[Ar] 4s² 4p⁴'], 0, 'Half-filled d subshell gives extra stability.', 3],
    ['Heisenberg’s uncertainty principle relates position with:', ['Momentum', 'Energy only', 'Charge', 'Spin'], 0, 'Δx·Δp ≥ h/4π.', 2],
    ['Cathode rays consist of:', ['Electrons', 'Protons', 'Neutrons', 'Photons'], 0, 'Negatively charged electrons.', 1]
  ],

  periodic: [
    ['Across a period from left to right, atomic radius generally:', ['Decreases', 'Increases', 'Stays constant', 'First increases then decreases'], 0, 'Nuclear charge rises while the shell stays the same.', 1],
    ['The element with the highest electronegativity is:', ['Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'], 0, 'Fluorine, 3.98 on the Pauling scale.', 1],
    ['Group 1 elements are called:', ['Alkali metals', 'Alkaline earth metals', 'Halogens', 'Noble gases'], 0, 'Li, Na, K, Rb, Cs, Fr.', 1],
    ['Down a group, ionisation enthalpy generally:', ['Decreases', 'Increases', 'Remains the same', 'Doubles'], 0, 'Increasing size and shielding make electron removal easier.', 2],
    ['The modern periodic law is based on:', ['Atomic number', 'Atomic mass', 'Valency', 'Density'], 0, 'Moseley arranged elements by atomic number.', 1],
    ['Which element is a metalloid?', ['Silicon', 'Sodium', 'Sulphur', 'Selenium'], 0, 'Silicon shows properties of both metals and non-metals.', 2],
    ['The lanthanide contraction is caused by poor shielding of:', ['4f electrons', '3d electrons', '5p electrons', '6s electrons'], 0, 'f-orbitals shield poorly, so effective nuclear charge rises.', 3],
    ['Noble gases are generally inert because they have:', ['Complete octets', 'High electronegativity', 'Low atomic mass', 'Unpaired electrons'], 0, 'A full valence shell leaves no tendency to react.', 1]
  ],

  bonding: [
    ['The bond formed by sharing of electrons is:', ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], 0, 'Shared electron pairs form covalent bonds.', 1],
    ['The shape of a methane (CH₄) molecule is:', ['Tetrahedral', 'Trigonal planar', 'Linear', 'Bent'], 0, 'sp³ hybridisation with bond angles of 109.5°.', 1],
    ['The hybridisation of carbon in ethyne (C₂H₂) is:', ['sp', 'sp²', 'sp³', 'sp³d'], 0, 'A triple bond implies sp hybridisation and a linear shape.', 2],
    ['Which molecule is polar?', ['H₂O', 'CO₂', 'CH₄', 'BF₃'], 0, 'The bent shape of water gives a net dipole moment.', 2],
    ['Hydrogen bonding is strongest when hydrogen is bonded to:', ['F, O or N', 'C or S', 'Cl or Br', 'Any metal'], 0, 'High electronegativity and small size are required.', 1],
    ['In an ionic bond, electrons are:', ['Transferred', 'Shared equally', 'Delocalised', 'Paired in orbitals'], 0, 'One atom donates, the other accepts.', 1],
    ['The bond order of O₂ according to molecular orbital theory is:', ['2', '1', '3', '1.5'], 0, '(8 bonding − 4 antibonding)/2 = 2.', 3],
    ['VSEPR theory predicts molecular shape based on:', ['Repulsion between electron pairs', 'Bond energies', 'Atomic masses', 'Electronegativity only'], 0, 'Electron pairs arrange to minimise repulsion.', 2]
  ],

  organic: [
    ['The general formula of alkanes is:', ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'], 0, 'Saturated open-chain hydrocarbons.', 1],
    ['The functional group –COOH is called:', ['Carboxyl', 'Carbonyl', 'Hydroxyl', 'Amino'], 0, 'Present in carboxylic acids.', 1],
    ['Ethanol on oxidation with acidified K₂Cr₂O₇ gives:', ['Ethanoic acid', 'Methanol', 'Ethane', 'Ethene'], 0, 'Primary alcohol → aldehyde → carboxylic acid.', 2],
    ['Benzene has how many pi electrons in its ring?', ['6', '3', '12', '4'], 0, 'Three delocalised double bonds give 6 π electrons, satisfying Hückel’s 4n+2 rule.', 2],
    ['Which isomerism is shown by butane and isobutane?', ['Chain isomerism', 'Position isomerism', 'Optical isomerism', 'Geometric isomerism'], 0, 'They differ in carbon skeleton arrangement.', 2],
    ['Markovnikov’s rule governs the addition of HX to:', ['Unsymmetrical alkenes', 'Alkanes', 'Benzene', 'Alcohols'], 0, 'The hydrogen adds to the carbon with more hydrogens.', 2],
    ['The monomer of polythene is:', ['Ethene', 'Propene', 'Styrene', 'Vinyl chloride'], 0, 'Polyethylene is formed by addition polymerisation of ethene.', 1],
    ['A compound with the formula C₂H₅OH is:', ['Ethanol', 'Methanol', 'Ethanal', 'Ethanoic acid'], 0, 'Ethyl alcohol.', 1],
    ['SN1 reactions proceed fastest with:', ['Tertiary alkyl halides', 'Primary alkyl halides', 'Methyl halides', 'Alkenes'], 0, 'Tertiary carbocations are the most stable intermediates.', 3]
  ],

  inorganic: [
    ['Which metal is extracted from bauxite?', ['Aluminium', 'Iron', 'Copper', 'Zinc'], 0, 'Bauxite is hydrated aluminium oxide.', 1],
    ['Plaster of Paris is chemically:', ['CaSO₄·½H₂O', 'CaSO₄·2H₂O', 'CaCO₃', 'Ca(OH)₂'], 0, 'Calcium sulphate hemihydrate.', 2],
    ['The main constituent of natural gas is:', ['Methane', 'Ethane', 'Propane', 'Butane'], 0, 'Methane makes up around 85–90%.', 1],
    ['Which gas is used in electric bulbs to prevent filament oxidation?', ['Argon', 'Oxygen', 'Carbon dioxide', 'Hydrogen'], 0, 'An inert argon fill prevents the tungsten filament burning.', 1],
    ['The ore of iron used most widely is:', ['Haematite', 'Bauxite', 'Galena', 'Cinnabar'], 0, 'Haematite is Fe₂O₃.', 2],
    ['Bleaching powder is:', ['CaOCl₂', 'NaOCl', 'Ca(OH)₂', 'CaCl₂'], 0, 'Calcium oxychloride.', 2],
    ['Which of these causes permanent hardness of water?', ['Chlorides and sulphates of Ca and Mg', 'Bicarbonates of Ca and Mg', 'Sodium chloride', 'Dissolved CO₂'], 0, 'Permanent hardness is not removed by boiling.', 2],
    ['Stainless steel is an alloy of iron with:', ['Chromium and nickel', 'Copper and tin', 'Zinc and lead', 'Aluminium and silicon'], 0, 'Chromium gives corrosion resistance.', 1]
  ],

  bio_cell: [
    ['The powerhouse of the cell is the:', ['Mitochondrion', 'Ribosome', 'Nucleus', 'Golgi body'], 0, 'ATP is generated here by oxidative phosphorylation.', 1],
    ['Cell wall in plants is made chiefly of:', ['Cellulose', 'Chitin', 'Protein', 'Lipid'], 0, 'Plant cell walls are cellulosic.', 1],
    ['Which organelle is called the suicidal bag of the cell?', ['Lysosome', 'Vacuole', 'Plastid', 'Centrosome'], 0, 'Lysosomes contain hydrolytic enzymes.', 1],
    ['The site of protein synthesis is the:', ['Ribosome', 'Nucleolus', 'Lysosome', 'Chloroplast'], 0, 'mRNA is translated at the ribosome.', 1],
    ['Cell theory was proposed by:', ['Schleiden and Schwann', 'Watson and Crick', 'Darwin and Wallace', 'Mendel'], 0, '1838–39, later extended by Virchow.', 2],
    ['Reduction division is another name for:', ['Meiosis', 'Mitosis', 'Binary fission', 'Budding'], 0, 'Chromosome number halves in meiosis.', 1],
    ['Prokaryotic cells lack a:', ['True nucleus', 'Cell membrane', 'Ribosome', 'Cytoplasm'], 0, 'There is no nuclear membrane in prokaryotes.', 1],
    ['Chromosomes are made of:', ['DNA and protein', 'RNA only', 'Lipid and protein', 'Carbohydrate'], 0, 'Chromatin is DNA wound around histone proteins.', 1],
    ['During which phase of mitosis do chromosomes align at the equator?', ['Metaphase', 'Prophase', 'Anaphase', 'Telophase'], 0, 'The metaphase plate forms at the cell equator.', 2]
  ],

  bio_human: [
    ['The normal human body temperature is about:', ['37 °C', '35 °C', '40 °C', '32 °C'], 0, 'Equivalent to 98.6 °F.', 1],
    ['The largest organ of the human body is the:', ['Skin', 'Liver', 'Lung', 'Brain'], 0, 'Skin is the largest organ by area and mass.', 1],
    ['Insulin is secreted by the:', ['Pancreas', 'Liver', 'Thyroid', 'Adrenal gland'], 0, 'Beta cells of the islets of Langerhans.', 1],
    ['The number of chambers in the human heart is:', ['Four', 'Two', 'Three', 'Five'], 0, 'Two atria and two ventricles.', 1],
    ['Which blood group is the universal donor?', ['O negative', 'AB positive', 'A positive', 'B negative'], 0, 'O− has no A, B or Rh antigens.', 1],
    ['Haemoglobin contains which metal?', ['Iron', 'Copper', 'Magnesium', 'Zinc'], 0, 'Each haem group holds an Fe²⁺ ion.', 1],
    ['The functional unit of the kidney is the:', ['Nephron', 'Neuron', 'Alveolus', 'Villus'], 0, 'About a million nephrons per kidney filter blood.', 1],
    ['Vitamin C deficiency causes:', ['Scurvy', 'Rickets', 'Beriberi', 'Night blindness'], 0, 'Ascorbic acid deficiency weakens connective tissue.', 1],
    ['The longest bone in the human body is the:', ['Femur', 'Tibia', 'Humerus', 'Fibula'], 0, 'The thigh bone.', 1],
    ['Exchange of gases in the lungs occurs in the:', ['Alveoli', 'Bronchi', 'Trachea', 'Pleura'], 0, 'Thin alveolar walls allow diffusion.', 1],
    ['The total number of bones in an adult human body is:', ['206', '201', '212', '198'], 0, 'Infants have about 270, which fuse to 206.', 2],
    ['Which gland is known as the master gland?', ['Pituitary', 'Thyroid', 'Adrenal', 'Pineal'], 0, 'It regulates other endocrine glands.', 1]
  ],

  bio_plant: [
    ['Photosynthesis occurs in the:', ['Chloroplast', 'Mitochondrion', 'Nucleus', 'Vacuole'], 0, 'Chlorophyll in chloroplasts captures light energy.', 1],
    ['The green pigment in plants is:', ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Anthocyanin'], 0, 'Chlorophyll a and b absorb red and blue light.', 1],
    ['Water transport in plants occurs through:', ['Xylem', 'Phloem', 'Cambium', 'Cortex'], 0, 'Xylem carries water and minerals upward.', 1],
    ['Loss of water as vapour from plant leaves is called:', ['Transpiration', 'Respiration', 'Guttation', 'Translocation'], 0, 'It occurs mainly through stomata.', 1],
    ['The raw materials for photosynthesis are:', ['CO₂ and water', 'O₂ and glucose', 'N₂ and water', 'CO₂ and oxygen'], 0, '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.', 1],
    ['Root nodules of leguminous plants fix:', ['Nitrogen', 'Carbon', 'Phosphorus', 'Oxygen'], 0, 'Rhizobium bacteria fix atmospheric nitrogen.', 2],
    ['The opening on a leaf surface for gas exchange is the:', ['Stoma', 'Lenticel', 'Cuticle', 'Vein'], 0, 'Guard cells regulate stomatal aperture.', 1],
    ['Which hormone promotes cell elongation in plants?', ['Auxin', 'Abscisic acid', 'Ethylene', 'Cytokinin'], 0, 'Auxins drive phototropic bending via elongation.', 2]
  ],

  bio_genetics: [
    ['DNA was shown to have a double-helix structure by:', ['Watson and Crick', 'Mendel', 'Darwin', 'Morgan'], 0, 'Published in 1953 using Franklin’s X-ray data.', 1],
    ['Mendel’s experiments were performed on:', ['Pea plants', 'Fruit flies', 'Maize', 'Bread mould'], 0, 'Pisum sativum.', 1],
    ['The phenotypic ratio of a monohybrid cross in F₂ is:', ['3 : 1', '1 : 1', '9 : 3 : 3 : 1', '1 : 2 : 1'], 0, 'Dominant to recessive in the F₂ generation.', 1],
    ['In humans, the sex of the child is determined by:', ['The father', 'The mother', 'Both equally', 'Environment'], 0, 'The father contributes either an X or a Y chromosome.', 1],
    ['Nitrogenous base present in RNA but not in DNA:', ['Uracil', 'Thymine', 'Adenine', 'Guanine'], 0, 'RNA replaces thymine with uracil.', 1],
    ['A change in the DNA sequence is called a:', ['Mutation', 'Translation', 'Transcription', 'Replication'], 0, 'Mutations are the raw material of evolution.', 1],
    ['The dihybrid F₂ ratio is:', ['9 : 3 : 3 : 1', '3 : 1', '1 : 1 : 1 : 1', '1 : 2 : 1'], 0, 'From independent assortment of two gene pairs.', 2],
    ['Theory of natural selection was given by:', ['Charles Darwin', 'Lamarck', 'Hugo de Vries', 'Mendel'], 0, 'On the Origin of Species, 1859.', 1]
  ],

  bio_ecology: [
    ['The ultimate source of energy for almost all ecosystems is:', ['The Sun', 'Soil', 'Water', 'Wind'], 0, 'Producers convert solar energy via photosynthesis.', 1],
    ['Which gas is primarily responsible for the greenhouse effect?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Argon'], 0, 'CO₂ traps outgoing infrared radiation.', 1],
    ['Only about what percentage of energy transfers to the next trophic level?', ['10%', '50%', '90%', '1%'], 0, 'Lindeman’s ten per cent law.', 2],
    ['Ozone layer depletion is mainly caused by:', ['Chlorofluorocarbons', 'Carbon dioxide', 'Methane', 'Sulphur dioxide'], 0, 'CFCs release chlorine radicals that destroy ozone.', 1],
    ['Organisms that make their own food are called:', ['Autotrophs', 'Heterotrophs', 'Decomposers', 'Parasites'], 0, 'Green plants and some bacteria.', 1],
    ['Biodiversity is highest in:', ['Tropical rainforests', 'Deserts', 'Tundra', 'Grasslands'], 0, 'Warm, wet and stable conditions support most species.', 1],
    ['The term "ecosystem" was coined by:', ['A.G. Tansley', 'Odum', 'Darwin', 'Haeckel'], 0, 'Tansley introduced it in 1935.', 2]
  ],

  gen_science: [
    ['Which vitamin is produced in the skin under sunlight?', ['Vitamin D', 'Vitamin A', 'Vitamin C', 'Vitamin K'], 0, 'UV-B converts a cholesterol derivative into vitamin D.', 1],
    ['The study of earthquakes is called:', ['Seismology', 'Geology', 'Meteorology', 'Astronomy'], 0, 'Seismology measures seismic waves.', 1],
    ['Which planet is known as the Red Planet?', ['Mars', 'Jupiter', 'Venus', 'Mercury'], 0, 'Iron oxide gives the surface its colour.', 1],
    ['The speed of light in vacuum is about:', ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '1.5 × 10⁸ m/s'], 0, 'Exactly 299,792,458 m/s.', 1],
    ['LPG mainly consists of:', ['Butane and propane', 'Methane', 'Ethylene', 'Hydrogen'], 0, 'Liquefied petroleum gas is a butane–propane mix.', 1],
    ['Dialysis is used in the failure of which organ?', ['Kidney', 'Liver', 'Heart', 'Lung'], 0, 'It artificially filters blood.', 1],
    ['Which disease is caused by a deficiency of iodine?', ['Goitre', 'Anaemia', 'Rickets', 'Scurvy'], 0, 'The thyroid enlarges without sufficient iodine.', 1],
    ['A solar eclipse occurs when:', ['The Moon comes between the Sun and Earth', 'The Earth comes between Sun and Moon', 'The Sun comes between Earth and Moon', 'Earth’s shadow falls on the Sun'], 0, 'The Moon blocks sunlight reaching Earth.', 1],
    ['The instrument used to measure relative humidity is the:', ['Hygrometer', 'Barometer', 'Anemometer', 'Lactometer'], 0, 'Hygrometers measure atmospheric moisture.', 2],
    ['Which blood cells help in clotting?', ['Platelets', 'Red blood cells', 'White blood cells', 'Plasma cells'], 0, 'Thrombocytes trigger the clotting cascade.', 1],
    ['The chemical used in photography as a fixer is:', ['Sodium thiosulphate', 'Silver nitrate', 'Potassium iodide', 'Sodium chloride'], 0, 'Known as hypo.', 2],
    ['Which is a renewable source of energy?', ['Solar energy', 'Coal', 'Petroleum', 'Natural gas'], 0, 'Solar energy is continuously replenished.', 1]
  ],

  /* =======================================================================
     COMPUTER
     ======================================================================= */
  comp_fund: [
    ['1 kilobyte equals how many bytes?', ['1024', '1000', '512', '2048'], 0, '2¹⁰ = 1024 bytes.', 1],
    ['Which of these is system software?', ['Operating system', 'MS Word', 'Photoshop', 'VLC Player'], 0, 'An OS manages hardware and provides services to applications.', 1],
    ['The brain of a computer is the:', ['CPU', 'RAM', 'Hard disk', 'Monitor'], 0, 'The central processing unit performs instructions.', 1],
    ['Which memory is volatile?', ['RAM', 'ROM', 'Hard disk', 'Flash drive'], 0, 'RAM loses contents when power is removed.', 1],
    ['The full form of ALU is:', ['Arithmetic Logic Unit', 'Advanced Logic Unit', 'Algorithmic Logic Unit', 'Array Logic Unit'], 0, 'The ALU performs arithmetic and logical operations.', 1],
    ['Which is an input device?', ['Scanner', 'Printer', 'Speaker', 'Plotter'], 0, 'A scanner feeds data into the computer.', 1],
    ['The first generation of computers used:', ['Vacuum tubes', 'Transistors', 'Integrated circuits', 'Microprocessors'], 0, 'Transistors arrived in the second generation.', 2],
    ['Which number system does a computer use internally?', ['Binary', 'Decimal', 'Octal', 'Hexadecimal'], 0, 'Two states: 0 and 1.', 1],
    ['A nibble consists of:', ['4 bits', '8 bits', '2 bits', '16 bits'], 0, 'Half a byte.', 1],
    ['Which storage has the fastest access time?', ['Cache memory', 'Main memory', 'SSD', 'Magnetic tape'], 0, 'Cache sits closest to the CPU.', 2],
    ['The physical components of a computer are called:', ['Hardware', 'Software', 'Firmware', 'Middleware'], 0, 'Anything you can touch.', 1],
    ['BIOS is stored in:', ['ROM', 'RAM', 'Hard disk', 'Cache'], 0, 'Non-volatile firmware that boots the machine.', 2]
  ],

  comp_office: [
    ['The shortcut to copy selected text is:', ['Ctrl + C', 'Ctrl + X', 'Ctrl + V', 'Ctrl + Z'], 0, 'Ctrl + X cuts and Ctrl + V pastes.', 1],
    ['In MS Excel, a formula always begins with:', ['=', '+', '#', '@'], 0, 'The equals sign signals a formula.', 1],
    ['The default file extension of an MS Word 2016 document is:', ['.docx', '.doc', '.txt', '.wpd'], 0, 'Office Open XML format.', 1],
    ['Which key combination saves a document?', ['Ctrl + S', 'Ctrl + P', 'Ctrl + O', 'Ctrl + N'], 0, 'Ctrl + P prints, Ctrl + O opens.', 1],
    ['In Excel, the intersection of a row and a column is a:', ['Cell', 'Range', 'Sheet', 'Field'], 0, 'Each cell has an address such as B7.', 1],
    ['Which Excel function returns the number of numeric entries?', ['COUNT', 'SUM', 'AVERAGE', 'LEN'], 0, 'COUNTA counts non-empty cells of any type.', 2],
    ['In PowerPoint, F5 starts:', ['The slide show from the beginning', 'Spell check', 'Print preview', 'Slide sorter'], 0, 'Shift + F5 starts from the current slide.', 1],
    ['Ctrl + Z performs:', ['Undo', 'Redo', 'Zoom', 'Close'], 0, 'Ctrl + Y usually redoes.', 1],
    ['The cell reference $A$1 is:', ['Absolute', 'Relative', 'Mixed', 'Circular'], 0, 'Dollar signs lock both row and column.', 2]
  ],

  comp_net: [
    ['WWW stands for:', ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], 0, 'Proposed by Tim Berners-Lee in 1989.', 1],
    ['Which protocol is used to send email?', ['SMTP', 'FTP', 'HTTP', 'SNMP'], 0, 'POP3 and IMAP are used to retrieve mail.', 1],
    ['An IPv4 address is how many bits long?', ['32', '64', '128', '16'], 0, 'Four octets of 8 bits each.', 1],
    ['Which device connects two different networks?', ['Router', 'Hub', 'Repeater', 'Switch'], 0, 'Routers forward packets between networks using IP.', 1],
    ['LAN stands for:', ['Local Area Network', 'Large Area Network', 'Logical Area Node', 'Linked Access Network'], 0, 'Covers a small geographic area.', 1],
    ['The default port for HTTP is:', ['80', '21', '25', '443'], 0, 'HTTPS uses 443.', 2],
    ['DNS converts:', ['Domain names to IP addresses', 'IP addresses to MAC addresses', 'Text to binary', 'Packets to frames'], 0, 'The Domain Name System resolves hostnames.', 1],
    ['Which topology connects every device to a central node?', ['Star', 'Bus', 'Ring', 'Mesh'], 0, 'A hub or switch sits at the centre.', 1],
    ['Bandwidth is measured in:', ['Bits per second', 'Hertz only', 'Bytes', 'Watts'], 0, 'Data rate is bits per second.', 2]
  ],

  comp_security: [
    ['A program that replicates itself to harm a computer is a:', ['Virus', 'Compiler', 'Driver', 'Spooler'], 0, 'Viruses attach to host files and spread.', 1],
    ['Phishing is an attempt to:', ['Steal credentials by impersonation', 'Overload a server', 'Encrypt files for ransom', 'Intercept Wi-Fi packets'], 0, 'Fake emails or sites trick users into revealing data.', 1],
    ['A firewall is used to:', ['Filter network traffic', 'Increase RAM', 'Speed up the CPU', 'Compress files'], 0, 'It enforces rules on incoming and outgoing packets.', 1],
    ['Malware that locks files until payment is made is:', ['Ransomware', 'Spyware', 'Adware', 'Rootkit'], 0, 'Files are encrypted and a ransom demanded.', 1],
    ['HTTPS secures traffic using:', ['SSL/TLS', 'FTP', 'Telnet', 'SMTP'], 0, 'TLS encrypts the channel.', 2],
    ['Two-factor authentication adds:', ['A second independent proof of identity', 'A longer password', 'A second username', 'An extra firewall'], 0, 'Something you know plus something you have.', 1],
    ['A brute-force attack tries to:', ['Guess passwords exhaustively', 'Flood a network', 'Alter database records', 'Spoof an IP address'], 0, 'It systematically tries all combinations.', 2]
  ],

  ds_algo: [
    ['Which data structure follows LIFO?', ['Stack', 'Queue', 'Linked list', 'Tree'], 0, 'Last In, First Out.', 1],
    ['The worst-case time complexity of quicksort is:', ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], 0, 'Occurs when the pivot is always extreme.', 2],
    ['Binary search requires the array to be:', ['Sorted', 'Unsorted', 'Of even length', 'Of unique values only'], 0, 'It halves the search interval using order.', 1],
    ['Which traversal of a BST gives sorted order?', ['Inorder', 'Preorder', 'Postorder', 'Level order'], 0, 'Left, root, right yields ascending order.', 2],
    ['Average time complexity of searching a hash table is:', ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], 0, 'Constant on average with a good hash function.', 2],
    ['A queue follows which principle?', ['FIFO', 'LIFO', 'Random access', 'Priority only'], 0, 'First In, First Out.', 1],
    ['The maximum number of nodes in a binary tree of height h (root at height 0) is:', ['2^(h+1) − 1', '2^h', '2h + 1', 'h²'], 0, 'Sum of a geometric series of levels.', 2],
    ['Which algorithm finds the shortest path with non-negative weights?', ['Dijkstra’s algorithm', 'Kruskal’s algorithm', 'Prim’s algorithm', 'Bellman–Ford only'], 0, 'Dijkstra requires non-negative edge weights.', 2],
    ['Merge sort has a space complexity of:', ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], 0, 'It needs an auxiliary array for merging.', 2],
    ['A complete binary tree with n nodes has height:', ['⌊log₂ n⌋', 'n/2', 'log₁₀ n', 'n − 1'], 0, 'Levels fill completely from the top.', 3],
    ['Which data structure is used for BFS traversal?', ['Queue', 'Stack', 'Heap', 'Trie'], 0, 'Nodes are explored level by level using a queue.', 2],
    ['The time complexity of building a heap from n elements is:', ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'], 0, 'Bottom-up heapify is linear.', 3]
  ],

  os_topic: [
    ['Which scheduling algorithm can cause starvation?', ['Priority scheduling', 'Round robin', 'FCFS', 'Shortest remaining time with ageing'], 0, 'Low-priority processes may never run without ageing.', 2],
    ['A deadlock requires all of the following except:', ['Preemption', 'Mutual exclusion', 'Hold and wait', 'Circular wait'], 0, 'No-preemption is a necessary condition; allowing preemption prevents deadlock.', 3],
    ['Thrashing is caused by:', ['Excessive paging', 'Too much cache', 'Disk fragmentation', 'High CPU clock'], 0, 'The system spends more time swapping than executing.', 2],
    ['The part of the OS always resident in memory is the:', ['Kernel', 'Shell', 'Compiler', 'Loader'], 0, 'The kernel manages core resources.', 1],
    ['Which page replacement algorithm suffers from Belady’s anomaly?', ['FIFO', 'LRU', 'Optimal', 'Clock'], 0, 'More frames can increase faults under FIFO.', 3],
    ['A semaphore is used for:', ['Process synchronisation', 'Memory allocation', 'File compression', 'Disk scheduling'], 0, 'wait() and signal() control access to shared resources.', 2],
    ['Virtual memory allows:', ['Programs larger than physical memory to run', 'Faster CPU clock', 'More cores', 'Smaller page sizes only'], 0, 'Pages are swapped between disk and RAM.', 2],
    ['In round-robin scheduling, performance depends mainly on:', ['Time quantum size', 'Number of disks', 'Page size', 'Cache line size'], 0, 'Too small adds overhead; too large degenerates to FCFS.', 2],
    ['A process in the ready state is:', ['Waiting for the CPU', 'Waiting for I/O', 'Terminated', 'Executing'], 0, 'It has everything it needs except the processor.', 1]
  ],

  dbms: [
    ['A primary key is:', ['Unique and not null', 'Unique but may be null', 'Always a foreign key', 'Always composite'], 0, 'It uniquely identifies each tuple.', 1],
    ['Which normal form removes partial dependency?', ['2NF', '1NF', '3NF', 'BCNF'], 0, 'Non-key attributes must depend on the whole key.', 2],
    ['SQL command to remove a table structure completely:', ['DROP', 'DELETE', 'TRUNCATE', 'REMOVE'], 0, 'DELETE and TRUNCATE remove rows only.', 1],
    ['ACID stands for:', ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Atomic, Current, Integrated, Direct', 'Aggregate, Commit, Index, Delete'], 0, 'The four transaction properties.', 1],
    ['A foreign key enforces:', ['Referential integrity', 'Entity integrity', 'Domain integrity', 'Physical integrity'], 0, 'It must match a primary key in another relation.', 2],
    ['Which SQL clause filters groups?', ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'], 0, 'WHERE filters rows before grouping.', 2],
    ['In BCNF, for every functional dependency X → Y:', ['X must be a superkey', 'Y must be a key', 'X must be atomic', 'Y must be non-prime'], 0, 'This is the BCNF condition.', 3],
    ['A relation with no repeating groups is in:', ['1NF', '2NF', '3NF', 'BCNF'], 0, 'First normal form requires atomic values.', 1],
    ['Which join returns only matching rows from both tables?', ['Inner join', 'Left outer join', 'Full outer join', 'Cross join'], 0, 'Non-matching rows are excluded.', 1]
  ],

  toc: [
    ['A language accepted by a finite automaton is:', ['Regular', 'Context-free', 'Context-sensitive', 'Recursively enumerable'], 0, 'Finite automata recognise exactly the regular languages.', 2],
    ['The language {aⁿbⁿ | n ≥ 1} is:', ['Context-free but not regular', 'Regular', 'Not context-free', 'Finite'], 0, 'A stack is needed to count, so a PDA is required.', 2],
    ['A pushdown automaton uses which auxiliary memory?', ['Stack', 'Queue', 'Tape', 'Register'], 0, 'A single stack gives it more power than an FA.', 1],
    ['Every DFA is also an:', ['NFA', 'PDA with two stacks', 'Turing machine with no tape', 'Undecidable machine'], 0, 'A DFA is a special case of an NFA.', 2],
    ['The halting problem is:', ['Undecidable', 'Decidable in polynomial time', 'NP-complete', 'Regular'], 0, 'Turing proved no general algorithm exists.', 2],
    ['Pumping lemma is used to prove a language is:', ['Not regular', 'Regular', 'Finite', 'Deterministic'], 0, 'It gives a necessary condition for regularity.', 2],
    ['The complement of a regular language is:', ['Always regular', 'Never regular', 'Context-free only', 'Undecidable'], 0, 'Regular languages are closed under complement.', 2],
    ['Chomsky hierarchy type 0 grammars generate:', ['Recursively enumerable languages', 'Regular languages', 'Context-free languages', 'Finite languages'], 0, 'Unrestricted grammars sit at the top.', 3]
  ],

  coa: [
    ['Pipelining improves:', ['Instruction throughput', 'Clock speed', 'Memory size', 'Cache hit ratio'], 0, 'More instructions complete per unit time, though latency stays similar.', 2],
    ['The cache mapping where a block can go anywhere is:', ['Fully associative', 'Direct mapped', 'Set associative', 'Sequential'], 0, 'Any block can occupy any line.', 2],
    ['A 2’s complement representation of −1 in 8 bits is:', ['11111111', '10000001', '00000001', '11111110'], 0, 'Invert 00000001 to 11111110 and add 1.', 2],
    ['DMA transfers data:', ['Without CPU involvement in each word', 'Only through the CPU registers', 'Only for keyboards', 'Only in interrupt mode'], 0, 'The DMA controller moves blocks directly to memory.', 2],
    ['Which register holds the address of the next instruction?', ['Program counter', 'Accumulator', 'Instruction register', 'Stack pointer'], 0, 'The PC is incremented each fetch.', 1],
    ['A structural hazard in a pipeline arises from:', ['Resource conflicts', 'Branch misprediction', 'Data dependency', 'Cache miss only'], 0, 'Two stages need the same hardware simultaneously.', 3],
    ['The number of address lines needed for 1 KB of memory is:', ['10', '8', '12', '16'], 0, '2¹⁰ = 1024 locations.', 2]
  ],

  cn_topic: [
    ['How many layers does the OSI model have?', ['7', '5', '4', '6'], 0, 'Physical to Application.', 1],
    ['TCP provides:', ['Reliable, connection-oriented delivery', 'Unreliable datagram delivery', 'Routing between networks', 'Physical signalling'], 0, 'UDP is the connectionless alternative.', 1],
    ['Which layer is responsible for routing?', ['Network layer', 'Data link layer', 'Transport layer', 'Session layer'], 0, 'IP operates at layer 3.', 2],
    ['A MAC address is how many bits?', ['48', '32', '64', '128'], 0, 'Six octets, usually shown in hex.', 2],
    ['Which protocol resolves an IP address to a MAC address?', ['ARP', 'DNS', 'DHCP', 'ICMP'], 0, 'Address Resolution Protocol.', 2],
    ['The subnet mask 255.255.255.0 corresponds to:', ['/24', '/16', '/8', '/32'], 0, '24 network bits.', 2],
    ['Which device operates at the data link layer?', ['Switch', 'Router', 'Repeater', 'Gateway'], 0, 'Switches forward frames using MAC addresses.', 2],
    ['Flow control in TCP is achieved using:', ['Sliding window', 'Checksum', 'TTL', 'Fragmentation'], 0, 'The receiver advertises a window size.', 2]
  ],

  programming: [
    ['Which is not a valid C data type?', ['real', 'int', 'float', 'char'], 0, 'C has no "real" type.', 1],
    ['The size of an int in C on most 32/64-bit systems is:', ['4 bytes', '2 bytes', '8 bytes', '1 byte'], 0, 'Implementation defined, but commonly 4 bytes.', 1],
    ['What does the "break" statement do inside a loop?', ['Exits the loop immediately', 'Skips the current iteration', 'Restarts the loop', 'Ends the program'], 0, '"continue" skips an iteration.', 1],
    ['In C, an array index starts at:', ['0', '1', '−1', 'Any value'], 0, 'Zero-based indexing.', 1],
    ['Which operator is used to access a structure member through a pointer?', ['->', '.', '::', '&'], 0, 'p->member is shorthand for (*p).member.', 2],
    ['The output of printf("%d", 5/2); in C is:', ['2', '2.5', '3', '2.0'], 0, 'Integer division truncates toward zero.', 1],
    ['A function that calls itself is:', ['Recursive', 'Inline', 'Static', 'Virtual'], 0, 'It needs a base case to terminate.', 1],
    ['Which header is required for printf in C?', ['stdio.h', 'stdlib.h', 'conio.h', 'string.h'], 0, 'Standard input/output declarations.', 1],
    ['The storage class that retains a value between function calls is:', ['static', 'auto', 'register', 'extern'], 0, 'Static locals keep their value across calls.', 2]
  ],

  /* =======================================================================
     ENGLISH
     ======================================================================= */
  synonyms: [
    ['Choose the word most similar in meaning to ABANDON.', ['Forsake', 'Acquire', 'Retain', 'Cherish'], 0, 'To abandon is to forsake or give up.', 1],
    ['Choose the synonym of LUCID.', ['Clear', 'Dull', 'Confusing', 'Hidden'], 0, 'Lucid means easily understood.', 1],
    ['Choose the synonym of FRUGAL.', ['Thrifty', 'Wasteful', 'Generous', 'Rich'], 0, 'Frugal means economical with resources.', 2],
    ['Choose the synonym of CANDID.', ['Frank', 'Deceitful', 'Shy', 'Rude'], 0, 'Candid means honest and straightforward.', 2],
    ['Choose the synonym of OBSOLETE.', ['Outdated', 'Modern', 'Durable', 'Essential'], 0, 'Obsolete means no longer in use.', 1],
    ['Choose the synonym of BENEVOLENT.', ['Kind', 'Cruel', 'Selfish', 'Indifferent'], 0, 'Benevolent means well-meaning and kindly.', 1],
    ['Choose the synonym of METICULOUS.', ['Careful', 'Careless', 'Hasty', 'Rough'], 0, 'Meticulous means showing great attention to detail.', 2],
    ['Choose the synonym of TENACIOUS.', ['Persistent', 'Weak', 'Flexible', 'Casual'], 0, 'Tenacious means holding firmly.', 2],
    ['Choose the synonym of AMELIORATE.', ['Improve', 'Worsen', 'Ignore', 'Delay'], 0, 'To ameliorate is to make better.', 3],
    ['Choose the synonym of EPHEMERAL.', ['Short-lived', 'Permanent', 'Enormous', 'Frequent'], 0, 'Ephemeral means lasting a very short time.', 3],
    ['Choose the synonym of VINDICATE.', ['Justify', 'Accuse', 'Punish', 'Confuse'], 0, 'To vindicate is to clear of blame.', 3],
    ['Choose the synonym of PROLIFIC.', ['Productive', 'Barren', 'Lazy', 'Shallow'], 0, 'Prolific means producing much.', 2]
  ],

  antonyms: [
    ['Choose the word most opposite in meaning to SCARCE.', ['Abundant', 'Rare', 'Limited', 'Few'], 0, 'Scarce means in short supply; abundant is its opposite.', 1],
    ['Choose the antonym of TRANSPARENT.', ['Opaque', 'Clear', 'Visible', 'Plain'], 0, 'Opaque does not allow light through.', 1],
    ['Choose the antonym of HUMBLE.', ['Arrogant', 'Modest', 'Simple', 'Polite'], 0, 'Humble is the opposite of arrogant.', 1],
    ['Choose the antonym of EXPAND.', ['Contract', 'Enlarge', 'Stretch', 'Grow'], 0, 'To contract is to reduce in size.', 1],
    ['Choose the antonym of OPTIMIST.', ['Pessimist', 'Realist', 'Idealist', 'Activist'], 0, 'A pessimist expects the worst.', 1],
    ['Choose the antonym of CONDEMN.', ['Praise', 'Blame', 'Criticise', 'Reject'], 0, 'To condemn is to express strong disapproval.', 2],
    ['Choose the antonym of VOLUNTARY.', ['Compulsory', 'Willing', 'Optional', 'Free'], 0, 'Voluntary means done by choice.', 2],
    ['Choose the antonym of ASCEND.', ['Descend', 'Climb', 'Rise', 'Mount'], 0, 'To descend is to go down.', 1],
    ['Choose the antonym of VERBOSE.', ['Concise', 'Wordy', 'Lengthy', 'Detailed'], 0, 'Verbose means using more words than needed.', 3],
    ['Choose the antonym of AMATEUR.', ['Professional', 'Beginner', 'Novice', 'Learner'], 0, 'An amateur is a non-professional.', 2]
  ],

  error_spot: [
    ['Find the part with an error: (a) He is one of (b) the best player (c) in the team. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, '"One of the" takes a plural noun: "one of the best players".', 2],
    ['Find the error: (a) Each of the boys (b) have submitted (c) their assignment. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, '"Each" is singular, so it should be "has submitted".', 2],
    ['Find the error: (a) The news (b) are very (c) disturbing today. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, '"News" is an uncountable singular noun: "is very disturbing".', 2],
    ['Find the error: (a) She said that (b) she will come (c) the next day. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, 'Reported speech after a past verb needs "would come".', 2],
    ['Find the error: (a) I have been (b) living here (c) since five years. (d) No error', ['(c)', '(a)', '(b)', '(d)'], 0, 'A duration takes "for", not "since": "for five years".', 1],
    ['Find the error: (a) He is senior (b) than me (c) by two years. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, 'Latin comparatives take "to": "senior to me".', 2],
    ['Find the error: (a) One should (b) do his duty (c) sincerely. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, '"One" must be followed by "one\'s": "do one\'s duty".', 2],
    ['Find the error: (a) The committee (b) have decided (c) to postpone the meeting. (d) No error', ['(b)', '(a)', '(c)', '(d)'], 0, 'A collective noun acting as one unit takes a singular verb: "has decided".', 3]
  ],

  fill_blanks: [
    ['He succeeded ______ passing the examination.', ['in', 'to', 'at', 'for'], 0, '"Succeed in" is the fixed collocation.', 1],
    ['She has been working here ______ 2015.', ['since', 'for', 'from', 'by'], 0, '"Since" is used with a point in time.', 1],
    ['The teacher ______ the students for their hard work.', ['praised', 'blamed', 'scolded', 'ignored'], 0, 'Hard work invites praise.', 1],
    ['Hardly had he reached the station ______ the train left.', ['when', 'than', 'then', 'that'], 0, '"Hardly … when" is the correct pair.', 2],
    ['He is not only intelligent ______ hard-working.', ['but also', 'and also', 'as well', 'but'], 0, '"Not only … but also" is the correlative pair.', 2],
    ['The proposal was turned ______ by the committee.', ['down', 'off', 'in', 'over'], 0, '"Turn down" means to reject.', 2],
    ['Neither the students nor the teacher ______ present.', ['was', 'were', 'are', 'have been'], 0, 'With "neither … nor", the verb agrees with the nearer subject.', 3],
    ['If I ______ you, I would accept the offer.', ['were', 'was', 'am', 'be'], 0, 'The second conditional uses the subjunctive "were".', 2],
    ['He is addicted ______ smoking.', ['to', 'with', 'for', 'in'], 0, '"Addicted to" is fixed.', 1]
  ],

  idioms: [
    ['What does "to let the cat out of the bag" mean?', ['To reveal a secret', 'To free an animal', 'To start a fight', 'To waste money'], 0, 'It means disclosing something meant to be hidden.', 1],
    ['What does "a blessing in disguise" mean?', ['Something good that seemed bad at first', 'A hidden threat', 'A religious ritual', 'An unexpected gift'], 0, 'A misfortune that turns out well.', 1],
    ['What does "to burn the midnight oil" mean?', ['To work late into the night', 'To waste resources', 'To celebrate', 'To cause damage'], 0, 'It refers to studying or working very late.', 1],
    ['What does "to beat about the bush" mean?', ['To avoid the main point', 'To search thoroughly', 'To attack someone', 'To work in a garden'], 0, 'It means talking around a subject.', 1],
    ['What does "once in a blue moon" mean?', ['Very rarely', 'Every month', 'At night only', 'Frequently'], 0, 'A rare occurrence.', 1],
    ['What does "to make both ends meet" mean?', ['To manage within one’s income', 'To finish a task', 'To join two parties', 'To travel far'], 0, 'To live within limited means.', 2],
    ['What does "a storm in a teacup" mean?', ['Great excitement over something trivial', 'A sudden disaster', 'A hot drink', 'A secret plan'], 0, 'A big fuss over a small matter.', 2],
    ['What does "to play second fiddle" mean?', ['To take a subordinate role', 'To perform music', 'To cheat someone', 'To arrive late'], 0, 'To be of lesser importance.', 2],
    ['What does "to smell a rat" mean?', ['To suspect something wrong', 'To find a bad odour', 'To catch a thief', 'To be very hungry'], 0, 'It suggests suspicion of deceit.', 2]
  ],

  one_word: [
    ['One who studies the stars and planets:', ['Astronomer', 'Astrologer', 'Geologist', 'Meteorologist'], 0, 'An astrologer predicts from stars; an astronomer studies them scientifically.', 1],
    ['A person who cannot read or write:', ['Illiterate', 'Ignorant', 'Innocent', 'Incompetent'], 0, 'Illiteracy is the inability to read or write.', 1],
    ['A speech made without preparation:', ['Extempore', 'Eulogy', 'Soliloquy', 'Monologue'], 0, 'Extempore means impromptu.', 2],
    ['One who loves mankind:', ['Philanthropist', 'Misanthrope', 'Egotist', 'Philatelist'], 0, 'Philanthropy is love of humanity.', 2],
    ['A place where coins are made:', ['Mint', 'Bank', 'Treasury', 'Foundry'], 0, 'The mint manufactures currency.', 1],
    ['Something that can be interpreted in more than one way:', ['Ambiguous', 'Ambivalent', 'Amicable', 'Arbitrary'], 0, 'Ambiguous means open to multiple readings.', 2],
    ['One who collects stamps:', ['Philatelist', 'Numismatist', 'Archivist', 'Curator'], 0, 'A numismatist collects coins.', 2],
    ['A medicine that counteracts poison:', ['Antidote', 'Antiseptic', 'Antibiotic', 'Analgesic'], 0, 'An antidote neutralises poison.', 1],
    ['Government by the people:', ['Democracy', 'Autocracy', 'Oligarchy', 'Theocracy'], 0, 'Demos (people) + kratos (rule).', 1]
  ],

  spelling: [
    ['Choose the correctly spelt word.', ['Accommodation', 'Acommodation', 'Accomodation', 'Acomodation'], 0, 'Two c’s and two m’s.', 1],
    ['Choose the correctly spelt word.', ['Occurrence', 'Occurence', 'Ocurrence', 'Occurrance'], 0, 'Double c, double r, ends in -ence.', 2],
    ['Choose the correctly spelt word.', ['Privilege', 'Priviledge', 'Privillege', 'Privelege'], 0, 'No "d" in privilege.', 2],
    ['Choose the correctly spelt word.', ['Maintenance', 'Maintainance', 'Maintenence', 'Maintanance'], 0, 'The verb is maintain, but the noun drops the "i".', 2],
    ['Choose the correctly spelt word.', ['Embarrass', 'Embarass', 'Embarras', 'Emmbarrass'], 0, 'Double r and double s.', 1],
    ['Choose the correctly spelt word.', ['Conscientious', 'Consciencious', 'Conscientous', 'Conscentious'], 0, 'From conscience, ending -tious.', 3],
    ['Choose the correctly spelt word.', ['Liaison', 'Liasion', 'Liaision', 'Leiaison'], 0, 'L-i-a-i-s-o-n.', 3],
    ['Choose the correctly spelt word.', ['Separate', 'Seperate', 'Saperate', 'Separete'], 0, 'There is "a rat" in separate.', 1]
  ],

  sentence_imp: [
    ['Improve: "He is more cleverer than his brother."', ['He is cleverer than his brother.', 'He is more clever as his brother.', 'He is most clever than his brother.', 'No improvement'], 0, 'A double comparative is incorrect.', 1],
    ['Improve: "I am looking forward to meet you."', ['I am looking forward to meeting you.', 'I look forward to meet you.', 'I am looking forward for meeting you.', 'No improvement'], 0, '"Look forward to" is followed by a gerund.', 2],
    ['Improve: "The quality of the apples were poor."', ['The quality of the apples was poor.', 'The qualities of the apple were poor.', 'Quality of apples are poor.', 'No improvement'], 0, 'The subject "quality" is singular.', 2],
    ['Improve: "He did not came yesterday."', ['He did not come yesterday.', 'He does not came yesterday.', 'He did not comes yesterday.', 'No improvement'], 0, 'After "did", the base form is used.', 1],
    ['Improve: "She is married with a doctor."', ['She is married to a doctor.', 'She is married by a doctor.', 'She is married for a doctor.', 'No improvement'], 0, '"Married to" is the correct preposition.', 2],
    ['Improve: "Each of the three boys were rewarded."', ['Each of the three boys was rewarded.', 'Each of three boys were rewarded.', 'Each of the three boy was rewarded.', 'No improvement'], 0, '"Each" takes a singular verb.', 2],
    ['Improve: "Hardly he had left when it rained."', ['Hardly had he left when it rained.', 'Hardly he left when it rained.', 'Hardly did he left when it rained.', 'No improvement'], 0, 'A sentence beginning with "hardly" inverts the subject and auxiliary.', 3]
  ],

  grammar: [
    ['Choose the correct sentence.', ['Neither of the answers is correct.', 'Neither of the answers are correct.', 'Neither of the answer are correct.', 'Neither of answers is correct.'], 0, '"Neither" is singular.', 2],
    ['Identify the part of speech of "quickly" in "She ran quickly".', ['Adverb', 'Adjective', 'Verb', 'Noun'], 0, 'It modifies the verb "ran".', 1],
    ['What is the past participle of "write"?', ['Written', 'Wrote', 'Writing', 'Writed'], 0, 'write – wrote – written.', 1],
    ['Choose the correct form: "If it rains, we ______ cancel the match."', ['will', 'would', 'had', 'shall have'], 0, 'First conditional: if + present, will + base verb.', 2],
    ['"The book which I bought is costly." The underlined clause is a:', ['Relative clause', 'Noun clause', 'Adverb clause', 'Main clause'], 0, 'It describes the noun "book".', 2],
    ['Choose the correct article: "He is ______ honest man."', ['an', 'a', 'the', 'no article'], 0, '"Honest" begins with a vowel sound.', 1],
    ['The plural of "criterion" is:', ['criteria', 'criterions', 'criterias', 'criterion'], 0, 'Greek-origin plural.', 2],
    ['"They have been waiting for an hour." The tense is:', ['Present perfect continuous', 'Present continuous', 'Past perfect', 'Future perfect'], 0, 'have been + -ing indicates present perfect continuous.', 2]
  ],

  voice_speech: [
    ['Change to passive: "She writes a letter."', ['A letter is written by her.', 'A letter was written by her.', 'A letter has written by her.', 'A letter writes by her.'], 0, 'Simple present passive: is/am/are + past participle.', 1],
    ['Change to passive: "They are building a bridge."', ['A bridge is being built by them.', 'A bridge is built by them.', 'A bridge was being built by them.', 'A bridge has been built by them.'], 0, 'Present continuous passive: is being + past participle.', 2],
    ['Change to active: "The window was broken by the boy."', ['The boy broke the window.', 'The boy breaks the window.', 'The boy has broken the window.', 'The boy had broken the window.'], 0, 'Simple past active.', 1],
    ['Change to indirect: He said, "I am tired."', ['He said that he was tired.', 'He said that he is tired.', 'He says that he was tired.', 'He told that he is tired.'], 0, 'Present shifts to past in reported speech.', 2],
    ['Change to indirect: She said to me, "Close the door."', ['She told me to close the door.', 'She said me to close the door.', 'She told me that close the door.', 'She asked that I close door.'], 0, 'Imperatives become "told/asked + to + verb".', 2],
    ['Change to passive: "Someone has stolen my bag."', ['My bag has been stolen.', 'My bag was stolen by someone.', 'My bag is stolen.', 'My bag had been stolen.'], 0, 'Present perfect passive with an indefinite agent dropped.', 2],
    ['Change to indirect: He said, "I will come tomorrow."', ['He said that he would come the next day.', 'He said that he will come tomorrow.', 'He said he would come tomorrow.', 'He told that he would come the next day.'], 0, 'Will → would, tomorrow → the next day.', 2]
  ],

  para_jumble: [
    ['Arrange: (P) he went to the market (Q) after finishing his work (R) to buy vegetables (S) in the evening', ['Q S P R', 'P Q R S', 'S P Q R', 'R P Q S'], 0, 'Time clause, then time of day, then the action and its purpose: "After finishing his work, in the evening, he went to the market to buy vegetables."', 2],
    ['Arrange: (P) is the best policy (Q) honesty (R) in the long run (S) always', ['Q S P R', 'Q P R S', 'S Q P R', 'P Q S R'], 0, '"Honesty always is the best policy in the long run."', 2],
    ['Arrange: (P) she prepared well (Q) and therefore (R) cleared (S) the examination easily', ['P Q R S', 'Q P R S', 'R S P Q', 'S P Q R'], 0, '"She prepared well and therefore cleared the examination easily."', 2],
    ['Arrange: (P) because of heavy rain (Q) the match (R) was postponed (S) yesterday', ['Q R S P', 'P Q R S', 'Q S R P', 'S P Q R'], 0, '"The match was postponed yesterday because of heavy rain."', 2],
    ['Arrange: (P) a good book (Q) is (R) a faithful friend (S) always', ['P Q S R', 'P S Q R', 'Q P R S', 'S P Q R'], 0, '"A good book is always a faithful friend."', 2]
  ],

  comprehension: [
    ['"Reading maps the mind the way walking maps a city — slowly, and by repetition."\nThe passage suggests that reading is:', ['A gradual, repetitive process', 'An urban activity', 'Faster than walking', 'Only useful for travellers'], 0, 'The comparison stresses slowness and repetition.', 2],
    ['"The committee met for six hours but agreed on nothing beyond the date of the next meeting."\nThe tone of the sentence is:', ['Ironic', 'Enthusiastic', 'Neutral and factual', 'Hostile'], 0, 'The contrast between effort and outcome produces irony.', 2],
    ['"Every forest fire this decade has been traced to human activity, whether careless or deliberate."\nWhich is the best inference?', ['Natural causes were not responsible for these fires', 'All fires were deliberate', 'Forest fires are increasing', 'Humans cannot prevent fires'], 0, 'The passage attributes all fires to human activity.', 2],
    ['"The scheme was announced with fanfare, funded for one year, and quietly dropped."\nThe author’s attitude is:', ['Critical', 'Admiring', 'Indifferent', 'Confused'], 0, 'The sequence implies disapproval of the scheme’s handling.', 2],
    ['"No invention changed domestic life as much as the electric motor, though few people could name it as such."\nThe sentence implies the electric motor is:', ['Influential yet unrecognised', 'Recently invented', 'No longer in use', 'Expensive'], 0, 'High impact combined with low recognition.', 2]
  ],

  /* =======================================================================
     GENERAL AWARENESS
     ======================================================================= */
  gk_history: [
    ['The Indian National Congress was founded in:', ['1885', '1875', '1905', '1920'], 0, 'Founded by A.O. Hume in Bombay.', 1],
    ['Who is known as the Iron Man of India?', ['Sardar Vallabhbhai Patel', 'Jawaharlal Nehru', 'Bhagat Singh', 'Subhas Chandra Bose'], 0, 'For integrating the princely states.', 1],
    ['The Battle of Plassey was fought in:', ['1757', '1764', '1857', '1707'], 0, 'Robert Clive defeated Siraj-ud-Daulah.', 1],
    ['The Quit India Movement was launched in:', ['1942', '1930', '1920', '1947'], 0, 'On 8 August 1942 with the call "Do or Die".', 1],
    ['Who founded the Maurya Empire?', ['Chandragupta Maurya', 'Ashoka', 'Bindusara', 'Samudragupta'], 0, 'Around 322 BCE, aided by Chanakya.', 1],
    ['The Dandi March of 1930 was a protest against:', ['The salt tax', 'The Rowlatt Act', 'Partition of Bengal', 'The Simon Commission'], 0, 'Gandhi marched to Dandi to make salt.', 1],
    ['Harappan civilisation belongs to which age?', ['Bronze Age', 'Iron Age', 'Stone Age', 'Copper-less Neolithic'], 0, 'It is a Bronze Age civilisation.', 2],
    ['Who was the first Governor-General of independent India?', ['Lord Mountbatten', 'C. Rajagopalachari', 'Lord Wavell', 'Rajendra Prasad'], 0, 'Rajagopalachari was the last and the first Indian one.', 2],
    ['The Jallianwala Bagh massacre took place in:', ['1919', '1920', '1912', '1930'], 0, 'On 13 April 1919 in Amritsar.', 1],
    ['Which Gupta ruler is called the Napoleon of India?', ['Samudragupta', 'Chandragupta II', 'Skandagupta', 'Kumaragupta'], 0, 'For his extensive military campaigns.', 2]
  ],

  gk_polity: [
    ['How many fundamental rights are guaranteed by the Indian Constitution?', ['Six', 'Seven', 'Five', 'Eight'], 0, 'Originally seven; the right to property was removed in 1978.', 1],
    ['The Preamble of the Indian Constitution was amended by which amendment?', ['42nd', '44th', '52nd', '73rd'], 0, 'The 42nd Amendment (1976) added "socialist", "secular" and "integrity".', 2],
    ['Who is the head of the Indian State?', ['The President', 'The Prime Minister', 'The Chief Justice', 'The Speaker'], 0, 'The President is the constitutional head.', 1],
    ['The Rajya Sabha can have a maximum of how many members?', ['250', '245', '552', '238'], 0, 'The constitutional ceiling is 250.', 2],
    ['Fundamental Duties were added by which amendment?', ['42nd', '44th', '24th', '73rd'], 0, 'Added in 1976 as Article 51A.', 2],
    ['The Indian Constitution came into force on:', ['26 January 1950', '15 August 1947', '26 November 1949', '2 October 1950'], 0, 'Adopted on 26 November 1949, enforced on 26 January 1950.', 1],
    ['Which article deals with the Right to Constitutional Remedies?', ['Article 32', 'Article 19', 'Article 21', 'Article 14'], 0, 'Called the "heart and soul" of the Constitution by Ambedkar.', 2],
    ['The Directive Principles of State Policy are borrowed from:', ['Ireland', 'USA', 'UK', 'Canada'], 0, 'The Irish Constitution.', 2],
    ['Who appoints the Chief Election Commissioner of India?', ['The President', 'The Prime Minister', 'The Chief Justice', 'Parliament'], 0, 'Appointed by the President.', 2],
    ['The minimum age to become a member of the Lok Sabha is:', ['25 years', '21 years', '30 years', '35 years'], 0, 'Rajya Sabha requires 30 years.', 1]
  ],

  gk_geo: [
    ['The longest river in India is the:', ['Ganga', 'Godavari', 'Brahmaputra', 'Narmada'], 0, 'About 2,525 km within India.', 1],
    ['Which is the largest state of India by area?', ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'], 0, 'Rajasthan covers about 342,239 km².', 1],
    ['The Tropic of Cancer passes through how many Indian states?', ['Eight', 'Six', 'Ten', 'Five'], 0, 'Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.', 2],
    ['The highest mountain peak in India is:', ['Kangchenjunga', 'Nanda Devi', 'K2', 'Everest'], 0, 'Kangchenjunga is the highest peak wholly within India.', 2],
    ['Which strait separates India from Sri Lanka?', ['Palk Strait', 'Bering Strait', 'Strait of Malacca', 'Bass Strait'], 0, 'Along with the Gulf of Mannar.', 1],
    ['The Deccan Plateau is mainly made of:', ['Basalt', 'Granite', 'Limestone', 'Sandstone'], 0, 'Formed from volcanic lava flows.', 2],
    ['Which is the smallest state of India by area?', ['Goa', 'Sikkim', 'Tripura', 'Manipur'], 0, 'Goa covers about 3,702 km².', 1],
    ['The Western Ghats are also called the:', ['Sahyadri', 'Aravalli', 'Vindhya', 'Satpura'], 0, 'Sahyadri runs parallel to the western coast.', 1],
    ['Which Indian state has the longest coastline?', ['Gujarat', 'Tamil Nadu', 'Andhra Pradesh', 'Maharashtra'], 0, 'About 1,600 km.', 2],
    ['The Thar Desert lies mainly in:', ['Rajasthan', 'Gujarat', 'Haryana', 'Punjab'], 0, 'It extends into Pakistan as well.', 1]
  ],

  gk_eco: [
    ['The Reserve Bank of India was established in:', ['1935', '1947', '1949', '1955'], 0, 'Nationalised in 1949.', 1],
    ['GDP stands for:', ['Gross Domestic Product', 'Gross Development Product', 'General Domestic Produce', 'Gross Direct Profit'], 0, 'Total value of goods and services produced within a country.', 1],
    ['NITI Aayog replaced which body?', ['Planning Commission', 'Finance Commission', 'RBI', 'SEBI'], 0, 'Replaced in 2015.', 1],
    ['Repo rate is the rate at which:', ['RBI lends to commercial banks', 'Banks lend to customers', 'RBI borrows from banks', 'Banks lend to each other'], 0, 'Reverse repo is the opposite.', 2],
    ['Inflation generally means:', ['A sustained rise in the general price level', 'A fall in prices', 'A rise in employment', 'A fall in money supply'], 0, 'Purchasing power falls as prices rise.', 1],
    ['GST was implemented in India on:', ['1 July 2017', '1 April 2016', '1 January 2018', '15 August 2017'], 0, 'A unified indirect tax.', 1],
    ['Which sector contributes the largest share to India’s GDP?', ['Services', 'Agriculture', 'Manufacturing', 'Mining'], 0, 'Services contribute over half.', 2],
    ['SEBI regulates:', ['The securities market', 'Banks', 'Insurance', 'Commodities trading only'], 0, 'The Securities and Exchange Board of India.', 1],
    ['Fiscal deficit is the difference between:', ['Total expenditure and total receipts excluding borrowings', 'Imports and exports', 'Revenue and capital', 'Savings and investment'], 0, 'It indicates government borrowing needs.', 2]
  ],

  gk_static: [
    ['The national animal of India is the:', ['Royal Bengal Tiger', 'Lion', 'Elephant', 'Peacock'], 0, 'Declared in 1973.', 1],
    ['The headquarters of the United Nations is in:', ['New York', 'Geneva', 'Paris', 'Vienna'], 0, 'On the East River in Manhattan.', 1],
    ['Which is the largest ocean in the world?', ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], 0, 'It covers about a third of the Earth’s surface.', 1],
    ['The currency of Japan is the:', ['Yen', 'Won', 'Yuan', 'Ringgit'], 0, 'The Won is Korean and the Yuan Chinese.', 1],
    ['"Jana Gana Mana" was written by:', ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Muhammad Iqbal'], 0, 'Adopted as the national anthem in 1950.', 1],
    ['The headquarters of the World Health Organization is in:', ['Geneva', 'New York', 'Rome', 'Paris'], 0, 'Switzerland.', 1],
    ['The national flower of India is the:', ['Lotus', 'Rose', 'Marigold', 'Sunflower'], 0, 'Nelumbo nucifera.', 1],
    ['Which planet is closest to the Sun?', ['Mercury', 'Venus', 'Earth', 'Mars'], 0, 'Mercury orbits closest.', 1],
    ['The Taj Mahal was built by:', ['Shah Jahan', 'Akbar', 'Aurangzeb', 'Humayun'], 0, 'In memory of Mumtaz Mahal.', 1],
    ['Which is the longest river in the world?', ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], 0, 'About 6,650 km.', 1]
  ],

  gk_sports: [
    ['The Olympic Games are held every:', ['Four years', 'Two years', 'Three years', 'Five years'], 0, 'Summer and Winter Games alternate every two years.', 1],
    ['The term "Googly" is associated with:', ['Cricket', 'Hockey', 'Football', 'Tennis'], 0, 'A leg-spinner’s delivery that turns the other way.', 1],
    ['The Bharat Ratna is India’s highest:', ['Civilian award', 'Military award', 'Sports award', 'Literary award'], 0, 'Instituted in 1954.', 1],
    ['The Davis Cup is associated with:', ['Tennis', 'Badminton', 'Golf', 'Table tennis'], 0, 'An international men’s team tennis event.', 1],
    ['How many players are there in a kabaddi team on the court?', ['Seven', 'Nine', 'Eleven', 'Five'], 0, 'Seven on court with substitutes on the bench.', 1],
    ['The Nobel Prize is NOT awarded in which field?', ['Mathematics', 'Physics', 'Literature', 'Peace'], 0, 'The Fields Medal serves mathematics instead.', 1],
    ['The Dronacharya Award is given to:', ['Coaches', 'Players', 'Referees', 'Administrators'], 0, 'For outstanding coaching in sports.', 2],
    ['The Thomas Cup is contested in:', ['Badminton', 'Tennis', 'Squash', 'Hockey'], 0, 'The men’s international team badminton championship.', 2]
  ],

  banking_aware: [
    ['The regulator of banks in India is the:', ['Reserve Bank of India', 'SEBI', 'IRDAI', 'NABARD'], 0, 'RBI is the central bank and banking regulator.', 1],
    ['CRR stands for:', ['Cash Reserve Ratio', 'Credit Reserve Ratio', 'Current Repo Rate', 'Cash Repo Ratio'], 0, 'The share of deposits banks must keep with the RBI.', 1],
    ['NEFT stands for:', ['National Electronic Funds Transfer', 'New Electronic Fund Transaction', 'National Exchange for Transfers', 'Net Electronic Finance Transfer'], 0, 'A retail electronic payment system.', 1],
    ['KYC in banking stands for:', ['Know Your Customer', 'Keep Your Cash', 'Known Yield Certificate', 'Key Yearly Check'], 0, 'Customer identification norms.', 1],
    ['Which organisation insures bank deposits in India?', ['DICGC', 'SEBI', 'IRDAI', 'NABARD'], 0, 'Deposit Insurance and Credit Guarantee Corporation.', 2],
    ['SLR stands for:', ['Statutory Liquidity Ratio', 'Standard Lending Rate', 'Secured Loan Ratio', 'Savings Liquidity Reserve'], 0, 'The portion of deposits held in liquid assets.', 1],
    ['A cheque that has crossed its validity period is called:', ['Stale cheque', 'Post-dated cheque', 'Bearer cheque', 'Crossed cheque'], 0, 'Cheques are valid for three months from the date of issue.', 2],
    ['NABARD primarily supports:', ['Rural and agricultural development', 'Stock markets', 'Insurance firms', 'Foreign trade'], 0, 'National Bank for Agriculture and Rural Development.', 1],
    ['RTGS is used for:', ['High-value real-time settlements', 'Small retail transfers only', 'Cheque clearance', 'Loan disbursal only'], 0, 'Real Time Gross Settlement has a minimum transaction value.', 2],
    ['The first bank established in India was:', ['Bank of Hindustan', 'State Bank of India', 'Punjab National Bank', 'Reserve Bank of India'], 0, 'Founded in 1770 in Calcutta.', 2]
  ],

  railway_gk: [
    ['Indian Railways was introduced in which year?', ['1853', '1869', '1900', '1947'], 0, 'The first train ran between Bombay and Thane in 1853.', 1],
    ['The headquarters of Indian Railways is in:', ['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'], 0, 'Rail Bhavan, New Delhi.', 1],
    ['The broad gauge used by Indian Railways measures:', ['1676 mm', '1435 mm', '1000 mm', '762 mm'], 0, 'Indian broad gauge is 5 ft 6 in.', 2],
    ['The longest railway platform in India is at:', ['Hubballi', 'Gorakhpur', 'Kharagpur', 'Kollam'], 0, 'Shree Siddharoodha Swamiji Station, Hubballi.', 2],
    ['Which is the fastest category of train service in India?', ['Vande Bharat Express', 'Rajdhani Express', 'Shatabdi Express', 'Duronto Express'], 0, 'Vande Bharat trainsets have the highest operating speeds.', 1],
    ['The first metro rail in India was started in:', ['Kolkata', 'Delhi', 'Mumbai', 'Chennai'], 0, 'Kolkata Metro began in 1984.', 1],
    ['The National Rail Museum is located in:', ['New Delhi', 'Mumbai', 'Chennai', 'Pune'], 0, 'At Chanakyapuri, New Delhi.', 2],
    ['How many railway zones does Indian Railways have (approximately)?', ['18', '12', '9', '24'], 0, 'Indian Railways operates 18 zones plus the Kolkata Metro zone.', 2]
  ],

  social_science: [
    ['Democracy literally means rule by:', ['The people', 'A king', 'The army', 'Religious leaders'], 0, 'From the Greek demos and kratos.', 1],
    ['Which of these is a renewable resource?', ['Solar energy', 'Coal', 'Natural gas', 'Petroleum'], 0, 'It is continuously available.', 1],
    ['The main occupation of people in rural India is:', ['Agriculture', 'Mining', 'Trade', 'Manufacturing'], 0, 'Agriculture employs the largest share.', 1],
    ['Latitude lines run:', ['East–west, parallel to the Equator', 'North–south through the poles', 'Diagonally', 'Only across oceans'], 0, 'Longitudes run north–south.', 1],
    ['The three organs of government are:', ['Legislature, executive and judiciary', 'President, PM and Governor', 'Centre, state and local', 'Police, army and courts'], 0, 'This is the separation of powers.', 1],
    ['The Industrial Revolution began in:', ['Britain', 'France', 'Germany', 'The USA'], 0, 'In the late 18th century.', 2],
    ['Which layer of the atmosphere contains the ozone layer?', ['Stratosphere', 'Troposphere', 'Mesosphere', 'Thermosphere'], 0, 'Roughly 15–35 km above the surface.', 2]
  ]

  };
})(window);
