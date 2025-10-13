// With appreciation to Joress and the EotE Adventure Stimpack homebrew supplement

function getRandom(dataList)
{
	return dataList[Math.floor(Math.random() * dataList.length)];
}

function populateMissionTags(missionTemplate)
{
	mission = missionTemplate.toString();

	sanityCount = 0;
	while (mission.indexOf("<") != -1 && (sanityCount++ < 10))
	{
		mission = mission.replace("<employer>", getRandom(mission_employers));
		mission = mission.replace("<bounty_location>", getRandom(mission_bounty_locations));
		mission = mission.replace("<bounty_target>", getRandom(mission_bounty_targets));
		mission = mission.replace("<bounty_type>", getRandom(mission_bounty_types));
		mission = mission.replace("<collect_event>", getRandom(mission_collect_events));
		mission = mission.replace("<collect_item>", getRandom(mission_collect_items));
		mission = mission.replace("<collect_location>", getRandom(mission_collect_locations));
		mission = mission.replace("<collect_reason>", getRandom(mission_collect_reasons));
		mission = mission.replace("<coruscant_location>", getRandom(mission_coruscant_locations));
		mission = mission.replace("<employer_descriptor>", getRandom(mission_employer_descriptors));
		mission = mission.replace("<employer_empire_descriptor>", getRandom(mission_employer_empire_descriptors));
		mission = mission.replace("<employer_oldwest_descriptor>", getRandom(mission_employer_oldwest_descriptors));
		mission = mission.replace("<empire_location>", getRandom(mission_empire_locations));
		mission = mission.replace("<employer>", getRandom(mission_employers));
		mission = mission.replace("<escort_dest>", getRandom(mission_to_locations));
		mission = mission.replace("<escort_empire_dest>", getRandom(mission_to_empire_locations));
		mission = mission.replace("<escort_oldwest_dest>", getRandom(mission_to_oldwest_locations));
		mission = mission.replace("<escort_event>", getRandom(mission_heist_events));
		mission = mission.replace("<escort_loc>", getRandom(mission_from_locations));
		mission = mission.replace("<escort_empire_loc>", getRandom(mission_from_empire_locations));
		mission = mission.replace("<escort_oldwest_loc>", getRandom(mission_from_oldwest_locations));
		mission = mission.replace("<escort_person>", getRandom(mission_escort_persons));
		mission = mission.replace("<escort_person_descriptor>", getRandom(mission_escort_person_descriptors));
		mission = mission.replace("<espionage_reason>", getRandom(mission_espionage_reasons));
		mission = mission.replace("<espionage_target>", getRandom(mission_espionage_targets));
		mission = mission.replace("<espionage_task>", getRandom(mission_espionage_tasks));
		mission = mission.replace("<explore_reason>", getRandom(mission_explore_reasons));
		mission = mission.replace("<explore_target>", getRandom(mission_explore_targets));
		mission = mission.replace("<explore_type>", getRandom(mission_explore_types));
		mission = mission.replace("<heist_event>", getRandom(mission_heist_events));
		mission = mission.replace("<heist_empire_event>", getRandom(mission_heist_empire_events));
		mission = mission.replace("<heist_oldwest_event>", getRandom(mission_heist_oldwest_events));
		mission = mission.replace("<heist_item>", getRandom(mission_heist_items));
		mission = mission.replace("<heist_target>", getRandom(mission_heist_targets));
		mission = mission.replace("<invite_descriptor>", getRandom(mission_invite_descriptors));
		mission = mission.replace("<invite_event>", getRandom(mission_invite_events));
		mission = mission.replace("<location>", getRandom(mission_locations));
		mission = mission.replace("<negotiate_event>", getRandom(mission_heist_events));

		// make sure we're not negotiating with ourselves
		partyA = getRandom(mission_negotiate_parties);
		mission = mission.replace("<negotiate_party_a>", partyA);
		partyB = partyA;
		do { partyB = getRandom(mission_negotiate_parties); } while (partyA == partyB); // partyA != partyB
		mission = mission.replace("<negotiate_party_b>", partyB);

		mission = mission.replace("<negotiate_type>", getRandom(mission_negotiate_types));
		mission = mission.replace("<oldwest_location>", getRandom(mission_oldwest_locations));
		mission = mission.replace("<payment>", getRandom(mission_payments));
		mission = mission.replace("<protect_event>", getRandom(mission_protect_events));
		mission = mission.replace("<protect_target>", getRandom(mission_protect_targets));
		mission = mission.replace("<protect_empire_target>", getRandom(mission_protect_empire_targets));
		mission = mission.replace("<protect_oldwest_target>", getRandom(mission_protect_oldwest_targets));
		mission = mission.replace("<protect_threat>", getRandom(mission_protect_threats));
		mission = mission.replace("<protect_empire_threat>", getRandom(mission_protect_empire_threats));
		mission = mission.replace("<protect_oldwest_threat>", getRandom(mission_protect_oldwest_threats));
		mission = mission.replace("<rescue_event>", getRandom(mission_heist_events));
		mission = mission.replace("<rescue_empire_event>", getRandom(mission_heist_empire_events));
		mission = mission.replace("<rescue_oldwest_event>", getRandom(mission_heist_oldwest_events));
		mission = mission.replace("<rescue_loc>", getRandom(mission_from_locations));
		mission = mission.replace("<rescue_empire_loc>", getRandom(mission_from_empire_locations));
		mission = mission.replace("<rescue_oldwest_loc>", getRandom(mission_from_oldwest_locations));
		mission = mission.replace("<rescue_opposition>", getRandom(mission_oppositions));
		mission = mission.replace("<rescue_empire_opposition>", getRandom(mission_empire_oppositions));
		mission = mission.replace("<rescue_oldwest_opposition>", getRandom(mission_oldwest_oppositions));
		mission = mission.replace("<rescue_person>", getRandom(mission_escort_persons));
		mission = mission.replace("<rescue_empire_person>", getRandom(mission_escort_empire_persons));
		mission = mission.replace("<rescue_oldwest_person>", getRandom(mission_escort_oldwest_persons));
		mission = mission.replace("<sabotage_event>", getRandom(mission_sabotage_events));
		mission = mission.replace("<sabotage_outcome>", getRandom(mission_sabotage_outcomes));
		mission = mission.replace("<sabotage_target>", getRandom(mission_sabotage_targets));
		mission = mission.replace("<ship_location>", getRandom(mission_ship_locations));
		mission = mission.replace("<smuggle_cargo>", getRandom(mission_smuggle_cargos));
		mission = mission.replace("<smuggle_contact>", getRandom(mission_smuggle_contacts));
		mission = mission.replace("<smuggle_contraband>", getRandom(mission_smuggle_contrabands));
		mission = mission.replace("<smuggle_event>", getRandom(mission_heist_events));
		mission = mission.replace("<smuggle_empire_event>", getRandom(mission_heist_empire_events));
		mission = mission.replace("<smuggle_oldwest_event>", getRandom(mission_heist_oldwest_events));
		mission = mission.replace("<smuggle_location>", getRandom(mission_to_locations));
		mission = mission.replace("<smuggle_empire_location>", getRandom(mission_to_empire_locations));
		mission = mission.replace("<smuggle_oldwest_location>", getRandom(mission_to_oldwest_locations));
		mission = mission.replace("<trade_route>", getRandom(mission_trade_routes));
	}

	return mission;
}

