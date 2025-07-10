import { WeightComparison } from '../types/workout';

export const weightComparisons = [
  { name: "bag of sugar", weight: 4, plural: "bags of sugar", category: "objects" },
  { name: "laptop", weight: 5, plural: "laptops", category: "objects" },
  { name: "newborn baby", weight: 7, plural: "newborn babies", category: "people" },
  { name: "gallon of milk", weight: 8, plural: "gallons of milk", category: "objects" },
  { name: "house cat", weight: 12, plural: "house cats", category: "animals" },
  { name: "bowling ball", weight: 15, plural: "bowling balls", category: "objects" },
  { name: "bicycle", weight: 25, plural: "bicycles", category: "vehicles" },
  { name: "golden retriever", weight: 65, plural: "golden retrievers", category: "animals" },
  { name: "average person", weight: 150, plural: "average people", category: "people" },
  { name: "washing machine", weight: 180, plural: "washing machines", category: "objects" },
  { name: "Frank Zane", weight: 185, plural: "Frank Zanes", category: "people" },
  { name: "Iron Man Mark 50 suit", weight: 200, plural: "Iron Man Mark 50 suits", category: "marvel" },
  { name: "chest freezer", weight: 200, plural: "chest freezers", category: "objects" },
  { name: "giant panda", weight: 220, plural: "giant pandas", category: "animals" },
  { name: "medieval knight (in armor)", weight: 220, plural: "medieval knights (in armor)", category: "people" },
  { name: "Chris Bumstead", weight: 225, plural: "Chris Bumsteads", category: "people" },
  { name: "Arnold Schwarzenegger", weight: 235, plural: "Arnold Schwarzeneggers", category: "people" },
  { name: "NFL linebacker", weight: 245, plural: "NFL linebackers", category: "people" },
  { name: "refrigerator", weight: 250, plural: "refrigerators", category: "objects" },
  { name: "Larry Wheels", weight: 255, plural: "Larry Wheels", category: "people" },
  { name: "NBA center", weight: 280, plural: "NBA centers", category: "people" },
  { name: "Ronnie Coleman", weight: 295, plural: "Ronnie Colemans", category: "people" },
  { name: "adult tiger", weight: 300, plural: "adult tigers", category: "animals" },
  { name: "arcade machine", weight: 300, plural: "arcade machines", category: "objects" },
  { name: "motorcycle", weight: 350, plural: "motorcycles", category: "vehicles" },
  { name: "piano", weight: 400, plural: "pianos", category: "objects" },
  { name: "Terminator T-800", weight: 400, plural: "Terminator T-800s", category: "terminator" },
  { name: "Eddie Hall", weight: 400, plural: "Eddie Halls", category: "people" },
  { name: "Chewbacca", weight: 400, plural: "Chewbaccas", category: "star-wars" },
  { name: "blue whale heart", weight: 400, plural: "blue whale hearts", category: "animals" },
  { name: "Iron Man Mark 85 suit", weight: 425, plural: "Iron Man Mark 85 suits", category: "marvel" },
  { name: "silverback gorilla", weight: 440, plural: "silverback gorillas", category: "animals" },
  { name: "Olympic barbell with plates", weight: 495, plural: "Olympic barbells with plates", category: "objects" },
  { name: "Predator / Yautja", weight: 500, plural: "Predators / Yautja", category: "predator" },
  { name: "snowmobile", weight: 500, plural: "snowmobiles", category: "vehicles" },
  { name: "adult cow", weight: 500, plural: "adult cows", category: "animals" },
  { name: "Predalien", weight: 575, plural: "Predaliens", category: "alien" },
  { name: "ATV", weight: 600, plural: "ATVs", category: "vehicles" },
  { name: "Xenomorph", weight: 600, plural: "Xenomorphs", category: "alien" },
  { name: "grizzly bear", weight: 600, plural: "grizzly bears", category: "animals" },
  { name: "commercial gym rack", weight: 600, plural: "commercial gym racks", category: "objects" },
  { name: "giant squid", weight: 600, plural: "giant squids", category: "animals" },
  { name: "vending machine", weight: 700, plural: "vending machines", category: "objects" },
  { name: "pool table", weight: 700, plural: "pool tables", category: "objects" },
  { name: "Beholder", weight: 750, plural: "Beholders", category: "dnd" },
  { name: "jet ski", weight: 800, plural: "jet skis", category: "vehicles" },
  { name: "powerlifting platform", weight: 800, plural: "powerlifting platforms", category: "objects" },
  { name: "hot tub", weight: 800, plural: "hot tubs", category: "objects" },
  { name: "Thanos", weight: 985, plural: "Thanoses", category: "marvel" },
  { name: "polar bear", weight: 990, plural: "polar bears", category: "animals" },
  { name: "horse", weight: 1000, plural: "horses", category: "animals" },
  { name: "small car", weight: 1200, plural: "small cars", category: "vehicles" },
  { name: "Iron Man Mark III Suit", weight: 1200, plural: "Iron Man Mark III Suits", category: "marvel" },
  { name: "Groot (adult)", weight: 1200, plural: "adult Groots", category: "marvel" },
  { name: "manatee", weight: 1200, plural: "manatees", category: "animals" },
  { name: "Space Marine Bike", weight: 1200, plural: "Space Marine Bikes", category: "warhammer-40k" },
  { name: "Jabba the Hutt", weight: 1300, plural: "Jabba the Hutts", category: "star-wars" },
  { name: "The Hulk", weight: 1400, plural: "The Hulks", category: "marvel" },
  { name: "Adeptus Custodes", weight: 1500, plural: "Adeptus Custodes", category: "warhammer-40k" },
  { name: "adult giraffe", weight: 1500, plural: "adult giraffes", category: "animals" },
  { name: "Hippogriff", weight: 1500, plural: "Hippogriffs", category: "harry-potter" },
  { name: "Nazgûl on Fellbeast", weight: 2200, plural: "Nazgûl on Fellbeasts", category: "lord-of-the-rings" },
  
  // NEW ADDITIONS - Vehicles & Transportation
  { name: "Volkswagen Beetle", weight: 2400, plural: "Volkswagen Beetles" },
  { name: "DeLorean time machine", weight: 2718, plural: "DeLorean time machines" },
  { name: "Honda Civic", weight: 2900, plural: "Honda Civics" },
  { name: "small elephant", weight: 3000, plural: "small elephants" },
  { name: "Lotus Emira", weight: 3097, plural: "Lotus Emiras" },
  { name: "Koenigsegg Jesko", weight: 3131, plural: "Koenigsegg Jeskos" },
  { name: "Halo Warthog", weight: 3200, plural: "Halo Warthogs" },
  { name: "McLaren Artura", weight: 3306, plural: "McLaren Arturas" },
  
  // NEW WARHAMMER 40K - Small Vehicles
  { name: "Imperial Guard Sentinel", weight: 3500, plural: "Imperial Guard Sentinels" },
  
  // NEW ADDITIONS - Dinosaurs
  { name: "Carnotaurus", weight: 3500, plural: "Carnotaurus" },
  { name: "Ant-Man (giant form)", weight: 3500, plural: "giant Ant-Men" },
  { name: "Ferrari 296 GTB", weight: 3535, plural: "Ferrari 296 GTBs" },
  { name: "Lamborghini Huracán Tecnica", weight: 3615, plural: "Lamborghini Huracán Tecnicas" },
  { name: "Porsche 911 Turbo S", weight: 3750, plural: "Porsche 911 Turbo S" },
  { name: "Audi R8 V10 Performance", weight: 3957, plural: "Audi R8 V10 Performances" },
  { name: "walrus", weight: 4000, plural: "walruses" },
  { name: "Drogon", weight: 4000, plural: "Drogons" },
  { name: "Rancor", weight: 4000, plural: "Rancors" },
  { name: "Aston Martin DBS Superleggera", weight: 4100, plural: "Aston Martin DBS Superleggaras" },
  { name: "The Mountain (Gregor Clegane)", weight: 420, plural: "Mountains" },
  { name: "Chevrolet Corvette Z06", weight: 4300, plural: "Chevrolet Corvette Z06s" },
  { name: "Bugatti Chiron", weight: 4398, plural: "Bugatti Chirons" },
  
  // NEW ADDITIONS - Trucks & Heavy Vehicles
  { name: "Ford F-150", weight: 4500, plural: "Ford F-150s" },
  { name: "Nissan GT-R NISMO", weight: 4500, plural: "Nissan GT-R NISMOs" },
  { name: "Balrog", weight: 4500, plural: "Balrogs" },
  { name: "Tesla Model S Plaid", weight: 4766, plural: "Tesla Model S Plaids" },
  
  // NEW WARHAMMER 40K - Medium Vehicles
  { name: "Space Marine Land Speeder", weight: 4800, plural: "Space Marine Land Speeders" },
  { name: "Tau XV8 Crisis Battlesuit", weight: 4800, plural: "Tau XV8 Crisis Battlesuits" },
  
  { name: "Bentley Continental GT Speed", weight: 4900, plural: "Bentley Continental GT Speeds" },
  { name: "pickup truck", weight: 5000, plural: "pickup trucks" },
  { name: "great white shark", weight: 5000, plural: "great white sharks" },
  { name: "Hungarian Horntail dragon", weight: 5000, plural: "Hungarian Horntail dragons" },
  { name: "Humvee", weight: 5200, plural: "Humvees" },
  { name: "Gelatinous Cube", weight: 5450, plural: "Gelatinous Cubes" },
  { name: "Chevy Suburban", weight: 5600, plural: "Chevy Suburbans" },
  
  // NEW ADDITIONS - Dinosaurs continued
  { name: "Parasaurolophus", weight: 6000, plural: "Parasaurolophus" },
  { name: "Halo Scorpion Tank", weight: 6000, plural: "Halo Scorpion Tanks" },
  { name: "ambulance", weight: 7000, plural: "ambulances" },
  { name: "Iguanodon", weight: 7000, plural: "Iguanodons" },
  { name: "RV motorhome", weight: 7500, plural: "RV motorhomes" },
  { name: "adult elephant", weight: 8000, plural: "adult elephants" },
  { name: "Ankylosaurus", weight: 8000, plural: "Ankylosaurus" },
  { name: "Minecraft Ender Dragon", weight: 8000, plural: "Minecraft Ender Dragons" },
  { name: "Barad-dûr (Sauron's tower)", weight: 8000000000, plural: "Barad-dûrs" },
  { name: "fire truck", weight: 8500, plural: "fire trucks" },

  // NEW ADDITIONS - Fictional Characters
  { name: "Optimus Prime", weight: 8800, plural: "Optimus Primes" },
  { name: "garbage truck", weight: 9000, plural: "garbage trucks" },
  { name: "Alduin", weight: 9000, plural: "Alduins" },
  { name: "Stegosaurus", weight: 10000, plural: "Stegosaurus" },
  { name: "Megatron", weight: 12000, plural: "Megatrons" },
  { name: "orca whale", weight: 12000, plural: "orca whales" },
  { name: "AT-ST Walker", weight: 12000, plural: "AT-ST Walkers" },
  
  // NEW WARHAMMER 40K - Tyranids
  { name: "Tyranid Warrior", weight: 15000, plural: "Tyranid Warriors" },
  { name: "school bus", weight: 15000, plural: "school buses" },
  { name: "Spinosaurus", weight: 15000, plural: "Spinosaurus" },
  { name: "Oliphaunt", weight: 15000, plural: "Oliphaunts" },
  { name: "Adult Triceratops", weight: 16000, plural: "Adult Triceratops" },
  { name: "Xenomorph Queen", weight: 19800, plural: "Xenomorph Queens" },
  { name: "Kenworth T680 Semi Truck", weight: 20000, plural: "Kenworth T680 Semi Trucks" },
  { name: "T-Rex", weight: 20000, plural: "T-Rex" },
  { name: "King Kong", weight: 20000, plural: "King Kongs" },
  { name: "Freightliner Cascadia Semi Truck", weight: 21000, plural: "Freightliner Cascadia Semi Trucks" },
  { name: "Black Hawk Helicopter", weight: 22000, plural: "Black Hawk Helicopters" },
  
  // NEW WARHAMMER 40K - APCs and Tanks
  { name: "Rhino APC", weight: 22000, plural: "Rhino APCs" },
  { name: "Tau XV88 Broadside Battlesuit", weight: 22000, plural: "Tau XV88 Broadside Battlesuits" },
  
  // NEW ADDITIONS - Military & Aircraft
  { name: "Apache helicopter", weight: 23000, plural: "Apache helicopters" },
  { name: "Diplodocus", weight: 25000, plural: "Diplodocus" },
  { name: "M3 Stuart tank", weight: 28500, plural: "M3 Stuart tanks" },
  
  // NEW WARHAMMER 40K - Heavy Tanks
  { name: "Predator Tank", weight: 35000, plural: "Predator Tanks" },
  
  // NEW ADDITIONS - Heavy Equipment
  { name: "bulldozer", weight: 35000, plural: "bulldozers" },
  { name: "F-16 fighter jet", weight: 37000, plural: "F-16 fighter jets" },
  { name: "excavator", weight: 40000, plural: "excavators" },
  { name: "Minecraft Block of Gold", weight: 42549, plural: "Minecraft Blocks of Gold" },
  
  // NEW WARHAMMER 40K - Tyranids Large
  { name: "Tyranid Carnifex", weight: 44000, plural: "Tyranid Carnifexes" },
  { name: "Ork Warboss", weight: 50000, plural: "Ork Warbosses" },
  { name: "Quinjet", weight: 50000, plural: "Quinjets" },
  { name: "crane", weight: 50000, plural: "cranes" },
  
  // NEW WARHAMMER 40K - Super Heavy Vehicles
  { name: "Land Raider", weight: 55000, plural: "Land Raiders" },
  
  { name: "locomotive engine", weight: 60000, plural: "locomotive engines" },
  { name: "Sandcrawler", weight: 60000, plural: "Sandcrawlers" },
  { name: "Hogwarts Express", weight: 80000, plural: "Hogwarts Express trains" },
  
  // NEW WARHAMMER 40K - Battle Tanks
  { name: "Leman Russ Battle Tank", weight: 88000, plural: "Leman Russ Battle Tanks" },
  { name: "Brachiosaurus", weight: 88000, plural: "Brachiosaurus" },
  { name: "Godzilla", weight: 90000, plural: "Godzillas" },
  
  // NEW WARHAMMER 40K - Tau Super Heavy
  { name: "Tau XV104 Riptide Battlesuit", weight: 110000, plural: "Tau XV104 Riptide Battlesuits" },
  
  { name: "Helicarrier", weight: 135000000, plural: "Helicarriers" },
  { name: "M1 Abrams Tank", weight: 138900, plural: "M1 Abrams Tanks" },
  
  // NEW ADDITIONS - Aircraft
  { name: "Boeing 737", weight: 150000, plural: "Boeing 737s" },
  
  // NEW WARHAMMER 40K - Tyranids Massive
  { name: "Tyranid Hierophant Bio-Titan", weight: 220000, plural: "Tyranid Hierophant Bio-Titans" },
  
  { name: "Boeing 747", weight: 400000, plural: "Boeing 747s" },
  
  // NEW WARHAMMER 40K - Super Heavy Tanks
  { name: "Baneblade Super Heavy Tank", weight: 440000, plural: "Baneblade Super Heavy Tanks" },
  { name: "Tau KX139 Ta'unar Supremacy Armour", weight: 550000, plural: "Tau KX139 Ta'unar Supremacy Armours" },
  
  { name: "Airbus A380", weight: 600000, plural: "Airbus A380s" },
  { name: "Hogwarts Castle", weight: 750000000, plural: "Hogwarts Castles" },
  
  // NEW WARHAMMER 40K - Titans
  { name: "Warhound Scout Titan", weight: 880000, plural: "Warhound Scout Titans" },

  // Sports Equipment & Athletes
  { name: "king size mattress", weight: 150, plural: "king size mattresses" },
  
  // Movie Characters - CLEAN NAMES
  
  // Household Items
  
  // Animals
  
  // Additional Specific Selections
  
  // HARRY POTTER ADDITIONS
  
  // MINECRAFT ADDITIONS
  
  // LORD OF THE RINGS ADDITIONS
  
  // GAME OF THRONES ADDITIONS
  { name: "Iron Throne", weight: 2750, plural: "Iron Thrones" },
  
  // STAR WARS ADDITIONS
  { name: "AT-AT Walker", weight: 1500000, plural: "AT-AT Walkers" },
  
  // POKEMON ADDITIONS
  { name: "Blastoise", weight: 414, plural: "Blastoises" },
  { name: "Charizard", weight: 441, plural: "Charizards" },
  { name: "Venusaur", weight: 485, plural: "Venusaurs" },
  { name: "Garchomp", weight: 461, plural: "Garchomps" },
  { name: "Onix", weight: 463, plural: "Onixes" },
  { name: "Salamence", weight: 248, plural: "Salamences" },
  { name: "Rhydon", weight: 265, plural: "Rhydons" },
  { name: "Mewtwo", weight: 269, plural: "Mewtwos" },
  { name: "Slaking", weight: 287, plural: "Slakings" },
  { name: "Ho-Oh", weight: 438, plural: "Ho-Ohs" },
  { name: "Tyranitar", weight: 445, plural: "Tyranitars" },
  { name: "Rayquaza", weight: 455, plural: "Rayquazas" },
  { name: "Snorlax", weight: 1014, plural: "Snorlaxes" },
  { name: "Dragonite", weight: 463, plural: "Dragonites" },
  { name: "Lugia", weight: 476, plural: "Lugias" },
  { name: "Lapras", weight: 485, plural: "Laprases" },
  { name: "Gyarados", weight: 518, plural: "Gyaradoses" },
  { name: "Golem", weight: 661, plural: "Golems" },
  { name: "Arceus", weight: 705, plural: "Arceuses" },
  { name: "Reshiram", weight: 727, plural: "Reshirams" },
  { name: "Palkia", weight: 740, plural: "Palkias" },
  { name: "Zekrom", weight: 760, plural: "Zekroms" },
  { name: "Kyogre", weight: 776, plural: "Kyogres" },
  { name: "Aggron", weight: 793, plural: "Aggrons" },
  { name: "Wailord", weight: 1933, plural: "Wailords" },
  { name: "Steelix", weight: 881, plural: "Steelixes" },
  { name: "Regigigas", weight: 925, plural: "Regigigases" },
  { name: "Groudon", weight: 950, plural: "Groudons" },
  { name: "Metagross", weight: 1212, plural: "Metagrosses" },
  { name: "Dialga", weight: 1505, plural: "Dialgas" },
  { name: "Giratina", weight: 1653, plural: "Giratinas" },
  { name: "Eternatus", weight: 2094, plural: "Eternatuses" },
  { name: "Celesteela", weight: 2204, plural: "Celesteelas" },

  // ZELDA ADDITIONS
  { name: "Ganondorf", weight: 140, plural: "Ganondorfs" },
  
  // D&D ADDITIONS

  // FAMOUS BUILDINGS AND MONUMENTS - UPDATED NAMES
  
  // Small Monuments & Statues
  { name: "David statue (Michelangelo)", weight: 12478, plural: "David statues (Michelangelo)" },
  { name: "Wall St Charging Bull", weight: 7100, plural: "Wall St Charging Bulls" },
  { name: "Fearless Girl statue", weight: 550, plural: "Fearless Girl statues" },
  { name: "Lincoln Memorial statue", weight: 175000, plural: "Lincoln Memorial statues" },
  { name: "Mount Rushmore head (single)", weight: 4000000, plural: "Mount Rushmore heads (single)" },
  
  // Medium Monuments
  { name: "Statue of Liberty (copper)", weight: 450000, plural: "Statue of Liberty (copper)" },
  { name: "Christ the Redeemer statue", weight: 1145000, plural: "Christ the Redeemer statues" },
  { name: "Angel of the North", weight: 440000, plural: "Angel of the North statues" },
  { name: "Moai statue (Easter Island)", weight: 28000, plural: "Moai statues (Easter Island)" },
  { name: "Sphinx of Giza", weight: 44000000, plural: "Sphinx of Giza" },
  
  // Large Monuments & Structures
  { name: "Washington Monument", weight: 180000000, plural: "Washington Monuments" },
  { name: "Leaning Tower of Pisa", weight: 32000000, plural: "Leaning Towers of Pisa" },
  { name: "Big Ben clock tower", weight: 13760000, plural: "Big Ben clock towers" },
  { name: "Arc de Triomphe", weight: 100000000, plural: "Arc de Triomphe" },
  { name: "St Louis Gateway Arch", weight: 38600000, plural: "St Louis Gateway Arches" },
  
  // Massive Structures
  { name: "Eiffel Tower", weight: 20000000, plural: "Eiffel Towers" },
  { name: "Sydney Opera House", weight: 320000000, plural: "Sydney Opera Houses" },
  { name: "Golden Gate Bridge", weight: 1700000000, plural: "Golden Gate Bridges" },
  { name: "Brooklyn Bridge", weight: 270000000, plural: "Brooklyn Bridges" },
  { name: "Tower Bridge", weight: 70000000, plural: "Tower Bridges" },
  
  // Ancient Wonders & Pyramids
  { name: "Great Pyramid of Giza", weight: 12700000000, plural: "Great Pyramids of Giza" },
  { name: "Pyramid of Khafre", weight: 9600000000, plural: "Pyramids of Khafre" },
  { name: "Step Pyramid of Djoser", weight: 850000000, plural: "Step Pyramids of Djoser" },
  { name: "Parthenon", weight: 70000000, plural: "Parthenons" },
  { name: "Colosseum", weight: 1200000000, plural: "Colosseums" },
  
  // Modern Skyscrapers (structural weight only)
  { name: "Empire State Building", weight: 730000000, plural: "Empire State Buildings" },
  { name: "Chrysler Building", weight: 390000000, plural: "Chrysler Buildings" },
  { name: "One World Trade Center", weight: 1776000000, plural: "One World Trade Centers" },
  { name: "Sears Tower", weight: 500000000, plural: "Sears Towers" },
  { name: "Burj Khalifa", weight: 1100000000, plural: "Burj Khalifas" },
  
  // Religious Buildings
  { name: "Notre-Dame Cathedral", weight: 210000000, plural: "Notre-Dame Cathedrals" },
  { name: "St. Peter's Basilica", weight: 320000000, plural: "St. Peter's Basilicas" },
  { name: "Westminster Abbey", weight: 180000000, plural: "Westminster Abbeys" },
  { name: "Sagrada Familia", weight: 290000000, plural: "Sagrada Familias" },
  { name: "Taj Mahal", weight: 110000000, plural: "Taj Mahals" },
  
  // Castles & Fortresses
  { name: "Neuschwanstein Castle", weight: 85000000, plural: "Neuschwanstein Castles" },
  { name: "Windsor Castle (Great Tower)", weight: 45000000, plural: "Windsor Castles (Great Tower)" },
  { name: "Edinburgh Castle", weight: 120000000, plural: "Edinburgh Castles" },
  { name: "Château de Versailles", weight: 180000000, plural: "Château de Versailles" },
  { name: "Tower of London", weight: 35000000, plural: "Tower of London" },
  
  // Dams & Engineering Marvels
  { name: "Hoover Dam", weight: 13200000000, plural: "Hoover Dams" },
  { name: "Three Gorges Dam", weight: 144000000000, plural: "Three Gorges Dams" },
  { name: "Panama Canal lock gate", weight: 1500000, plural: "Panama Canal lock gates" },
  { name: "Mount Rushmore", weight: 16000000000, plural: "Mount Rushmores" },
  
  // Lighthouses & Towers
  { name: "Lighthouse of Alexandria", weight: 45000000, plural: "Lighthouse of Alexandria" },
  { name: "CN Tower", weight: 260000000, plural: "CN Towers" },
  { name: "Space Needle", weight: 19550000, plural: "Space Needles" },
  { name: "Tokyo Tower", weight: 8800000, plural: "Tokyo Towers" },
  { name: "Statue of Unity", weight: 1700000, plural: "Statue of Unity" },
  
  // Bridges (smaller sections)
  { name: "London Bridge (single span)", weight: 15000000, plural: "London Bridge (single span)" },
  { name: "Rialto Bridge", weight: 8000000, plural: "Rialto Bridges" },
  { name: "Pont du Gard", weight: 50000000, plural: "Pont du Gard" },
  { name: "Millau Bridge tower", weight: 36000000, plural: "Millau Bridge towers" },
  
  // Unique Structures
  { name: "Hollywood Sign", weight: 480000, plural: "Hollywood Signs" },
  { name: "Christ the Redeemer pedestal", weight: 2200000, plural: "Christ the Redeemer pedestals" },
  { name: "The Brussels Atomium", weight: 2400000, plural: "The Brussels Atomiums" },
  { name: "The Chicago Bean", weight: 240000, plural: "The Chicago Beans" },
  { name: "Stonehenge trilithon", weight: 100000, plural: "Stonehenge trilithons" },
  
  // Stadium Structures
  { name: "Roman Colosseum arena floor", weight: 15000000, plural: "Roman Colosseum arena floors" },
  { name: "Wembley Stadium arch", weight: 3300000, plural: "Wembley Stadium arches" },
  { name: "Olympic Stadium cauldron", weight: 165000, plural: "Olympic Stadium cauldrons" },
  
  // Palace Components
  { name: "Buckingham Palace facade", weight: 25000000, plural: "Buckingham Palace facades" },
  { name: "Palace of Versailles Hall of Mirrors", weight: 8000000, plural: "Palace of Versailles Hall of Mirrors" },
  { name: "Forbidden City main hall", weight: 45000000, plural: "Forbidden City main halls" },
  
  // Modern Art & Sculptures
  { name: "Kelpies (Scotland)", weight: 600000, plural: "Kelpies (Scotland)" },
  { name: "ArcelorMittal Orbit", weight: 1400000, plural: "ArcelorMittal Orbit" },
  { name: "Motherland Calls statue", weight: 17400000, plural: "Motherland Calls statues" },
  { name: "Spring Temple Buddha", weight: 2000000, plural: "Spring Temple Buddha" },

  // ROCKETS AND SPACE VEHICLES
  
  // Small Spacecraft & Components
  { name: "Sputnik 1", weight: 184, plural: "Sputnik 1 satellites" },
  { name: "Hubble Space Telescope", weight: 24500, plural: "Hubble Space Telescopes" },
  { name: "James Webb Space Telescope", weight: 14300, plural: "James Webb Space Telescopes" },
  { name: "Voyager 1 probe", weight: 1592, plural: "Voyager 1 probes" },
  { name: "Cassini spacecraft", weight: 12593, plural: "Cassini spacecraft" },
  { name: "New Horizons probe", weight: 1054, plural: "New Horizons probes" },
  { name: "Parker Solar Probe", weight: 1510, plural: "Parker Solar Probes" },
  { name: "Perseverance Mars rover", weight: 2260, plural: "Perseverance Mars rovers" },
  { name: "Curiosity Mars rover", weight: 1982, plural: "Curiosity Mars rovers" },
  { name: "Apollo Command Module", weight: 13000, plural: "Apollo Command Modules" },
  { name: "Apollo Lunar Module", weight: 33500, plural: "Apollo Lunar Modules" },
  { name: "Orion spacecraft", weight: 57000, plural: "Orion spacecraft" },
  { name: "Dragon spacecraft", weight: 13228, plural: "Dragon spacecraft" },
  { name: "Crew Dragon", weight: 27400, plural: "Crew Dragons" },
  { name: "Starliner spacecraft", weight: 28000, plural: "Starliner spacecraft" },
  
  // Medium Rockets & Launchers
  { name: "Falcon 1 rocket", weight: 60000, plural: "Falcon 1 rockets" },
  { name: "Electron rocket", weight: 28000, plural: "Electron rockets" },
  { name: "Vega rocket", weight: 300000, plural: "Vega rockets" },
  { name: "Atlas V rocket (401)", weight: 730000, plural: "Atlas V rockets (401)" },
  { name: "Delta IV Medium", weight: 628000, plural: "Delta IV Medium rockets" },
  { name: "Antares rocket", weight: 590000, plural: "Antares rockets" },
  { name: "Soyuz rocket", weight: 660000, plural: "Soyuz rockets" },
  { name: "Proton rocket", weight: 1430000, plural: "Proton rockets" },
  { name: "Long March 3B", weight: 1070000, plural: "Long March 3B rockets" },
  { name: "H-IIA rocket", weight: 570000, plural: "H-IIA rockets" },
  
  // Large Rockets
  { name: "Falcon 9 rocket", weight: 1207000, plural: "Falcon 9 rockets" },
  { name: "Falcon Heavy rocket", weight: 3125000, plural: "Falcon Heavy rockets" },
  { name: "Delta IV Heavy", weight: 1616000, plural: "Delta IV Heavy rockets" },
  { name: "Ariane 5 rocket", weight: 1700000, plural: "Ariane 5 rockets" },
  { name: "Ariane 6 rocket", weight: 1800000, plural: "Ariane 6 rockets" },
  { name: "Space Shuttle (full stack)", weight: 4400000, plural: "Space Shuttles (full stack)" },
  { name: "Space Shuttle Orbiter", weight: 165000, plural: "Space Shuttle Orbiters" },
  { name: "Space Shuttle External Tank", weight: 1680000, plural: "Space Shuttle External Tanks" },
  { name: "Space Shuttle SRB", weight: 1300000, plural: "Space Shuttle SRBs" },
  
  // Massive Rockets
  { name: "Saturn IB rocket", weight: 1300000, plural: "Saturn IB rockets" },
  { name: "Saturn V rocket", weight: 6200000, plural: "Saturn V rockets" },
  { name: "Saturn V first stage (S-IC)", weight: 5040000, plural: "Saturn V first stages (S-IC)" },
  { name: "Saturn V second stage (S-II)", weight: 1060000, plural: "Saturn V second stages (S-II)" },
  { name: "Saturn V third stage (S-IVB)", weight: 262000, plural: "Saturn V third stages (S-IVB)" },
  { name: "SLS rocket (Block 1)", weight: 5750000, plural: "SLS rockets (Block 1)" },
  { name: "Starship (full stack)", weight: 11000000, plural: "Starships (full stack)" },
  { name: "Starship vehicle", weight: 2200000, plural: "Starship vehicles" },
  { name: "Super Heavy booster", weight: 8800000, plural: "Super Heavy boosters" },
  { name: "N1 Rocket", weight: 6200000, plural: "N1 Rockets" },
  { name: "Energia rocket", weight: 4400000, plural: "Energia rockets" },
  
  // Space Stations & Large Structures
  { name: "International Space Station", weight: 925000, plural: "International Space Stations" },
  { name: "ISS Unity module", weight: 25600, plural: "ISS Unity modules" },
  { name: "ISS Destiny lab", weight: 32000, plural: "ISS Destiny labs" },
  { name: "ISS Zarya module", weight: 42600, plural: "ISS Zarya modules" },
  { name: "ISS Zvezda module", weight: 42050, plural: "ISS Zvezda modules" },
  { name: "Skylab space station", weight: 169950, plural: "Skylab space stations" },
  { name: "Mir space station", weight: 286000, plural: "Mir space stations" },
  { name: "Salyut 1 space station", weight: 40700, plural: "Salyut 1 space stations" },
  { name: "Tiangong space station", weight: 180000, plural: "Tiangong space stations" },
  
  // STAR WARS SPACESHIPS
  
  // Small Fighters & Ships
  { name: "TIE Fighter", weight: 13200, plural: "TIE Fighters" },
  { name: "TIE Interceptor", weight: 11200, plural: "TIE Interceptors" },
  { name: "TIE Bomber", weight: 16500, plural: "TIE Bombers" },
  { name: "TIE Advanced x1", weight: 15400, plural: "TIE Advanced x1s" },
  { name: "X-wing starfighter", weight: 27500, plural: "X-wing starfighters" },
  { name: "Y-wing bomber", weight: 55000, plural: "Y-wing bombers" },
  { name: "A-wing interceptor", weight: 17600, plural: "A-wing interceptors" },
  { name: "B-wing heavy fighter", weight: 99000, plural: "B-wing heavy fighters" },
  { name: "ARC-170 starfighter", weight: 38500, plural: "ARC-170 starfighters" },
  { name: "Jedi starfighter", weight: 13200, plural: "Jedi starfighters" },
  { name: "Naboo N-1 starfighter", weight: 11000, plural: "Naboo N-1 starfighters" },
  { name: "Anakin's Podracer", weight: 1650, plural: "Anakin's Podracers" },
  
  // Medium Ships
  { name: "Millennium Falcon", weight: 2750000, plural: "Millennium Falcons" },
  { name: "Slave I (Boba Fett's ship)", weight: 440000, plural: "Slave I ships" },
  { name: "Lambda-class shuttle", weight: 770000, plural: "Lambda-class shuttles" },
  { name: "U-wing transport", weight: 88000, plural: "U-wing transports" },
  { name: "Razor Crest", weight: 550000, plural: "Razor Crests" },
  { name: "Ghost (Rebels ship)", weight: 1200000, plural: "Ghost ships" },
  { name: "Outrider", weight: 2400000, plural: "Outriders" },
  { name: "Ebon Hawk", weight: 1800000, plural: "Ebon Hawks" },
  { name: "Tantive IV corvette", weight: 3300000, plural: "Tantive IV corvettes" },
  { name: "Nebulon-B frigate", weight: 8800000, plural: "Nebulon-B frigates" },
  
  // Large Ships
  { name: "CR90 corvette", weight: 3300000, plural: "CR90 corvettes" },
  { name: "Arquitens-class cruiser", weight: 22000000, plural: "Arquitens-class cruisers" },
  { name: "Victory-class Star Destroyer", weight: 220000000, plural: "Victory-class Star Destroyers" },
  { name: "Imperial-class Star Destroyer", weight: 880000000, plural: "Imperial-class Star Destroyers" },
  { name: "Venator-class Star Destroyer", weight: 2200000000, plural: "Venator-class Star Destroyers" },
  { name: "Mon Calamari cruiser", weight: 1100000000, plural: "Mon Calamari cruisers" },
  { name: "MC80 Star Cruiser", weight: 1320000000, plural: "MC80 Star Cruisers" },
  { name: "Interdictor-class cruiser", weight: 440000000, plural: "Interdictor-class cruisers" },
  
  // Massive Ships
  { name: "Super Star Destroyer", weight: 264000000000, plural: "Super Star Destroyers" },
  { name: "Executor-class dreadnought", weight: 264000000000, plural: "Executor-class dreadnoughts" },
  { name: "Eclipse-class dreadnought", weight: 374000000000, plural: "Eclipse-class dreadnoughts" },
  { name: "Death Star I", weight: 2640000000000000, plural: "Death Star I battle stations" },
  { name: "Death Star II", weight: 4400000000000000, plural: "Death Star II battle stations" },
  { name: "Starkiller Base", weight: 13200000000000000000, plural: "Starkiller Bases" },
  
  // OTHER SCI-FI SPACESHIPS
  
  // Star Trek Ships
  { name: "USS Enterprise NCC-1701", weight: 4180000000, plural: "USS Enterprise NCC-1701s" },
  { name: "USS Enterprise NCC-1701-D", weight: 10120000000, plural: "USS Enterprise NCC-1701-Ds" },
  { name: "Klingon Bird-of-Prey", weight: 550000000, plural: "Klingon Birds-of-Prey" },
  { name: "Romulan Warbird", weight: 9900000000, plural: "Romulan Warbirds" },
  { name: "Borg Cube", weight: 198000000000000, plural: "Borg Cubes" },
  { name: "USS Defiant", weight: 770000000, plural: "USS Defiants" },
  { name: "Voyager starship", weight: 1540000000, plural: "Voyager starships" },
  
  // Battlestar Galactica
  { name: "Colonial Viper", weight: 16500, plural: "Colonial Vipers" },
  { name: "Battlestar Galactica", weight: 110000000000, plural: "Battlestar Galacticas" },
  { name: "Cylon Raider", weight: 22000, plural: "Cylon Raiders" },
  { name: "Cylon Basestar", weight: 44000000000, plural: "Cylon Basestars" },
  
  // Babylon 5
  { name: "Starfury fighter", weight: 8800, plural: "Starfury fighters" },
  { name: "Babylon 5 station", weight: 55000000000, plural: "Babylon 5 stations" },
  { name: "Earth Alliance destroyer", weight: 2200000000, plural: "Earth Alliance destroyers" },
  { name: "Minbari cruiser", weight: 3300000000, plural: "Minbari cruisers" },
  
  // Halo Universe
  { name: "UNSC Longsword fighter", weight: 110000, plural: "UNSC Longsword fighters" },
  { name: "UNSC Pelican dropship", weight: 77000, plural: "UNSC Pelican dropships" },
  { name: "UNSC Frigate", weight: 1320000000, plural: "UNSC Frigates" },
  { name: "UNSC Pillar of Autumn", weight: 220000000000, plural: "UNSC Pillar of Autumns" },
  { name: "Covenant cruiser", weight: 440000000000, plural: "Covenant cruisers" },
  { name: "Covenant supercarrier", weight: 6600000000000, plural: "Covenant supercarriers" },
  { name: "Halo ring", weight: 1320000000000000000, plural: "Halo rings" },
  
  // Mass Effect
  { name: "Normandy SR-1", weight: 2200000, plural: "Normandy SR-1s" },
  { name: "Normandy SR-2", weight: 3300000, plural: "Normandy SR-2s" },
  { name: "Turian cruiser", weight: 22000000000, plural: "Turian cruisers" },
  { name: "Reaper destroyer", weight: 440000000000, plural: "Reaper destroyers" },
  { name: "Sovereign Reaper", weight: 8800000000000, plural: "Sovereign Reapers" },
  { name: "Citadel space station", weight: 176000000000000, plural: "Citadel space stations" },
  
  // Warhammer 40K
  { name: "Imperial fighter", weight: 33000, plural: "Imperial fighters" },
  { name: "Imperial frigate", weight: 11000000000, plural: "Imperial frigates" },
  { name: "Imperial cruiser", weight: 110000000000, plural: "Imperial cruisers" },
  { name: "Imperial battleship", weight: 1100000000000, plural: "Imperial battleships" },
  { name: "Space Marine battle barge", weight: 660000000000, plural: "Space Marine battle barges" },
  
  // NEW WARHAMMER 40K - Ultimate Structures
  { name: "The Golden Throne", weight: 22000000, plural: "Golden Thrones" },
  { name: "Emperor-class Battle Titan", weight: 22000000, plural: "Emperor-class Battle Titans" },
  
  // Alien/Aliens
  { name: "Nostromo commercial towing vehicle", weight: 1100000000, plural: "Nostromo commercial towing vehicles" },
  { name: "Sulaco military transport", weight: 7700000000, plural: "Sulaco military transports" },
  { name: "UD-4L Cheyenne dropship", weight: 77000, plural: "UD-4L Cheyenne dropships" },
  
  // Independence Day
  { name: "City Destroyer ship", weight: 33000000000000, plural: "City Destroyer ships" },
  { name: "Mothership", weight: 1320000000000000000, plural: "Motherships" },
  { name: "Attacker fighter", weight: 220000, plural: "Attacker fighters" },
  
  // Misc Sci-Fi
  { name: "Serenity (Firefly)", weight: 1320000, plural: "Serenity ships" },
  { name: "Event Horizon", weight: 22000000000, plural: "Event Horizon ships" },
  { name: "Discovery One (2001)", weight: 8800000000, plural: "Discovery One ships" },
  { name: "Nostromo escape pod", weight: 11000, plural: "Nostromo escape pods" }
];

