const genericEvents = [
	'<span class="local-event-destiny-required">ATTENTION, CAPTAIN:</span> Imperial Starbase and/or Fleet nearby.',
	'<span class="local-event-destiny-required">ATTENTION, CAPTAIN:</span> Imperial Customs is active in the area.',
	'<span class="local-event-destiny-required">ATTENTION, CAPTAIN:</span> Fugitives being sought by Imperial Procurator and/or IOCI forces in the area.',
	'<span class="local-event-destiny-required">ATTENTION, CAPTAIN:</span> Bureau of Ships & Services (BoSS) has a checkpoint nearby. You may be asked for your BoSS Datapad.',
	'<span class="local-event-destiny-required">A DISTURBANCE IN THE FORCE:</span> All PCs gain +' + htmlForceDie + ' while in the system, but only <span style="background-color:black;color:red">Dark Side</span> pips ' + htmlForceDark + ' may be used for successes.',
];

const localEmpireEvents = [
	'<span class="local-event-destiny-required">IMPERIAL PRESENCE:</span> Imperial fighters are being dispatched towards you.',
	'<span class="local-event-destiny-required">IMPERIAL PRESENCE:</span> Imperial Customs inspection. Stop engines and prepare to be boarded.',
	'<span class="local-event-destiny-required">IMPERIAL PRESENCE:</span> Fugitive checkpoint with Imperial Procurator and stormtroopers. Prepare to be scanned.',
	'<span class="local-event-destiny-required">IMPERIAL PRESENCE:</span> Bureau of Ships & Services (BoSS) checkpoint. Please present your BoSS Datapad.',
	'<span class="local-event-destiny-required">A DISTURBANCE IN THE FORCE:</span> All PCs gain +' + htmlForceDie + 'while in the system, but only <span style="background-color:black;color:red">Dark Side</span> pips ' + htmlForceDark + ' may be used for successes.',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Stealth check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Streetwise check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Computers check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Education check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Education check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Streetwise check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Core Worlds check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Core Worlds check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Underworld check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Computers check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Core Worlds check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Underworld check(s).',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> +' + htmlBoostDie + ' to Computers check(s).',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on weapons.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on armor.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on ship components.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on cybernetics.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on weapons.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on armor.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on ship components.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on cybernetics.',
	'<span class="local-event-free">LOCAL COLOR:</span> Maintenance crew at work in the area.',
	'<span class="local-event-free">RUSH HOUR:</span> Vehicle/Foot traffic higher (+' + htmlSetbackDie + ') or lower (+' +
		htmlBoostDie + ') than normal.',
	'<span class="local-event-free">LOCAL COLOR:</span> Law enforcement has locked down an important location.',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Charm check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Coercion check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Computers check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Deception check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Mechanics check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Medicine check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Negotiation check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Streetwise check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Survival check(s).',
	'<span class="local-event-destiny-optional">FAVORABLE CONTACTS:</span> +' + htmlBoostDie + ' to Vigilance check(s).',
	'<span class="local-event-free">NEW SHERIFF:</span> Local leadership takes an interest in you.',
	'<span class="local-event-free">SEE "EM COMING:</span> +' + htmlBoostDie + ' OR ' + htmlSetbackDie + ' to Piloting vs. spaceborne megafauna.',
	'<span class="local-event-destiny-optional">LOOT ALERT:</span> Sensors indicate a debris field nearby.',
	'<span class="local-event-destiny-optional">LOOT ALERT:</span> Sensors indicate a derelict spaceship nearby.',
	'<span class="local-event-destiny-optional">LOCAL EXPERT:</span> +' + htmlBoostDie + ' to Xenology regarding local flora and fauna.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on weapons.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on armor.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on survival gear.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on ship parts.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on riding beasts.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity on landspeeders.',
	'<span class="local-event-free">FESTIVAL:</span> A local entertainment event draws crowds.',
	'<span class="local-event-free">POLITICAL STRIFE:</span> Tensions are running high.',
	'<span class="local-event-free">LOCAL WEATHER:</span> Sensors indicate a storm on the horizon.',
	'<span class="local-event-free">LOCAL COLOR:</span> The local politician greets you at the landing site.',
	'<span class="local-event-free">LOCAL COLOR:</span> You get the sensation you are being watched.',
	'<span class="local-event-free">ATTENTION, SPACER:</span> You have an urgent message on GalactiMail.',
	'<span class="local-event-free">LOCAL COLOR:</span> Local prostitutes are very aggressive.',
	'<span class="local-event-free">LOCAL COLOR:</span> <i>"You simply <em>have</em> to try the latest fad. Everyone\'s doing it!"</i>',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Mechanic.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Slicer.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Doctor.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Scout.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Core Worlds expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Education expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Lore expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Outer Rim expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Underworld expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Warfare expert.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Easy money (~10-100cr) to be made for a skilled Xenology expert.',
	'<span class="local-event-free">LOCAL COLOR:</span> <i>"Psst! I got a ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Frangawl_Force_Powder" target="_blank">new kind of Spice</a> ' +
		'that will rock your world."</i> ' + htmlFrangawlForcePowder,
	'<span class="local-event-destiny-optional">AN OLD FRIEND:</span> My juvenile delinquent buddy is working for law enforcement now???',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> An antiquities dealer wishes to <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Gear#RELICS" target="_blank">speak to you</a>. Come to the back door of the shop.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> A "political prisoner" desperately needs to get off world. They can pay.',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> <i>"Move it along, citizen. Declare any contraband <em>before</em> you get to the scanner. Move it along."</i>',
	'<span class="local-event-free">LOCAL COLOR:</span> A crowd gathers around a passionate speech being made.',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> <i>"You there! Citizen, stop! Have you seen this droid?"</i>',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> <i>"Keep moving, citizen. Nothing to see here."</i>',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> <i>"Papers, please."</i>',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> <i>"No weapons allowed within one klik of the Senator. Please discard all weapons in the bin."</i>',
	'<span class="local-event-free">LOCAL COLOR:</span> A celebrity and their entourage draws attention.',
	'<span class="local-event-free">IMPERIAL CHECKPOINT:</span> A squad of stormtroopers scans the crowd for something specific.',
	'<span class="local-event-free">KEEP FLYING:</span> <i>"This shipment needs to get there <em>yesterday</em>. Think you\'re fast enough?"</i>',
	'<span class="local-event-free">LOCAL COLOR:</span> Election Day! Long lines clog the streets near voting locations.',
	'<span class="local-event-free">WEATHER:</span> It\'s raining. <em>Hard.</em>',
	'<span class="local-event-free">IMPERIAL PRESENCE:</span> A squad of stormtroopers is temporarily camped near your ship. They pay no attention to you, but they can see your comings and goings.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Mechanics check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Computers check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Medicine check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Survival check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Core Worlds check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Education check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Lore check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Outer Rim check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Underworld check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Warfare check.',
	'<span class="local-event-free">IT FLOWS THROUGH ALL:</span> Gain +' + htmlForceDie + ' on next Xenology check.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stim_tea" ' +
		'target="_blank">Stim tea</a> ' + htmlStimtea,
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Stimcaf</a> ' + htmlStimcafEnergizing,
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Stimbrew</a>' + htmlStimbrew,
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Stimbucha</a> ' + htmlStimbucha,
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Stimcaine</a> ' + htmlStimcaine,
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Pan-Galactic Gargle Blaster</a> ' + htmlPanGalacticGargleBlaster,
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A uniformed officer has some ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Questioner-9_Interrogation_Serum" target="_blank">truth serum</a>. ' +
		'(' + htmlUpgradeDiff1x + ' all checks to withhold information, 24 hours).',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A uniformed officer has some surplus Empire-branded ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Vutalamine" target="_blank">Vutalamine</a>. (' + htmlVutalamine + ')',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A uniformed officer has some surplus Empire-branded ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Affide_Crystal" target="_blank">"last resort" pills</a>. (Restricted poison, Rarity 8)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A uniformed officer has some surplus Empire-branded ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Skirtopanol" target="_blank">Skirtopanol</a>. (CorSec Restricted truth serum, Rarity 8)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A medical professional has some surplus Empire-branded ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Synthetic_Neuroparalytic" target="_blank">Dontmovatall medicine</a>. (injected Restricted neuroparalytic, Rarity 6)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A medical professional has some surplus Empire-branded ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Synthetic_Neurotoxin" target="_blank">Dontuzatome medicine</a>. (injected/ingested/airborne Restricted neurotoxin, Rarity 6)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A medical professional in bloodstained scrubs can ' +
		'hook you up with Restricted <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Cybernetics target="_blank"" ' +
		'target="_blank">cybernetic gear</a>. <strong>For a price.</strong> (Restricted gear, Rarity 3-8)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A civilian Imperial employee has a lead on an Empire ' +
		'warehouse containing Restricted <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Infiltration target="_blank"" target="_blank">infiltration gear</a>. (Restricted gear, Rarity 3-9)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> An off-duty police officer has some surplus ' +
		'Empire-branded <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Security" target="_blank">prison gear</a>. ' +
		'(Restricted gear, Rarity 5-8)',
	'<span class="local-event-destiny-optional">IMPERIAL CORRUPTION:</span> A grease-stained civilian Imperial mechanic has some ' +
		'surplus Empire-branded <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Tools" target="_blank">tools</a>. ' +
		'(Restricted gear, Rarity 5-9)',
	'<span class="local-event-free">LOCAL COLOR:</span> A holo-journalist and her technician want to broadcast a story about your ' +
		'heroic exploits.',
	'<span class="local-event-destiny-required">SCRATCH THE PAINT:</span> Your ship is buffeted by some sort of impact and takes ' +
		'one Critical Hit.',
	'<span class="local-event-free">YOUR MOM CALLED:</span> Would it kill you to holo-call once in a while? +' + htmlBoostDie +
		' to next Coercion check.',
	'<span class="local-event-destiny-optional">A BRUSH WITH GREATNESS:</span> You run into a local celebrity and hit it off. +' +
		htmlBoostDie + ' to all Leadership checks.',
	'<span class="local-event-free">SURPLUS:</span> -1 Rarity, +' + htmlBoostDie + ' on weapon modifications.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity, +' + htmlSetbackDie + ' on weapon modifications.',
	'<span class="local-event-destiny-optional">I KNOW A GUY:</span> Not a "fence". Not a "trafficker". They are an ' +
		'"antiquities dealer" who "specializes in hard to find collectibles". (+1 Rarity to sell ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Gear#RELICS" target="_blank">Relics</a>, and handles ' +
		'(R)estricted items under the table.)',
	'<span class="local-event-free">PROBABLY NOT A TRAP:</span> You hear a muffled cry for help from a dark alley.',
	'<span class="local-event-free">IMPERIAL PRESENCE:</span> <i>"Watch out, the Imps are running undercover operations. Trust no one."</i>',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Real-space debris detected at your preferred destination. ' +
		'(automatic +' + htmlThreat + ' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Minor traffic jam at destination. (automatic +' + htmlThreat +
		' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Major traffic jam at destination. (automatic +' + htmlThreat +
		htmlThreat + ' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> You recognize a familiar hyperspace route. (+' + htmlBoostDie +
		' to Astrogation).',
	'<span class="local-event-destiny-required">ATTENTION, NAVIGATOR:</span> Hyperspace anomaly buffets the ship. (+1 System Strain)',
	'<span class="local-event-destiny-required">ATTENTION, NAVIGATOR:</span> Undetected hyperspace debris impacted the ship. ' +
		'(+1 Hull Trauma)',
	'<span class="local-event-destiny-required">ATTENTION, NAVIGATOR:</span> Hyperdrive failure in flight. Dead stop, ' +
		'position unknown.',
	'<span class="local-event-free">LOCAL COLOR:</span> A protocol droid claims to be the local tourism ambassador. ' +
		'Would you like a tour?',
	'<span class="local-event-destiny-optional">ATTENTION, SLICER:</span>An unknown entity is attempting to access your ' +
		'system. You are under attack.',
];