function generateMission()
{
	mission = getRandom(mission_templates);
	mission = populateMissionTags(mission);
	window.alert(mission);

	mission = '<li><span class="local-event-free">HOT PLOOK:</span> ' + mission + '</li>';

	return mission;
}

function generateEmpireMission()
{
	mission = getRandom(mission_templates);

	mission = mission.replace("<employer_descriptor>", "<employer_empire_descriptor>");
	mission = mission.replace("<escort_dest>", "<mission_empire_location>");
	mission = mission.replace("<heist_event>", "<heist_empire_event>");
	mission = mission.replace("<mission_location>", "<mission_empire_location>");
	mission = mission.replace("<protect_target>", "<protect_empire_target>");
	mission = mission.replace("<protect_threat>", "<protect_empire_threat>");
	mission = mission.replace("<rescue_event>", "<rescue_empire_event>");
	mission = mission.replace("<rescue_loc>", "<rescue_empire_loc>");
	mission = mission.replace("<rescue_person>", "<rescue_empire_person>");
	mission = mission.replace("<smuggle_event>", "<smuggle_empire_event>");
	mission = mission.replace("<smuggle_location>", "<smuggle_empire_location>");

	mission = populateMissionTags(mission);
	window.alert(mission);

	mission = '<li><span class="local-event-free">HOT PLOOK:</span> ' + mission + '</li>';

	return mission;
}

function generateOldWestMission()
{
	mission = getRandom(mission_templates);

	mission = mission.replace("<employer_descriptor>", "<employer_oldwest_descriptor>");
	mission = mission.replace("<escort_dest>", "<mission_oldwest_location>");
	mission = mission.replace("<heist_event>", "<heist_oldwest_event>");
	mission = mission.replace("<mission_location>", "<mission_oldwest_location>");
	mission = mission.replace("<protect_target>", "<protect_oldwest_target>");
	mission = mission.replace("<protect_threat>", "<protect_oldwest_threat>");
	mission = mission.replace("<rescue_event>", "<rescue_oldwest_event>");
	mission = mission.replace("<rescue_opposition>", "<rescue_oldwest_opposition>");
	mission = mission.replace("<rescue_loc>", "<rescue_oldwest_loc>");
	mission = mission.replace("<rescue_person>", "<rescue_oldwest_person>");
	mission = mission.replace("<smuggle_event>", "<smuggle_oldwest_event>");
	mission = mission.replace("<smuggle_location>", "<smuggle_oldwest_location>");

	mission = populateMissionTags(mission);
	window.alert(mission);

	mission = '<li><span class="local-event-free">HOT PLOOK:</span> ' + mission + '</li>';

	return mission;
}

mission_templates = [
	"My employer, <employer>, will pay you <payment> to steal <heist_item> from <heist_target> before <heist_event>.",
	"My employer, <employer>, will pay you <payment> to <espionage_task> from <espionage_target> because <espionage_reason>.",
	"My employer, <employer>, needs to get <escort_person> to <escort_dest> from <escort_loc> before <escort_event> and will pay you <payment>.",
	"My employer, <employer>, will pay you <payment> to rescue <rescue_person> to <escort_dest> from <rescue_loc> controlled by <rescue_opposition> before <rescue_event>.",
	"My employer, <employer>, will pay you <payment> to protect <protect_target> from <protect_threat> that are coming <protect_event>.",
	"My employer, <employer>, wants <collect_item> because <collect_reason> and we must get it from <collect_location> before <collect_event>. They will pay you <payment>.",
	"My employer, <employer>, has a bounty on <bounty_target>, last seen <bounty_location>. Deliver the target <bounty_type> for payment of <payment>.",
	"My employer, <employer>, needs <smuggle_cargo> delivered to <smuggle_location> before <smuggle_event>. Expect <smuggle_contact> to pay you <payment> upon delivery.",
	"My employer, <employer>, needs <smuggle_contraband> descreetly delivered to <smuggle_location>, and <smuggle_contact> will pay you <payment> upon delivery. <em>Discretion is mandatory.</em>",
	"My employer, <employer>, will pay you <payment> to <negotiate_type> between <negotiate_party_a> and <negotiate_party_b> before <negotiate_event>.",
	"My employer, <employer>, will pay you <payment> to <explore_type> <explore_target> because <explore_reason>.",
	"My employer, <employer>, will pay you <payment> to stop <sabotage_target> before <sabotage_event> or else <sabotage_outcome>.",
	"An invitation from <employer> cordially invites you to <invite_event>, and <invite_descriptor>.",
];

mission_employers = [
	"<employer_descriptor> Hutt who wishes to remain anonymous for now",

	"<employer_descriptor> shadowy Crime Syndicate",
	"<employer_descriptor> Black Sun syndicate operative",
	"<employer_descriptor> Pyke Syndicate operative",

	"<employer_descriptor> pirate who values their privacy, and their freedom",
	"<employer_descriptor> Westside Annie",

	"<employer_descriptor> business executive who wishes to remain anonymous",

	"<employer_descriptor> mining facility <location>",
	"<employer_descriptor> Mining Guild representative",

	"<employer_descriptor> Rebel supporter in dire need",

	"<employer_descriptor> Imperial leader",

	"<employer_descriptor> broker who shall go by a nickname for business purposes",

	"<employer_descriptor> local politician",

	"<employer_descriptor> archeologist",

	"<employer_descriptor> old friend of yours",

	"<employer_descriptor> Senator of some import",

	"<employer_descriptor> corporate interest",

	"<employer_descriptor> antiquities dealer",

	"<employer_descriptor> smuggler",

	"<employer_descriptor> biolab scientist",

	"<employer_descriptor> Jedi in hiding",

	"<employer_descriptor> colonist leader",

	"<employer_descriptor> entrepreneur",
];