// Helper function to categorize items
export const categorizeItem = (name: string) => {
  const lowerName = name.toLowerCase();
  
  // Pokemon - Comprehensive set-based detection
  const pokemonNames = new Set([
    'blastoise', 'charizard', 'venusaur', 'garchomp', 'onix', 'salamence', 'rhydon', 'mewtwo', 
    'slaking', 'ho-oh', 'tyranitar', 'rayquaza', 'snorlax', 'dragonite', 'lugia', 'lapras', 
    'gyarados', 'golem', 'arceus', 'reshiram', 'palkia', 'zekrom', 'kyogre', 'aggron', 
    'wailord', 'steelix', 'regigigas', 'groudon', 'metagross', 'dialga', 'giratina', 
    'eternatus', 'celesteela'
  ]);
  
  if (pokemonNames.has(lowerName)) {
    return 'pokemon';
  }
  
  // FRANCHISE CATEGORIES
  
  // Star Wars
  if (lowerName.includes('tie fighter') || lowerName.includes('tie interceptor') || lowerName.includes('tie bomber') ||
      lowerName.includes('tie advanced') || lowerName.includes('x-wing') || lowerName.includes('y-wing') ||
      lowerName.includes('a-wing') || lowerName.includes('b-wing') || lowerName.includes('arc-170') ||
      lowerName.includes('jedi starfighter') || lowerName.includes('naboo n-1') || lowerName.includes('podracer') ||
      lowerName.includes('millennium falcon') || lowerName.includes('slave i') || lowerName.includes('lambda-class') ||
      lowerName.includes('u-wing') || lowerName.includes('razor crest') || lowerName.includes('ghost') ||
      lowerName.includes('outrider') || lowerName.includes('ebon hawk') || lowerName.includes('tantive iv') ||
      lowerName.includes('nebulon-b') || lowerName.includes('cr90') || lowerName.includes('arquitens') ||
      lowerName.includes('victory-class') || lowerName.includes('imperial-class') || lowerName.includes('venator') ||
      lowerName.includes('mon calamari') || lowerName.includes('mc80') || lowerName.includes('interdictor') ||
      lowerName.includes('super star destroyer') || lowerName.includes('executor-class') || lowerName.includes('eclipse-class') ||
      lowerName.includes('death star') || lowerName.includes('starkiller base') || lowerName.includes('chewbacca') ||
      lowerName.includes('rancor') || lowerName.includes('at-at') || lowerName.includes('at-st') ||
      lowerName.includes('jabba') || lowerName.includes('sandcrawler')) {
    return 'star-wars';
  }
  
  // Star Trek
  if (lowerName.includes('uss enterprise') || lowerName.includes('klingon') || lowerName.includes('romulan') ||
      lowerName.includes('borg cube') || lowerName.includes('uss defiant') || lowerName.includes('voyager starship')) {
    return 'star-trek';
  }
  
  // Halo
  if (lowerName.includes('halo warthog') || lowerName.includes('halo scorpion') || lowerName.includes('unsc') ||
      lowerName.includes('covenant') || lowerName.includes('halo ring')) {
    return 'halo';
  }
  
  // Marvel
  if (lowerName.includes('iron man') || lowerName.includes('the hulk') || lowerName.includes('thanos') ||
      lowerName.includes('groot') || lowerName.includes('ant-man') || lowerName.includes('quinjet') ||
      lowerName.includes('helicarrier')) {
    return 'marvel';
  }
  
  // Mass Effect
  if (lowerName.includes('normandy') || lowerName.includes('turian') || lowerName.includes('reaper') ||
      lowerName.includes('citadel space station')) {
    return 'mass-effect';
  }
  
  // Warhammer 40K - ENHANCED DETECTION
  if (lowerName.includes('imperial fighter') || lowerName.includes('imperial frigate') || 
      lowerName.includes('imperial cruiser') || lowerName.includes('imperial battleship') ||
      lowerName.includes('space marine') || lowerName.includes('adeptus custodes') ||
      lowerName.includes('imperial guard') || lowerName.includes('rhino apc') ||
      lowerName.includes('predator tank') || lowerName.includes('land raider') ||
      lowerName.includes('leman russ') || lowerName.includes('baneblade') ||
      lowerName.includes('warhound') || lowerName.includes('emperor-class battle titan') ||
      lowerName.includes('golden throne') || lowerName.includes('tau xv') ||
      lowerName.includes('riptide') || lowerName.includes('broadside') || lowerName.includes('crisis') ||
      lowerName.includes('ta\'unar') || lowerName.includes('supremacy armour') ||
      lowerName.includes('tyranid') || lowerName.includes('carnifex') || lowerName.includes('hierophant') ||
      lowerName.includes('ork warboss') || lowerName.includes('sentinel')) {
    return 'warhammer-40k';
  }
  
  // Alien/Aliens
  if (lowerName.includes('xenomorph') || lowerName.includes('nostromo') || lowerName.includes('sulaco') ||
      lowerName.includes('cheyenne dropship') || lowerName.includes('predalien')) {
    return 'alien';
  }
  
  // Terminator
  if (lowerName.includes('terminator t-800')) {
    return 'terminator';
  }
  
  // Predator
  if (lowerName.includes('predator / yautja')) {
    return 'predator';
  }
  
  // Minecraft
  if (lowerName.includes('minecraft')) {
    return 'minecraft';
  }
  
  // Harry Potter
  if (lowerName.includes('hungarian horntail') || lowerName.includes('hippogriff') || 
      lowerName.includes('hogwarts express') || lowerName.includes('hogwarts castle')) {
    return 'harry-potter';
  }
  
  // Lord of the Rings
  if (lowerName.includes('balrog') || lowerName.includes('oliphaunt') || 
      lowerName.includes('nazgûl') || lowerName.includes('barad-dûr')) {
    return 'lord-of-the-rings';
  }
  
  // Game of Thrones
  if (lowerName.includes('drogon') || lowerName.includes('iron throne') || 
      lowerName.includes('the mountain') || lowerName.includes('gregor clegane')) {
    return 'game-of-thrones';
  }
  
  // Legend of Zelda
  if (lowerName.includes('ganondorf')) {
    return 'zelda';
  }
  
  // Dungeons & Dragons
  if (lowerName.includes('gelatinous cube') || lowerName.includes('beholder')) {
    return 'dnd';
  }
  
  // GENERAL CATEGORIES (for non-franchise items)
  
  // Space & Rockets (real space items)
  if (lowerName.includes('rocket') || lowerName.includes('spacecraft') || lowerName.includes('satellite') ||
      lowerName.includes('apollo') || lowerName.includes('soyuz') || lowerName.includes('falcon') ||
      lowerName.includes('saturn') || lowerName.includes('shuttle') || lowerName.includes('starship') ||
      lowerName.includes('dragon') || lowerName.includes('orion') || lowerName.includes('voyager') ||
      lowerName.includes('hubble') || lowerName.includes('webb') || lowerName.includes('cassini') ||
      lowerName.includes('probe') || lowerName.includes('rover') || lowerName.includes('space station') ||
      lowerName.includes('iss') || lowerName.includes('skylab') || lowerName.includes('mir') ||
      lowerName.includes('tiangong') || lowerName.includes('sputnik') || lowerName.includes('ariane') ||
      lowerName.includes('atlas') || lowerName.includes('delta') || lowerName.includes('antares') ||
      lowerName.includes('proton') || lowerName.includes('long march') || lowerName.includes('vega') ||
      lowerName.includes('electron') || lowerName.includes('energia') || lowerName.includes('sls') ||
      lowerName.includes('super heavy') || lowerName.includes('perseverance') || lowerName.includes('curiosity') ||
      lowerName.includes('new horizons') || lowerName.includes('parker solar') || lowerName.includes('james webb')) {
    return 'space';
  }
  
  // Buildings and Monuments
  if (lowerName.includes('statue') || lowerName.includes('tower') || lowerName.includes('bridge') ||
      lowerName.includes('building') || lowerName.includes('cathedral') || lowerName.includes('castle') ||
      lowerName.includes('monument') || lowerName.includes('pyramid') || lowerName.includes('temple') ||
      lowerName.includes('basilica') || lowerName.includes('abbey') || lowerName.includes('palace') ||
      lowerName.includes('colosseum') || lowerName.includes('parthenon') || lowerName.includes('taj mahal') ||
      lowerName.includes('eiffel') || lowerName.includes('big ben') || lowerName.includes('arc de triomphe') ||
      lowerName.includes('opera house') || lowerName.includes('gateway arch') || lowerName.includes('sphinx') ||
      lowerName.includes('mount rushmore') || lowerName.includes('christ the redeemer') || 
      lowerName.includes('angel of the north') || lowerName.includes('moai') || lowerName.includes('david') ||
      lowerName.includes('charging bull') || lowerName.includes('fearless girl') || lowerName.includes('lincoln memorial') ||
      lowerName.includes('washington monument') || lowerName.includes('leaning tower') || lowerName.includes('dam') ||
      lowerName.includes('lighthouse') || lowerName.includes('cn tower') || lowerName.includes('space needle') ||
      lowerName.includes('tokyo tower') || lowerName.includes('hollywood sign') || lowerName.includes('atomium') ||
      lowerName.includes('bean') || lowerName.includes('cloud gate') || lowerName.includes('stonehenge') ||
      lowerName.includes('kelpies') || lowerName.includes('orbit') || lowerName.includes('motherland calls') ||
      lowerName.includes('spring temple buddha') || lowerName.includes('burj khalifa') || lowerName.includes('empire state') ||
      lowerName.includes('chrysler') || lowerName.includes('world trade') || lowerName.includes('willis tower') ||
      lowerName.includes('sears tower') || lowerName.includes('notre-dame') || lowerName.includes('st. peter') ||
      lowerName.includes('westminster') || lowerName.includes('sagrada familia') || lowerName.includes('neuschwanstein') ||
      lowerName.includes('windsor') || lowerName.includes('edinburgh') || lowerName.includes('versailles') ||
      lowerName.includes('forbidden city') || lowerName.includes('buckingham') || lowerName.includes('hoover dam') ||
      lowerName.includes('three gorges') || lowerName.includes('panama canal')) {
    return 'buildings';
  }
  
  // Animals (including dinosaurs)
  if (lowerName.includes('cat') || lowerName.includes('dog') || lowerName.includes('tiger') || 
      lowerName.includes('elephant') || lowerName.includes('whale') || lowerName.includes('bear') ||
      lowerName.includes('horse') || lowerName.includes('cow') || lowerName.includes('giraffe') || 
      lowerName.includes('retriever') || 
      lowerName.includes('shark') || lowerName.includes('panda') || lowerName.includes('gorilla') ||
      lowerName.includes('walrus') || lowerName.includes('manatee') || lowerName.includes('squid') ||
      lowerName.includes('stegosaurus') || lowerName.includes('triceratops') || lowerName.includes('t-rex') ||
      lowerName.includes('brachiosaurus') || lowerName.includes('orca') || 
      lowerName.includes('carnotaurus') || lowerName.includes('parasaurolophus') || 
      lowerName.includes('iguanodon') || lowerName.includes('ankylosaurus') || 
      lowerName.includes('diplodocus') || lowerName.includes('spinosaurus')) {
    return 'animals';
  }
  
  // Vehicles (excluding space vehicles)
  if (lowerName.includes('car') || lowerName.includes('truck') || lowerName.includes('motorcycle') ||
      lowerName.includes('bicycle') || lowerName.includes('bus') || lowerName.includes('tank') ||
      lowerName.includes('helicopter') || lowerName.includes('ferrari') || lowerName.includes('lamborghini') ||
      lowerName.includes('porsche') || lowerName.includes('bugatti') || lowerName.includes('tesla') ||
      lowerName.includes('corvette') || lowerName.includes('snowmobile') || lowerName.includes('atv') ||
      lowerName.includes('jet ski') || lowerName.includes('volkswagen') || lowerName.includes('honda') ||
      lowerName.includes('lotus') || lowerName.includes('koenigsegg') || lowerName.includes('mclaren') ||
      lowerName.includes('audi') || lowerName.includes('aston martin') || lowerName.includes('ford') ||
      lowerName.includes('nissan') || lowerName.includes('bentley') || lowerName.includes('humvee') ||
      lowerName.includes('chevy') || lowerName.includes('ambulance') || lowerName.includes('motorhome') ||
      lowerName.includes('fire truck') || lowerName.includes('garbage truck') || 
      lowerName.includes('kenworth') || lowerName.includes('freightliner') || 
      lowerName.includes('black hawk') || lowerName.includes('apache') || 
      lowerName.includes('m3 stuart') || lowerName.includes('bulldozer') || 
      lowerName.includes('f-16') || lowerName.includes('excavator') || 
      lowerName.includes('locomotive') || lowerName.includes('boeing') || 
      lowerName.includes('airbus')) {
    return 'vehicles';
  }
  
  // People (including celebrities and athletes)
  if (lowerName.includes('person') || lowerName.includes('baby') || lowerName.includes('arnold') ||
      lowerName.includes('ronnie') || lowerName.includes('chris') || lowerName.includes('frank') ||
      lowerName.includes('dwayne') || lowerName.includes('shaquille') || lowerName.includes('kevin') ||
      lowerName.includes('larry') || lowerName.includes('eddie') || lowerName.includes('linebacker') ||
      lowerName.includes('center') || lowerName.includes('knight')) {
    return 'people';
  }
  
  // Fictional (remaining fictional items not in specific franchises)
  if (lowerName.includes('optimus prime') || lowerName.includes('megatron') ||
      lowerName.includes('godzilla') || lowerName.includes('king kong') || lowerName.includes('alduin')) {
    return 'fictional';
  }
  
  return 'objects';
};