const localOldWestEvents = [
	'<span class="local-event-free">ATTENTION, CAPTAIN:</span> Potential megafauna in the area.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on weapons.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on armor.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on survival gear.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on ship parts.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on riding beasts.',
	'<span class="local-event-free">SHORTAGE:</span> +1 Rarity on landspeeders.',
	'<span class="local-event-free">SHORTAGE:</span> The starport is experiencing an outage of some important service.',
	'<span class="local-event-destiny-optional">ATTENTION, SPACER:</span> You run into an old friend. Do you think they have forgiven you yet?',
	'<span class="local-event-free">SCUM & VILLAINY:</span> People are desperate for starship parts and will try to steal them off your ship.',
	'<span class="local-event-free">SCUM & VILLAINY:</span> Pickpockets have been reported in the area recently.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Due to recent circumstances, all nonsapient droids MUST have a restraining bolt.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Due to recent circumstances, droids are considered unwelcome in some establishments.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Due to recent circumstances, cybernetics are considered unwelcome in some establishments.',
	'<span class="local-event-free">LOCAL COLOR:</span> Adorable local urchins mob you for credits and candy. But they see <em>everything</em>.',
	'<span class="local-event-free">LOCAL COLOR:</span> Due to recent events, droids are considered mildly popular.',
	'<span class="local-event-free">LOCAL COLOR:</span> Due to recent events, cybernetics are considered mildly popular.',
	'<span class="local-event-free">LOCAL COLOR:</span> A small domesticated creature takes a liking to you.',
	'<span class="local-event-free">LOCAL COLOR:</span> The sky is full of (meteors, strange clouds, flying creatures, ...)',
	'<span class="local-event-free">WRETCHED HIVE:</span> A fresh bloodstain is visible on the ground near your ship.',
	'<span class="local-event-free">LOCAL COLOR:</span> You are cordially invited to a gambling event.',
	'<span class="local-event-free">LOCAL COLOR:</span> <em><b>Wanted:</b></em> Fearless PodRacer Jockeys and mechanics for the local podraces.',
	'<span class="local-event-free">LOCAL COLOR:</span> <i>"Say, that\'s a shiny ship you got there. Is she for sale?"</i>',
	'<span class="local-event-free">LOCAL COLOR:</span> <i>"How much you want for that droid?"</i>',
	'<span class="local-event-free">ATTENTION, PILOT:</span> A local hotshot challenges you to a race.',
	'<span class="local-event-free">LOCAL COLOR:</span> A merchant requests your assistance with a local thief.',
	'<span class="local-event-free">LOCAL COLOR:</span> A thief requests your assistance with a local merchant.',
	'<span class="local-event-destiny-optional">ATTENTION, CAPTAIN:</span> Sensors indicate a possible hideout in this system (+' + htmlSetbackDie + ' to be detected).',
	'<span class="local-event-free">LOCAL COLOR:</span> Everyone seems to be looking at you curiously.',
	'<span class="local-event-free">ATTENTION, CAPTAIN:</span> Small animal detected clinging to the hull. Is it friendly or hungry?',
	'<span class="local-event-free">FESTIVAL:</span> A food festival promises large crowds.',
	'<span class="local-event-free">NEW TAXES:</span> Spaceport fees halved/doubled.',
	'<span class="local-event-free">ATTENTION, GUNNER:</span> A local wealthy scion challenges you to a duel. Do you want to "make it interesting"?',
	'<span class="local-event-free">ATTENTION, DIPLOMAT:</span> An impoverished and troddendown local family needs your help with local law enforcement.',
	'<span class="local-event-free">ATTENTION, DIPLOMAT:</span> Local law enforcement needs your help apprehending a brutal local crime family.',
	'<span class="local-event-free">LOCAL COLOR:</span> Did you hear something in the cargo hold?',
	'<span class="local-event-free">ATTENTION, MECHANIC:</span> You find a stowaway hiding in the engine room.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Rumors abound of an insane old wizard living in the hills.',
	'<span class="local-event-destiny-optional">ATTENTION, SLICER:</span> With a little "creative recordkeeping", starport fees might be "waived".',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Swoop bike races promise easy money (~10-100cr) for talented drivers and gamblers.',
	'<span class="local-event-destiny-optional">AN OLD FRIEND:</span> Hey, my buddy works at the starport! They are a talented...(+' + htmlBoostDie + ' to one chosen skill)',
	'<span class="local-event-free">WRETCHED HIVE:</span> You witness a local crime. The perp got away but you know where they are.',
	'<span class="local-event-free">WRETCHED HIVE:</span> You come across blackmail material against a local politician.',
	'<span class="local-event-free">LOCAL COLOR:</span> Fuel Shortage. <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Riding" target="_blank">Riding beasts</a> are the way to go until something is done.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Local farm/shop requests your assistance with a brutal gang.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Local "militia" requests your assistance collecting "protection fees".',
	'<span class="local-event-free">SCUM & VILLAINY:</span> <i>"My friend says he doesn\'t like you. <em>I</em> don\'t like you either."</i>',
	'<span class="local-event-free">SCUM & VILLAINY:</span> <i>"Hey! You can\'t bring that thing in here!"</i>',
	'<span class="local-event-free">SCUM & VILLAINY:</span> <i>"Hey, you! Check yer weapons at the door. We\'ve had trouble recently."</i>',
	'<span class="local-event-free">SCUM & VILLAINY:</span> Scorch marks on (another ship, the starport, a local business, ...)',
	'<span class="local-event-free">SCUM & VILLAINY:</span> <i>"My friend says you owe him 200 credits. He says I get half."</i>',
	'<span class="local-event-free">WRETCHED HIVE:</span> Something is burning nearby. Something big.',
	'<span class="local-event-free">WRETCHED HIVE:</span> You may have just wandered into a gunfight about to happen.',
	'<span class="local-event-free">WRETCHED HIVE:</span> You notice what appears to be a mugging or shakedown in progress.',
	'<span class="local-event-free">WRETCHED HIVE:</span> A farm family requests your help with a predator.',
	'<span class="local-event-free">LOOT ALERT:</span> A local knows where a smuggler\'s cache is hidden. They need your help to steal it.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Blackouts occur randomly as the local power generator is unstable.',
	'<span class="local-event-free">WRETCHED HIVE:</span> Every door is locked and nobody will come out.',
	'<span class="local-event-free">WRETCHED HIVE:</span> A battered, sparking droid lies out of the way of traffic. It has one final message before it dies.',
	'<span class="local-event-free">SCUM & VILLAINY:</span> You find a datapad or credstick you think you could steal easily.',
	'<span class="local-event-free">THE HERO OF:</span> You are mistaken for a local hero. Free drinks as long as you can keep up the ruse.',
	'<span class="local-event-free">LOCAL COLOR:</span> A local urchin claims to be a Jedi and wants to be your padawan.',
	'<span class="local-event-free">LOCAL COLOR:</span> A local farm needs to get their space-cows to market. Time is running out!',
	'<span class="local-event-free">LOCAL COLOR:</span> A local farm needs help recovering their stolen space-cows.',
	'<span class="local-event-free">LOCAL COLOR:</span> A rural community needs help with bandits stealing their (land, water, mine, ...)',
	'<span class="local-event-free">LOCAL COLOR:</span> A local Harvest Festival has everyone wearing colorful costumes.',
	'<span class="local-event-free">LOCAL COLOR:</span> A valuable train shipment is going lightly defended. Will you help it reach its destination?',
	'<span class="local-event-free">LOCAL COLOR:</span> A valuable train shipment is going lightly defended. It almost looks too easy.',
	'<span class="local-event-free">LOCAL COLOR:</span> Colonists need to relocate to a new location, wagons and space-cows and all.',
	'<span class="local-event-free">LOCAL COLOR:</span> Feuding families request your assistance in keeping a wedding between them safe.',
	'<span class="local-event-free">LOCAL COLOR:</span> A local needs help escaping an arranged marriage.',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> Local rodeo needs contestants. Valuable prizes!',
	'<span class="local-event-free">LOCAL COLOR:</span> A regional politician requests your assistance delivering medicine to a remote village.',
	'<span class="local-event-destiny-required">IMPERIAL BLOCKADE:</span> Nobody gets in or out until the situation is resolved.',
	'<span class="local-event-destiny-required">PIRATES:</span> <i>"Prepared to be boarded. Your cargo or your life."</i> Roll initiative for space combat.',
	'<span class="local-event-free">WRETCHED HIVE:</span> <i>"Wanna buy some <a href="https://star-wars-rpg-ffg.fandom.com/wiki/Death_Sticks" ' +
		'target="_blank">Death Sticks</a>?"</i> (' + htmlDeathSticks + ')?"</i>',
	'<span class="local-event-free">LOCAL COLOR:</span> The locally brewed cocktail makes you smart (+' + htmlBoostDie +
		' Cunning) but clumsy (+' + htmlSetbackDie + ' Agility).',
	'<span class="local-event-destiny-required">WEATHER:</span> Extreme weather (violent storm, drought, frigid, broiling, quakes, ' +
		'volcanic eruption, ...).',
	'<span class="local-event-free">SCUM & VILLAINY:</span> You bear a resemblance to a wanted fugitive.',
	'<span class="local-event-destiny-required">WRETCHED HIVE:</span> Paranoia abounds (+' + htmlSetbackDie + ' to all social skills)',
	'<span class="local-event-destiny-required">SHORTAGE:</span> No spare parts (+' + htmlSetbackDie + ' to Mechanics)',
	'<span class="local-event-destiny-required">SCUM & VILLAINY:</span> Security lockdown (+' + htmlSetbackDie + ' to Slicing)',
	'<span class="local-event-destiny-required">WRETCHED HIVE:</span> Police lockdown (+' + htmlSetbackDie + ' to Skulduggery)',
	'<span class="local-event-destiny-required">WEATHER:</span> Low visibility (+' + htmlSetbackDie + ' to outdoors Perception, Ranged attacks, Piloting)',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some fresh ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Avabush_Spice" target="_blank">Avabush</a>."</i> (' + htmlAvabushSpice + ').',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some nice ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Booster_Blue" target="_blank">Booster Blue</a> for you."</i> (' + htmlBoosterBlue + ').',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some sweet ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Death_Sticks" target="_blank">Death Sticks</a>."</i> (' + htmlDeathSticks + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some kickin\' ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Glitterstim" target="_blank">Glitterstim</a>."</i> (' + htmlGlitterstim + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some rockin\' ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Lesai" target="_blank">Lesai</a>."</i> (' + htmlLesai + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some primo ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Yarrock" target="_blank">Yarrock</a>."</i> (' + htmlYarrock + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some fresh ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Gunjack_Spice" target="_blank">Gunjack</a>."</i> (' + htmlGunjackSpice + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some tight ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Impact" target="_blank">Impact</a> right here."</i> (' + htmlImpact + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some pure ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Ji_Rikknit" target="_blank">Ji Rikknit</a> right here."</i> (' + htmlJiRikknit + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some fresh ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Karrak_Spice" target="_blank">Karrak Spice</a>."</i> (' + htmlKarrakSpice + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some nice ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Longsight" target="_blank">Longsight</a>."</i> (' + htmlLongsight + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some sweet ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Marcan_Herb" target="_blank">Marcan Herb</a>."</i> (' + htmlMarcanHerb + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some kickin\' ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Muon_Gold" target="_blank">Muon Gold</a>."</i> (' + htmlMuonGold + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some rockin\' ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Nannarium_Root" target="_blank">Nannarium Root</a>."</i> (' + htmlNannariumRoot + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some primo ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Neutron_Pixie" target="_blank">Neutron Pixie</a>."</i> (' + htmlNeutronPixie + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some tight ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Ryll" target="_blank">Ryll</a> just for you."</i> (' + htmlRyll + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some new ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Yaladai_Spice" target="_blank">Yaladai Spice</a>."</i> (' + htmlYaladaiSpice + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some bespoke ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Ashes_of_Malachor" target="_blank">Ashes of Malachor</a>."</i> (' + htmlAshesOfMalachor + ')',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some heady ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Frangawl_Force_Powder" target="_blank">Frangawl Force Powder</a>."</i>' +
		' (' + htmlFrangawlForcePowder + ')',
	'<span class="local-event-destiny-optional">LOCAL COLOR:</span> The local <a href="https://starwars.fandom.com/wiki/Stimcaf" ' +
		'target="_blank">Stimcaf</a> ' + htmlStimcafThick,
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A shady character has some ' +
		'"<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Dendriton_Toxin" target="_blank">Vengeance Juice</a>". ' +
		'(cruel Restricted poison, Rarity 7)',
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A shady character has some clearly stolen Empire-branded ' +
		'"<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Dioxis_Gas" target="_blank">Coward\'s Solution</a>". ' +
		'(airborne Restricted poison, Rarity 6)',
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A shady character has some freshly harvested ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Raquor_Venom" target="_blank">Raquor\'s Kiss</a>. ' +
		'(injected/airborne Restricted poison, Rarity 7)',
	'<span class="local-event-destiny-optional">YOUR DEALER CALLED:</span> <i>"Psst! I got some ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Bubse_Spice" target="_blank">Bubse</a>."</i> (Wound Threshold +4, one encounter; +20 Critical Injury result, one encounter)',
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A shady character has some ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Electronics" target="_blank">gadgets</a> you might be interested in. ' +
		'(Restricted electronics, Rarity 5-9)',
	'<span class="local-event-destiny-optional">WRETCHED HIVE:</span> <i>"Hey, you looking for ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Category:Recreation" target="_blank">an edge at cubes or cards</a>?"</i> ' +
		'(Restricted gear, Rarity 5-6)',
	'<span class="local-event-free">LOCAL COLOR:</span> A ragtag group of children claim to have found a derelict spaceship. ' +
		'They want to trade for its location.',
	'<span class="local-event-destiny-required">IMPERIAL PRESENCE:</span> An Imperial Star Destroyer lurks menacingly above the city. (+' +
		htmlSetbackDie + ' all Skulduggery/Streetwise checks)',
	'<span class="local-event-free">LOCAL COLOR:</span> A confused-looking trio of humans in yellow, blue, and red uniform shirts ask ' +
		'if you can help them "beam up". Whatever that means.',
	'<span class="local-event-destiny-required">WEATHER:</span> Heat wave/Cold front (+' + htmlSetbackDie +
		' all Athletics/Coordination/Resilience/Survival/Brawl/Melee/Lightsaber checks).',
	'<span class="local-event-destiny-required">A RUDE WELCOME:</span> Your ship is hit by something and takes one Critical Hit ' +
		'during final landing approach.',
	'<span class="local-event-free">LOCAL EXPERTS:</span> -1 Rarity, +' + htmlBoostDie + ' on weapon modifications.',
	'<span class="local-event-free">WE DON\'T DO THAT HERE:</span> +1 Rarity, +' + htmlSetbackDie + ' on weapon modifications.',
	'<span class="local-event-free">WRETCHED HIVE:</span> An angry mob with torches and pitchforks awaits you as you return to the ship.',
	'<span class="local-event-destiny-required">WHO SHOT FIRST?:</span> Roll Initiative.',
	'<span class="local-event-free">ATTENTION, CAPTAIN:</span> Distress call received. We appear to be the closest vessel. Your orders?',
	'<span class="local-event-free">SPACE-LEOPARDS!:</span> They want to eat your face. Roll initiative.',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Real-space debris detected at your preferred destination. (automatic +' +
		htmlThreat + ' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Minor celestial event since last hyperspace charting. (automatic +' +
		htmlThreat + ' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> Major celestial event since last hyperspace charting. (automatic +' +
		htmlThreat + '' + htmlThreat + ' to Astrogation).',
	'<span class="local-event-free">ATTENTION, NAVIGATOR:</span> You recognize a familiar hyperspace route. (+' + htmlBoostDie +
		' to Astrogation).',
	'<span class="local-event-free">LOCAL COLOR:</span> A protocol droid claims to be the local tourism ambassador. Would you like a tour?',
	'<span class="local-event-destiny-optional">WRETCHED HIVE:</span> A delivery driver has some ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Corellian_Whiskey" target="_blank">Corellian Whiskey</a> that ' +
		'"fell off the delivery skiff". (' + htmlCorellianWhiskey + ')',
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A distillery worker has some ' +
		'<a href="https://star-wars-rpg-ffg.fandom.com/wiki/Corellian_Whiskey" target="_blank">Whyren\'s Reserve</a> that ' +
		'"fell off the delivery skiff". (' + htmlWhyrensReserve + ')',
	'<span class="local-event-destiny-optional">SCUM & VILLAINY:</span> A disgraced scientist has invented a new drug. ' +
		'Will you try it and report back to them? (' + htmlMagicPowder + ')',
];