mission_imperial_employers = [
	"<employer_empire_descriptor> business executive who wishes to remain anonymous",
	"<employer_empire_descriptor> Rebel supporter in dire need",
	"<employer_empire_descriptor> Imperial leader",
	"<employer_empire_descriptor> broker who shall go by a nickname for business purposes",
	"<employer_empire_descriptor> local politician",
	"<employer_empire_descriptor> archeologist",
	"<employer_empire_descriptor> old friend of yours",
	"<employer_empire_descriptor> Senator of some import",
	"<employer_empire_descriptor> corporate interest",
	"<employer_empire_descriptor> antiquities dealer",
	"<employer_empire_descriptor> biolab scientist",
	"<employer_empire_descriptor> entrepreneur",
];

mission_oldwest_employers = [
	"<employer_oldwest_descriptor> Hutt who wishes to remain anonymous for now",
	"<employer_oldwest_descriptor> shadowy Crime Syndicate",
	"<employer_oldwest_descriptor> Black Sun syndicate operative",
	"<employer_oldwest_descriptor> Pyke Syndicate operative",
	"<employer_oldwest_descriptor> pirate who values their privacy, and their freedom",
	"<employer_oldwest_descriptor> mining facility <location>",
	"<employer_oldwest_descriptor> Mining Guild representative",
	"<employer_oldwest_descriptor> Rebel supporter in dire need",
	"<employer_oldwest_descriptor> Imperial leader",
	"<employer_oldwest_descriptor> broker who shall go by a nickname for business purposes",
	"<employer_oldwest_descriptor> local politician",
	"<employer_oldwest_descriptor> archeologist",
	"<employer_oldwest_descriptor> old friend of yours",
	"<employer_oldwest_descriptor> corporate interest",
	"<employer_oldwest_descriptor> antiquities dealer",
	"<employer_oldwest_descriptor> smuggler",
	"<employer_oldwest_descriptor> biolab scientist",
	"<employer_oldwest_descriptor> Jedi in hiding",
	"<employer_oldwest_descriptor> colonist leader",
	"<employer_oldwest_descriptor> entrepreneur",
];

// @TODO not used yet
//const mission_employer_named = [
//	"<descriptor> Red Avenger",
//	"<descriptor> Zorgar the Hutt",
//	"<descriptor> Thragnar the Hutt",
//];

const mission_employer_descriptors = [
	"a corrupt",
	"a power-hungry",
	"a suspicious",
	"a sincere-sounding",
	"a wealthy",
	"a shady",
	"an arrogant",
	"a mysterious",
	"a newbie",
	"an aggressive",
	"a secretive",
	"a polite",
	"a humble",
	"an anxious",
	"a busy",
	"a pompous",
	"a well-travelled",
	"an injured",
	"a well-dressed",
];

const mission_employer_empire_descriptors = [
	"a corrupt",
	"a power-hungry",
	"a suspicious",
	"a sincere-sounding",
	"a wealthy",
	"an arrogant",
	"a mysterious",
	"a secretive",
	"a polite",
	"a humble",
	"an anxious",
	"a busy",
	"a pompous",
	"a well-travelled",
	"an injured",
];

const mission_employer_oldwest_descriptors = [
	"a corrupt",
	"a suspicious",
	"a sincere-sounding",
	"a shady",
	"a mysterious",
	"an aggressive",
	"a secretive",
	"an anxious",
	"a busy",
	"a well-travelled",
	"an injured",
];

const mission_payments = [
	"300cr each",
	"cancelling your obligation",
	"a share in the profits",
	"this excess inventory",
	"5000 credits total",
];

const mission_locations = [
	"on Jakku",
	"on Merj",
	"on Mon Gazza",
	"on Nal Hutta",
	"on Nurasenti",
	"on Port Haven",
	"on Savareen",
	"on Coruscant",
	"in the Mid Rim",
	"in the Outer Rim",
	"on Nar Shadda",
	"on Tatooine",
	"in the Inner Rim",
	"in the Core",
	"in the Tion Cluster",
	"on Ord Mantell",
	"on Rodia",
	"in the Deep Core",
	"in the Expansion Region",
	"on Felucia",
	"on Kashyyyk",
	"on Bespin",
];

const mission_empire_locations = [
	"on Coruscant",
	"in the corridors of power on Coruscant",
	"in the upper levels of Coruscant",
	"on a Coruscant undercity",
	"in the Mid Rim",
	"in the Outer Rim",
	"in the Inner Rim",
	"in the Core",
	"in the Tion Cluster",
	"in the Deep Core",
	"in the Expansion Region",
	"on Corellia",
	"on Duro",
	"at the Kuat shipyards",
	"on Neimoidia",
	"on Alderaan",
];

const mission_oldwest_locations = [
	"on Jakku",
	"on Merj",
	"on Mon Gazza",
	"on Nal Hutta",
	"on Nurasenti",
	"on Port Haven",
	"on Savareen",
	"in the Mid Rim",
	"in the Outer Rim",
	"on Nar Shadda",
	"on Tatooine",
	"in the Inner Rim",
	"on Ord Mantell",
	"on Rodia",
	"in the Expansion Region",
	"on Felucia",
	"on Kashyyyk",
	"on Bespin",
];

const mission_heist_items = [
	"a datapad",
	"a famous gem",
	"spice",
	"coaxium",
	"a droid",
	"an ancient artifact",
	"a credit stash",
	"a skull",
	"a Jedi holocron",
	"a forbidden Sith relic",
	"a freighter",
	"a lost treasure",
	"a private yacht",
	"a lightsaber",
	"weapon schematics",
	"DNA",
	"Imperial uniforms",
	"a trophy",
	"part of a ship",
	"a physical key",
];

const mission_heist_targets = [
	"a casino",
	"a Hutt treasury",
	"a crash site",
	"a museum",
	"another thief",
	"an armored security transport",
	"an ancient vault",
	"a crime syndicate",
	"a pirate stronghold",
	"a spaceport",
	"an Imperial outpost",
	"a Royal convoy",
	"a deadly temple",
	"an Imperial caravan",
	"an abandoned Rebel base",
	"a old space station",
	"an asteroid field",
	"a Senator's office",
	"a slaver",
	"a Force user",
];

const mission_heist_events = [
	"the sports competition ends",
	"Imperials arrive",
	"the sun goes supernova",
	"the location is destroyed",
	"it is stolen by someone else",
	"the new security system is installed",
	"the execution date",
	"wild animals destroy it",
	"the convention ends",
	"the item is sold at auction",
	"Rebels arrive",
	"the council meets",
	"the stars align",
	"disaster strikes",
	"the last transport leaves",
	"a celebration next week",
	"the environment turns deadly",
	"guard shift rotation",
	"the superweapon charges",
	"the item is sealed forever",
];