export const getMultipleWeightComparisons = (
  totalWeight: number, 
  count = 5, 
  enabledCategories?: string[]
): WeightComparison[] => {
  if (totalWeight <= 0) return [];
  
  // Filter comparisons by enabled categories if provided
  let filteredComparisons = weightComparisons;
  if (enabledCategories && enabledCategories.length > 0) {
    filteredComparisons = weightComparisons.filter(item => {
      const category = categorizeItem(item.name);
      return enabledCategories.includes(category);
    });
    
    // If no comparisons match the enabled categories, fall back to all comparisons
    if (filteredComparisons.length === 0) {
      filteredComparisons = weightComparisons;
    }
  }
  
  const comparisons = filteredComparisons.map(item => {
    const itemCount = Math.round(totalWeight / item.weight);
    const actualWeight = itemCount * item.weight;
    const accuracy = 1 - Math.abs(totalWeight - actualWeight) / totalWeight;
    
    return {
      ...item,
      count: itemCount,
      actualWeight,
      accuracy,
      difference: Math.abs(totalWeight - actualWeight)
    };
  }).filter(item => item.count > 0 && item.count <= 50);

  comparisons.sort((a, b) => {
    const aScore = a.accuracy - (a.count > 10 ? 0.1 : 0) + (a.count === 1 ? 0.1 : 0);
    const bScore = b.accuracy - (b.count > 10 ? 0.1 : 0) + (b.count === 1 ? 0.1 : 0);
    return bScore - aScore;
  });
  
  const result = [];
  const usedNames = new Set();
  
  for (const comp of comparisons) {
    if (result.length >= count) break;
    if (!usedNames.has(comp.name)) {
      result.push(comp);
      usedNames.add(comp.name);
    }
  }
  
  return result.slice(0, count);
};