const mission_heist_empire_events = [
	"the sports competition ends <empire_location>",
	"Imperials arrive <empire_location>",
	"the location is destroyed <empire_location>",
	"it is stolen by someone else <empire_location>",
	"the new security system is installed <empire_location>",
	"the execution date <empire_location>",
	"the convention ends <empire_location>",
	"the item is sold at auction <empire_location>",
	"the council meets <empire_location>",
	"a celebration next week <empire_location>",
	"guard shift rotation <empire_location>",
];

const mission_heist_oldwest_events = [
	"the sports competition ends <oldwest_location>",
	"Imperials arrive <oldwest_location>",
	"the sun goes supernova <oldwest_location>",
	"the location is destroyed <oldwest_location>",
	"it is stolen by someone else <oldwest_location>",
	"the new security system is installed <oldwest_location>",
	"the execution date <oldwest_location>",
	"wild animals destroy it <oldwest_location>",
	"the item is sold at auction <oldwest_location>",
	"Rebels arrive <oldwest_location>",
	"the stars align <oldwest_location>",
	"disaster strikes <oldwest_location>",
	"the last transport leaves <oldwest_location>",
	"a celebration next week <oldwest_location>",
	"the environment turns deadly <oldwest_location>",
	"guard shift rotation <oldwest_location>",
	"the superweapon charges <oldwest_location>",
	"the item is sealed forever <oldwest_location>",
];

const mission_espionage_tasks = [
	"spy on",
	"infiltrate",
	"expose",
	"uncover",
	"gather intelligence on",
	"do surveillance on",
	"wiretap",
	"discover secrets about",
	"invade",
	"sneak into",
	"go undercover",
	"hack into",
	"access data in",
	"eavesdrop on",
	"monitor",
	"validate their conspiracy about",
	"learn about",
	"question persons at",
	"do covert ops",
	"learn the truth about",
];

const mission_espionage_targets = [
	"an Imperial installation",
	"a crime syndicate operation",
	"Senate chambers",
	"a Hutt palace",
	"a luxury transport",
	"a space station",
	"a pirate capital ship",
	"a manufacturing plant",
	"a communication complex",
	"a mining facility <location>",
	"a Rebel safe house",
	"a private casino",
	"a secret wilderness base",
	"a restricted Force temple",
	"an entertainment spectacle",
	"a medical frigate",
	"a formal banquet",
	"a racing event",
	"a mysterious inner circle",
	"an Imperial prison",
];

const mission_espionage_empire_targets = [
	"an Imperial installation <empire_location>",
	"Senate chambers",
	"a luxury transport <empire_location>",
	"a space station <empire_location>",
	"a manufacturing plant <location>",
	"a communication complex <location>",
	"a Rebel safe house <empire_location>",
	"a private casino <empire_location>",
	"an entertainment spectacle <empire_location>",
	"a medical frigate <location>",
	"a formal banquet <empire_location>",
	"a racing event <empire_location>",
	"a mysterious inner circle <empire_location>",
	"an Imperial prison <empire_location>",
];

const mission_espionage_oldwest_targets = [
	"an Imperial installation <oldwest_location>",
	"a crime syndicate operation <oldwest_location>",
	"a Hutt palace <oldwest_location>",
	"a luxury transport <oldwest_location>",
	"a space station <oldwest_location>",
	"a pirate capital ship <oldwest_location>",
	"a manufacturing plant <oldwest_location>",
	"a communication complex <oldwest_location>",
	"a mining facility <location>",
	"a Rebel safe house <location>",
	"a private casino <location>",
	"a secret wilderness base <oldwest_location>",
	"a restricted Force temple <oldwest_location>",
	"an entertainment spectacle <oldwest_location>",
	"a medical frigate <oldwest_location>",
	"a formal banquet <location>",
	"a racing event <oldwest_location>",
	"a mysterious inner circle <location>",
	"an Imperial prison <oldwest_location>",
];

const mission_espionage_reasons = [
	"people are missing",
	"there are rumors of evil happening",
	"secret codes are needed",
	"it's not what it seems",
	"the client needs blackmail material",
	"we need to find the mole",
	"someone needs to be interrogated",
	"we need information planted there",
	"we need to upload this data",
	"there are rumors of a planned assassination",
	"ruthless experiments are going on",
	"credentials need to be changed",
	"equipment needs to be returned to us",
	"we need to know their tactics",
	"revenge will be had",
	"we need to confirm this data",
	"there is a larger strike planned",
	"we need to know their vulnerabilities",
	"a datacube has vital information",
	"terrorists have threatened violence",
];

const mission_escort_persons = [
	"<escort_person_descriptor> scientist",
	"<escort_person_descriptor> traitor",
	"<escort_person_descriptor> Force user",
	"<escort_person_descriptor> spy",
	"<escort_person_descriptor> outlaw",
	"<escort_person_descriptor> noble",
	"<escort_person_descriptor> slave",
	"<escort_person_descriptor> performer",
	"<escort_person_descriptor> diplomat",
	"<escort_person_descriptor> droid",
	"<escort_person_descriptor> merchant",
	"<escort_person_descriptor> administrator",
	"<escort_person_descriptor> crime lord",
	"<escort_person_descriptor> pirate",
	"<escort_person_descriptor> miner",
	"<escort_person_descriptor> archeologist",
	"<escort_person_descriptor> friend of yours",
	"<escort_person_descriptor> farmer",
	"<escort_person_descriptor> leader",
	"<escort_person_descriptor> gladiator",
];

const mission_escort_empire_persons = [
	"<escort_person_descriptor> scientist",
	"<escort_person_descriptor> traitor",
	"<escort_person_descriptor> Force user",
	"<escort_person_descriptor> spy",
	"<escort_person_descriptor> noble",
	"<escort_person_descriptor> performer",
	"<escort_person_descriptor> diplomat",
	"<escort_person_descriptor> droid",
	"<escort_person_descriptor> merchant",
	"<escort_person_descriptor> administrator",
	"<escort_person_descriptor> archeologist",
	"<escort_person_descriptor> friend of yours",
	"<escort_person_descriptor> leader",
];

const mission_escort_oldwest_persons = [
	"<escort_person_descriptor> scientist",
	"<escort_person_descriptor> traitor",
	"<escort_person_descriptor> Force user",
	"<escort_person_descriptor> spy",
	"<escort_person_descriptor> outlaw",
	"<escort_person_descriptor> slave",
	"<escort_person_descriptor> performer",
	"<escort_person_descriptor> diplomat",
	"<escort_person_descriptor> droid",
	"<escort_person_descriptor> merchant",
	"<escort_person_descriptor> administrator",
	"<escort_person_descriptor> crime lord",
	"<escort_person_descriptor> pirate",
	"<escort_person_descriptor> miner",
	"<escort_person_descriptor> archeologist",
	"<escort_person_descriptor> friend of yours",
	"<escort_person_descriptor> farmer",
	"<escort_person_descriptor> leader",
	"<escort_person_descriptor> gladiator",
];

const mission_escort_person_descriptors = [
	"a Hutt",
	"a Rebel",
	"an Imperial",
	"an escaped",
	"a mysterious",
	"a wanted",
	"a sick",
	"an old",
	"a crazy",
	"a paranoid",
	"a charming",
	"a bossy",
	"a prideful",
	"a dangerous",
	"a gruff",
	"a dying",
	"a cybernetic",
	"a homicidal",
	"a greedy",
	"a nervous",
];

const mission_escort_person_details = [
	"with <heist_item>",
	"on a hoverchair",
	"clutching 8 filled vials",
	"holding a code cylinder",
	"intensely watching the HoloNews",
	"with bloody hands",
	"with a bag of credits",
	"tinkering on a device",
	"drinking Cortyg Brandy",
	"with four blasters",
	"with no expressions",
	"coughing constantly",
	"with secrets to tell",
	"with security guards",
	"with a decorative cane",
	"who doesn't speak Basic",
	"wearing goggles",
	"hiding in the shadows",
	"missing teeth",
	"with visible scars",
];

const mission_from_locations = [
	"a palace <location>",
	"a prison <location>",
	"a space station <location>",
	"a military ship <location>",
	"a transport <location>",
	"a downed ship <location>",
	"a hovertrain <location>",
	"a remote colony <location>",
	"a detention center <location>",
	"a research station <location>",
	"the loading docks <location>",
	"a space port <location>",
	"a gang hideout <location>",
	"an asteroid field <location>",
	"a mining facility <location>",
	"a refinery <location>",
	"an underground camp <location>",
	"a tournament <location>",
	"a secure location <location>",
	"a party <location>",
];

const mission_from_empire_locations = [
	"a palace <empire_location>",
	"a prison <empire_location>",
	"a space station <empire_location>",
	"a military ship <empire_location>",
	"a transport <empire_location>",
	"a downed ship <empire_location>",
	"a hovertrain <empire_location>",
	"a remote colony <empire_location>",
	"a detention center <empire_location>",
	"a research station <empire_location>",
	"the loading docks <empire_location>",
	"a space port <empire_location>",
	"a tournament <empire_location>",
	"a secure location <empire_location>",
	"a party <empire_location>",
];

const mission_from_oldwest_locations = [
	"a palace <oldwest_location>",
	"a prison <oldwest_location>",
	"a space station <oldwest_location>",
	"a military ship <oldwest_location>",
	"a transport <oldwest_location>",
	"a downed ship <oldwest_location>",
	"a hovertrain <oldwest_location>",
	"a remote colony <oldwest_location>",
	"a detention center <oldwest_location>",
	"a research station <oldwest_location>",
	"the loading docks <oldwest_location>",
	"a space port <oldwest_location>",
	"a gang hideout <oldwest_location>",
	"an asteroid field <oldwest_location>",
	"a mining facility <oldwest_location>",
	"a refinery <oldwest_location>",
	"an underground camp <oldwest_location>",
	"a tournament <oldwest_location>",
	"a secure location <oldwest_location>",
	"a party <oldwest_location>",
];

const mission_to_locations = [
	"a nearby cantina",
	"the other side of town",
	"a flea market",
	"a nightclub",
	"a cafe around the corner",
	"an incoming transport",
	"the shipping docks <location>",
	"a spaceport <location>",
	"a medical facility <location>",
	"a casino <location>",
	"a remote island <location>",
	"an orbital station <location>",
	"a side alley",
	"a safehouse nearby",
	"a theater <location>",
	"an archeological dig <location>",
	"the wilderness <location>",
	"a remote and hidden shack <location>",
	"an observatory <location>",
	"a race track <location>",
];

const mission_to_empire_locations = [
	"a nearby cantina",
	"the other side of town",
	"a flea market",
	"a nightclub",
	"a cafe around the corner",
	"an incoming transport",
	"the shipping docks <empire_location>",
	"a spaceport <empire_location>",
	"a medical facility <empire_location>",
	"a casino <empire_location>",
	"an orbital station <empire_location>",
	"a side alley",
	"a safehouse nearby",
	"a theater <empire_location>",
	"an archeological dig <empire_location>",
	"an observatory <empire_location>",
	"a race track <empire_location>",
];

const mission_to_oldwest_locations = [
	"a nearby cantina",
	"the other side of town",
	"a flea market",
	"a nightclub",
	"a cafe around the corner",
	"an incoming transport",
	"the shipping docks <oldwest_location>",
	"a spaceport <oldwest_location>",
	"a medical facility <oldwest_location>",
	"a casino <oldwest_location>",
	"a remote island <oldwest_location>",
	"an orbital station <oldwest_location>",
	"a side alley",
	"a safehouse nearby",
	"a theater <oldwest_location>",
	"an archeological dig <oldwest_location>",
	"the wilderness <oldwest_location>",
	"a remote and hidden shack <oldwest_location>",
	"an observatory <oldwest_location>",
	"a race track <oldwest_location>",
];

const mission_oppositions = [
	"Black Sun",
	"pirates",
	"the Hutts",
	"the Empire",
	"slavers",
	"a bounty hunter",
	"loan sharks",
	"the Rebels",
	"Mandalorians",
	"CSA",
	"Sector Rangers",
	"the Zann Consortium",
	"the Tenlos Syndicate",
	"Gand Findsmen",
	"the Sith",
	"the Trade Federation",
	"ferocious creatures",
	"raiders",
	"a swoop gang",
	"corrupt local government",
];

const mission_empire_oppositions = [
	"Black Sun",
	"pirates",
	"the Hutts",
	"the Empire",
	"a bounty hunter",
	"loan sharks",
	"Mandalorians",
	"CSA",
	"Sector Rangers",
	"the Zann Consortium",
	"the Tenlos Syndicate",
	"the Sith",
	"the Trade Federation",
	"a swoop gang",
	"corrupt local government",
];

const mission_oldwest_oppositions = [
	"Black Sun",
	"pirates",
	"the Hutts",
	"the Empire",
	"slavers",
	"a bounty hunter",
	"loan sharks",
	"the Rebels",
	"Mandalorians",
	"the Zann Consortium",
	"the Tenlos Syndicate",
	"Gand Findsmen",
	"the Sith",
	"ferocious creatures",
	"raiders",
	"a swoop gang",
	"corrupt local government",
];

const mission_protect_targets = [
	"a remote outpost <location>",
	"a group of farmers <location>",
	"an important Senator",
	"an Imperial leader",
	"a spaceport <location>",
	"a fledgling colony <location>",
	"a witness to a crime",
	"a research station <location>",
	"a science lab <location>",
	"a group of runaway children",
	"an injured survivor",
	"these endangered animals",
	"an isolated tower <location>",
	"a small village <location>",
	"a wealthy entrepreneur <location>",
	"a mining settlement <location>",
	"a crime lord <location>",
];

const mission_protect_empire_targets = [
	"an important Senator",
	"a spaceport <empire_location>",
	"a witness to a crime",
	"a science lab <empire_location>",
	"a group of runaway children",
	"an isolated tower <empire_location>",
	"a wealthy entrepreneur <empire_location>",
	"a crime lord <empire_location>",
];

const mission_protect_oldwest_targets = [
	"a remote outpost <oldwest_location>",
	"a group of farmers <oldwest_location>",
	"a spaceport <oldwest_location>",
	"a fledgling colony <oldwest_location>",
	"a witness to a crime",
	"a research station <oldwest_location>",
	"a science lab <oldwest_location>",
	"a group of runaway children",
	"an injured survivor",
	"these endangered animals",
	"an isolated tower <oldwest_location>",
	"a small village <oldwest_location>",
	"a mining settlement <oldwest_location>",
	"a crime lord <oldwest_location>",
];

const mission_protect_threats = [
	"Black Sun operatives",
	"pirates",
	"Hutt enforcers",
	"elements of the Empire",
	"slavers",
	"bounty hunters",
	"COMPNOR",
	"Rebel agents",
	"Mandalorian mercenaries",
	"the CSA",
	"hired thugs",
	"a droid army",
	"Gand Findsmen",
	"a Sith hunter/killer team",
	"the Trade Federation",
	"assassins",
	"raiders",
	"a swoop gang",
	"a released criminal and their gang",
];

const mission_protect_empire_threats = [
	"elements of the Empire <empire_location>",
	"bounty hunters <empire_location>",
	"COMPNOR <empire_location>",
	"Rebel agents <empire_location>",
	"Mandalorian mercenaries <empire_location>",
	"the CSA <empire_location>",
	"hired thugs <empire_location>",
	"a droid army <empire_location>",
	"a Sith hunter/killer team <empire_location>",
	"the Trade Federation <empire_location>",
	"assassins <empire_location>",
	"a swoop gang <empire_location>",
];

const mission_protect_oldwest_threats = [
	"Black Sun operatives <oldwest_location>",
	"pirates <oldwest_location>",
	"Hutt enforcers <oldwest_location>",
	"elements of the Empire <oldwest_location>",
	"slavers <oldwest_location>",
	"bounty hunters <oldwest_location>",
	"Rebel agents <oldwest_location>",
	"Mandalorian mercenaries <oldwest_location>",
	"hired thugs <oldwest_location>",
	"a droid army <oldwest_location>",
	"Gand Findsmen <oldwest_location>",
	"a Sith hunter/killer team <oldwest_location>",
	"assassins <oldwest_location>",
	"raiders <oldwest_location>",
	"a swoop gang <oldwest_location>",
	"a released criminal and their gang <oldwest_location>",
];

const mission_protect_events = [
	"at sundown",
	"in three days",
	"when their leader arrives",
	"at the end of harvest",
	"before the last ship leaves",
	"when the creature is let loose",
	"when the celebration starts",
	"at the sound of the sirens",
	"after the storm dies down",
	"before the great darkness",
	"sometime at the convention",
	"after the council meets",
	"when the planets align",
	"when the river runs dry",
	"in a few hours",
	"during the gathering next week",
	"tomorrow at the latest",
	"when the target is in public",
];

const mission_collect_items = [
	"a special animal",
	"a valuable gem",
	"a mystic crystal",
	"an alchemist's notebook",
	"a lost droid",
	"a rare herb",
	"this bottle of fine wine",
	"a rare artifact of indescribable value",
	"drifting scrap",
	"this prototype",
	"a copy of this contract",
	"this key",
	"this datapad",
	"this special implant",
	"vital evidence",
	"this glowing orb",
];

const mission_collect_reasons = [
	"it will aid in repairs",
	"it will heal the sickness",
	"it will give us a competitive edge",
	"it has critical information",
	"it will break the curse",
	"it will save the business",
	"it has great influence",
	"it will help find a loved one",
	"it has great power",
	"it will restore balance",
	"it will right a wrong",
	"it will vanquish evil",
	"it will fulfill a prophecy",
	"it will unite the people",
	"it will their finest trophy",
	"it was stolen from us",
	"it contains secrets which we must know",
	"it will make a good gift",
	"it is of great value",
	"it needs to be seen by everyone",
];

const mission_collect_locations = [
	"a hidden crypt <location>",
	"a forbidden tower <location>",
	"a ship graveyard <location>",
	"a deep underground <location>",
	"a chaotic asteroid belt <location>",
	"the bottom of a lake <location>",
	"<ship_location> a luxury ship",
	"the sewers <location>",
	"a warehouse <location>",
	"a corporate office <location>",
	"a noble house <location>",
	"my rival's trophy room",
	"a ruined city <location>",
	"the worst criminal slums <location>",
	"a spaceport <location>",
	"the city outskirts <location>",
	"a remote location <location>",
	"a manufacturing plant <location>",
	"a refinery <location>",
	"a large pit <location>",
	"a mountain <location>",
];

const mission_ship_locations = [
	"the cargo hold of",
	"the captains quarters of",
	"the engine room of",
	"the galley of",
];

const mission_collect_events = [
	"<protect_threat> gets it first",
	"the zone becomes hazardous",
	"the Empire claims it",
	"it is destroyed by nature",
	"the mutations begin",
	"pirates become aware of it",
	"the path is lost",
	"it is transported away",
	"its power is depleted",
	"it breaks",
	"the ceremony starts",
	"darkness falls",
	"it attracts more attention",
	"criminals steal it",
	"sickness spreads",
];

const mission_bounty_targets = [
	"a hardened killer",
	"a dangerous beast",
	"a reputed Force wielder",
	"a spy",
	"an informant",
	"a crime lord",
	"a government official",
	"a smuggler",
	"a pirate",
	"an assassin",
	"a Rebel Alliance officer",
	"an Imperial defector",
	"a rogue droid",
	"a terrorist cell",
	"a thief",
	"someone who owes a debt",
	"an escaped slave",
	"a talented slicer",
	"an experimental scientist",
];

const mission_bounty_locations = [
	"a cantina <location>",
	"a transport <trade_route>",
	"<coruscant_location> Coruscant",
	"the rings of Bothawui",
	"Fondor Station",
	"Nal Hutta as a guest of the Hutts",
	"the Corporate Sector",
	"a resort <location>",
	"Bespin's Cloud City",
	"a mining camp <location>",
	"a casino <location>",
	"a secure compound <location>",
	"a hunters' camp <location>",
	"a spaceport <location>",
	"the Corellian Sector of Nar Shaddaa",
];

const mission_trade_routes = [
	"the Corellian Run",
	"the Rimma Trade Route",
	"the Perlemian Trade Route",
	"the Hydian Way",
	"the Corellian Trade Spine",
	"the Triellus Trade Route",
	"the Corellian Skip Run",
	"the Kessel Run",
	"the Kessel Trade Corridor",
	"the Namadii Corridor",
	"the Metellos Trade Route",
	"the Gamor Run",
	"the Harrin Trade Corridor",
	"the Duros Space Run",
	"the Reena Trade Route",
	"the Llanic Spice Run",
	"the Death Wind Corridor",
	"the Old Corellian Run",
	"the Ryloth Road",
	"the Shapani Bypass",
	"the Giju Run",
	"the Enarc Run",
	"the Ado Spine",
	"the Senex Trace",
	"the Nothoiin Corridor",
	"the Lipsec Run",
	"the Sharlissian Trade Corridor",
	"the Coyn Route",
	"the Trition Trade Route",
	"the Koros Trunk Line",
	"the Commenor Run",
	"the Vaathkree Trade Corridor",
	"the Randon Run",
	"the Salin Corridor",
	"the Shaltin Tunnels",
	"the Tion Trade Route",
	"the Overic Griplink",
	"the Tingel Route",
	"the Solenbaran Merchant Route",
	"the Trianii Shunt",
	"the Authority Guardian Corridor",
	"the Lo'Uran-Lythos hyperlane",
	"the Intra-Sector Spur",
	"the Listehol Run",
	"the Junction-Tierell Loop",
	"the Thesme Trace",
	"the Celanon Spur",
	"the Braxant Run",
	"the Shwuy Exchange",
	"the Trellen Trade Route",
	"the Quellor Run",
	"the Shipwrights' Trace",
	"the Great Gran Run",
	"the D'Aelgoth Trade Route",
	"the Senex-Juvex Loop",
	"the Velga Route",
	"the Agarix Trade Route",
	"the Ison Trade Corridor",
	"the Cerean Reach",
	"the Spar Trade Route",
	"the Annaj-Houche Run",
	"the Ovise Reach",
	"the Bakura Trace",
	"the Shiritoku Way",
	"the Trindello-Endor Route",
	"the Sanctuary Pipeline",
	"the Nanth'ri Trade Route",
	"the Ootmian Pabol",
	"the Nightroad",
	"the Great Kashyyyk Branch",
	"the Durkteel Loop",
	"the Dauntless Run",
	"the Terr'skiar Pass",
	"the Trax Tube",
	"the Pabol Sleheyron",
	"the The Dead Road",
	"the Pabol Hutta",
	"the Oktos Route",
	"the Shag Pabol",
	"the The Sy-Y",
	"the Hollastin Run",
	"the Kaaga Run",
	"the Tatooine Dash",
	"the Manda Merchant Route",
	"the Bothan Run",
	"the Manda-Roon Merchant Route",
	"the Lesser Lantillian Route",
	"the Ilosian Spur",
	"the Cadma Conduit",
	"the Falko Run",
	"the Arleen Loop",
	"the Sheela Run",
	"the Sisar Run",
	"the Ac'fren Spur",
	"the Pando Spur",
	"the The Crystal Passage",
	"the 5709-DC Shipping Lane",
	"the Rycar's Run",
	"the Relgim Run",
	"the Entralla Route",
	"the Veragi Trade Route",
	"the Myto's Arrow",
	"the Axxila–Tangrene hyperlane",
	"the Gordian Reach",
	"the Pinooran Spur",
	"the Junction-Tierell Loop",
	"the Wetyin's Way",
	"the Korphir Trace",
	"the Bronsoon–Maridun hyperspace route",
	"the Yavin Bypass",
	"the Tertiary Solenbaran",
	"the Etti Route Major",
	"the Rampa Rapids",
	"the Tertiary Etti Route",
	"the Pakuuni Drift",
	"the Rudrig-Gbu Way",
	"the Minntooine Spur",
	"the Giblim Route",
	"the Prously's Rim Run",
	"the Greater Cronese Arc",
	"the Lesser Cronese Arc",
	"the Indrexu Route",
	"the Kismaano Bypass",
	"the Cadinth Run",
	"the Desevran Trace",
	"the Tidal Circuit",
	"the Lucaya Cross",
	"the Agricultural Circuit",
	"the Byss Run",
	"the Koros-Tython hyperlane",
	"the Elrood-Derilyn Trade Route",
	"the The Extreme",
	"the Sanrafsix Corridor",
	"the Yankirk Route",
	"the Lutrillian Cross",
	"the Procopian Shipping Lane",
	"the Giju Run",
	"the Three Ellas Run",
	"the Dorella-Doris hyperlane",
	"the Sorella-Tanya hyperlane",
	"the Calipsa Run",
	"the Calipsa Province",
	"the Mecetti Province",
	"the Trans Gulf Route",
	"the Leozi Route",
	"the Najiba Loop",
	"the Vaschean Way",
	"the Five Veils Route",
	"the Kira Run",
	"the Metellos–Ilum hyperlane",
	"the Hyabb-Twith Corridor",
	"the Rago Run",
	"the Murgo Choke",
	"the Cranan-Excarga Route",
	"the Caloria Run",
	"the Burke's Trailing",
	"the Hidakai Pool",
	"the Biox Detour",
];

const mission_coruscant_locations = [
	"level 1588 on",
	"a swoop bike chop shop in the slums of",
	"a greasy diner on",
	"deep in the bowels of",
];

const mission_bounty_types = [
	"Alive",
	"Dead or Alive",
	"No Preference",
	"Captured",
	"Restrained",
	"Dead with proof",
	"Unspecified",
];

const mission_bounty_payments = [
	"200cr each",
	"500cr each",
	"1000cr each",
	"5000cr total",
];

const mission_smuggle_cargos = [
	"a shipment of food supplies",
	"a load of salvage",
	"these crates of droid parts",
	"this custom speeder bike",
	"critically needed bacta supplies",
	"this baby animal",
	"this dejarik holotable",
	"these crates, which are not to be opened,",
	"this donated organ",
	"a private yacht",
	"this datapad",
	"these pallets of vehicle parts",
	"a shipment of refined coaxium",
	"this ancient artifact",
	"this key",
	"desperately needed colony supplies",
	"these mechanical parts",
	"all this raw ore",
	"this industrial gas",
	"these settlers",
];

const mission_smuggle_contrabands = [
	"these goods, which should remain hidden,",
	"this skull, which may draw unwanted attention,",
	"these weapons, which are not <i>strictly</i> legal,",
	"this prototype, which needs to remain secret,",
	"this DNA sample, which must be kept hidden and protected,",
	"this delightful pet, which some authorities wrongfully judge to be illegal,",
	"a jewel you may have heard of",
	"these weapons, which are foolishly outlawed,",
	"these schematics, which my enemies desperately desire,",
	"this device, which seems to resonate with the Force,",
	"this droid, which must always have a restraining bolt,",
	"these Wookiee pelts",
	"a shipment of \"pharmaceuticals\" that the corporations don't control",
	"this strange device which emits a meter-long plasma blade when this button is pressed",
	"these Imperial uniforms and armor",
	"these slaves",
	"a tank of highly volatile fuel",
	"these Rebel soldiers",
	"these barrels of hazardous chemicals",
];

const mission_smuggle_contacts = [
	"a protocol droid",
	"a contact at the cantina",
	"a contact with a blue mohawk",
	"a human in a black jumpsuit",
	"a dockhand named Pid",
	"the port authority",
	"a Trandoshan with a handbag",
	"a Duro in a jaunty hat",
	"someone you will recognize",
	"an Imperial with a rosebud lapel pin",
	"a Rodian with a mustache",
	"a medical professional",
	"what appears to be a child",
	"a food vendor offering \"hot plook\"",
	"A Dug in a green scarf",
];

const mission_negotiate_types = [
	"mediate a dispute",
	"strike a deal",
	"negotiate an agreement",
	"incite animosity",
	"deliver grave news",
	"negotiate a treaty",
	"forge an alliance",
	"sow distrust",
	"avert conflict",
	"negotiate a trade route",
];

const mission_negotiate_parties = [
	"a black marketer",
	"the pirates",
	"the raiders",
	"the Hutts",
	"the Empire",
	"the slavers",
	"the Bounty Hunter Guild",
	"the Trade Federation",
	"the Rebel Alliance",
	"the Mandalorians",
	"a crime syndicate",
	"a swoop gang",
	"the local government",
	"a local business",
	"the Senator",
	"the scientists",
	"the mining facility",
	"your friend",
	"the archeological crew",
	"the farmers",
];

const mission_explore_types = [
	"explore",
	"map",
	"search",
	"find",
	"chart",
	"discover",
	"survey",
	"scout",
	"research",
	"study",
	"analyze",
	"catalog",
];

const mission_explore_targets = [
	"an uncharted system",
	"a newly discovered planet",
	"an asteroid field",
	"an ancient ruin",
	"an abandoned space station",
	"an underwater temple",
	"a hidden Imperial base",
	"a criminal hideout",
	"a crash site",
	"a new hyperspace lane",
	"a jungle",
	"a cave system",
];

const mission_explore_reasons = [
	"it may have rich resources",
	"we need to make a decision soon",
	"we want to find a better route",
	"the library is incomplete",
	"the archive shows a discrepancy",
	"we need to uncover a mystery",
	"we need to find it, soon",
	"we think it may be very valuable",
	"we have searched everywhere else",
	"it may help us understand the other situation",
	"there may be rare materials there",
	"we need to verify or dispute the rumors",
];

const mission_sabotage_targets = [
	"the Imperial sensor net",
	"a Hutt sail barge",
	"a crime lord",
	"a swoop bike gang",
	"the Imperial Governor",
	"a pirate leader",
	"a saboteur",
	"a Dark Force user",
	"a runaway transport",
	"a great weapon",
	"rampaging beasts",
	"a droid uprising",
	"the delivery",
	"the bio-bomb going off",
	"the shield generator",
	"the Rebel fleet",
	"this slaver and their shipment",
	"the merciless invaders",
	"a rogue military leader",
];

const mission_sabotage_events = [
	"the cataclysm",
	"the convoy arrives",
	"power is restored",
	"the deal is finalized",
	"the demonstration",
	"the relic is delivered",
	"the Empire arrives",
	"the invasion begins",
	"the go-ahead is given",
	"the moons align",
	"daylight",
	"the storm",
	"access is denied",
	"contact is lost",
	"it enters the atmosphere",
	"it is fully charged",
];

const mission_sabotage_outcomes= [
	"the village will be destroyed",
	"it will be a massacre",
	"the shipment will be lost forever",
	"crime in this sector will skyrocket",
	"it will cost me a large amount of credits",
	"great planetary destruction is likely",
	"assassins will have their target",
	"the wall will fall",
	"the message won't get through",
	"the wrong person will be framed",
	"innocents will be poisoned",
	"they will all be enslaved",
	"there won't be enough time to save everyone",
	"there won't be enough time to escape",
];

const mission_invite_events = [
	"A Statue Dedication",
	"a pod race",
	"a swoop bike race",
	"a gambling tournament",
	"a Hutt banquet",
	"a cantina reopening",
	"a gladiatorial contest",
	"their luxury yacht",
	"an exotic zoo opening",
	"an opera performance",
	"a public execution",
	"a museum event",
	"a survival game",
	"a new ship launch",
	"a sporting event",
	"a weapons convention",
	"a crime syndicate council",
	"the trial of your relative",
	"a new resort opening",
	"a Big Game hunt",
];

const mission_invite_descriptors = [
	"it is <em>very</em> exclusive",
	"they promise to make it worth your while",
	"to bring your favorite drink",
	"to come in your best attire",
	"we won't take \"no\" for an answer",
	"to bring lots of credits",
	"wants to kick back a bit",
	"they are excited to see you",
	"you are getting the best seats",
	"there will be a banquet in your honor",
	"they have a lovely surprise for you",
	"they guarantee you won't want to miss it",
	"an escort will pick you up in one hour",
	"come armed",
	"don't bring your weapons",
	"reminds you to be prompt",
];
