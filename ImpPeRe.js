// @TODO Rarity lower/higher based on number of trade routes available
// @TODO https://starwars.fandom.com/wiki/Prison https://starwars.fandom.com/wiki/Stars%27_End/Legends
// @TODO galaxy map and links to specific (i.e., "A-1") location
// @TODO boosts/setbacks/upgrades options per location; see
//	https://starwars.fandom.com/wiki/Kala%27uun_Starport for example
//	https://starwars.fandom.com/wiki/Sarkan/Legends#Society_and_culture
// @TODO Pirate Holonet, ECS, Sensor Baffler, Sensor Shunt, Mobile Listening Post, Nightshadow Coating, Pseudo-Cloaking Device, Encryption Array
// @TODO "Undeclared" cargo, smuggler compartments
// @TODO Add https://starwars.fandom.com/wiki/Depatar/Legends to locations, but only if Pirate Holonet is installed; same for TDS
// @TODO Add local storage and remember events chosen

// Globals
currentLoc = {};
destLoc = {};
destRegion = {};
currentDestination = "unknown";
currentRegion = "unknown";
shipSilh = $('#silh').val();

$(document).ready(function () {
	switchFontBesh(); // set initial font

	// minimize collapsible sections
	$("#locationDetails").slideUp();
	$("#destinationDetails").slideUp();
	$("#manifest-menu-hidden").slideUp();
	$(".hidden").slideUp();

	// Default input values
	$('#cargo').val(0);
	$('#silh').val(4);
	$('#hyperdrive').val(15);

	populateLocationDropdown();
	populateDestinationDropdown();

	// Location dropdown events
	$("#locationDropdown").on("change", function () {
		$("#locationDetails").slideDown(); // display current location details
		switchFontNormal(); // reset font-family

		const currentLocation = $("#locationDropdown").val();
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
		$('#local-eventsLocation').text(currentLocation);

		updateCurrentDetails();

		updateLocalCustoms();

		updateTravelEstimates();

		updateLocalEvents();
	});

	// Destination dropdown events
	$("#destinationDropdown").on("change", function () {
		$("#destinationDetails").slideDown();
		switchFontNormal(); // reset font-family

		currentDestination = $("#destinationDropdown").val();
		destLoc = locations.find(item => item.Name === currentDestination); // JSON object
		destRegion = regions.find(region => region.Name === destLoc.Region); // JSON object

		updateDestDetails();

		updateTravelEstimates();

		updateDestDetails();
	});

	// On Change event for Ship Silhouette
	document.getElementById("silh").addEventListener("change", updateSilhouette);

	// On Change event for Hyperdrive Class
	document.getElementById("hyperdrive").addEventListener("change", updateTravelEstimates);

	// On Change event for Declared Cargo

	// On Change event for Undeclared Cargo

	// On Change event for Pirate Holonet
	document.getElementById("pirateHolonet").addEventListener("change", togglePirateHolonet);

	// On Change event for dropdown filters

	// General update of everything
	$("input").change(function() {
		populateLocationDropdown();
		populateDestinationDropdown();
	});
});

// Populate location dropdown
function populateLocationDropdown()
{
	const $locationDropdown = $("#locationDropdown");

	$("#locationDropdown").empty(); // clear previous list
	$("#locationDropdown").append('<option value="">-- Current Location --</option>');

	$.each(locations, function (index, location) {

		// Apply filters
		if ($("#filterCurrBlackMarket").is(":checked") && (! location.BlackMarket))	return;
		if ($("#filterCurrShadowport").is(":checked") && (! location.Shadowport)) return;
		// starport grade (goes backwards: Grade 1=best; in data file Starport 1=worst, 0=none)
		filterGrade = $("#filterCurrStarportGrade").val();
		if (filterGrade)
		{
			if ((filterGrade == 0 && location.Starport == 0) || // Grade 0 = unofficial "no starport here"; Grades go 1 (best) to 5 (worst)
				(filterGrade != (6 - location.Starport)) ) // Starport 5-1 matches Grades 1-5
			{
				return;
			}
		}

		tags = " ";
		if ($("#pirateHolonet").is(":checked"))
		{
			// Pirate HoloNet is installed, show some extra stuff
			if (location.BlackMarket)
			{
				tags += "[BM]";
			}
			if (location.Shadowport)
			{
				tags += "[sP]";
			}
			if (location.Starport > 0)
			{
				tags += "[*p" + (6 - location.Starport) + "]"; // Starport Grade 1=best, data file Starport 1=worst
			}
		}
		else
		{
			// secret pirate locations remain secret without Pirate HoloNet
			if (location.Name == "City Of Masks") return;
			if (location.Name == "Tantalus Detention Facility") return;
		}

		$locationDropdown.append(
			$("<option>", { value: location.Name, text: location.Name + tags })
		);
	});
}

// Populate destination dropdown
function populateDestinationDropdown()
{
	const $destinationDropdown = $("#destinationDropdown");

	$("#destinationDropdown").empty(); // clear previous list
	$("#destinationDropdown").append('<option value="">-- Select Destination --</option>');

	$.each(locations, function (index, location) {
		// Apply filters
		if ($("#filterDestBlackMarket").is(":checked") && (! location.BlackMarket))	return;
		if ($("#filterDestShadowport").is(":checked") && (! location.Shadowport)) return;
		// starport grade (goes backwards: Grade 1=best; in data file Starport 1=worst, 0=none)
		filterGrade = $("#filterDestStarportGrade").val();
		if (filterGrade)
		{
			if ((filterGrade == 0 && location.Starport == 0) || // Grade 0 = unofficial "no starport here"; Grades go 1 (best) to 5 (worst)
				(filterGrade != (6 - location.Starport)) ) // Starport 5-1 matches Grades 1-5
			{
				return;
			}
		}

		tags = " ";
		if ($("#pirateHolonet").is(":checked"))
		{
			// Pirate HoloNet is installed, show some extra stuff
			if (location.BlackMarket)
			{
				tags += "[BM]";
			}
			if (location.Shadowport)
			{
				tags += "[sP]";
			}
			if (location.Starport > 0)
			{
				tags += "[*p" + (6 - location.Starport) + "]"; // Starport Grade 1=best, data file Starport 1=worst
			}
		}
		else
		{
			// secret pirate locations remain secret without Pirate HoloNet
			if (location.Name == "City Of Masks") return;
			if (location.Name == "Tantalus Detention Facility") return;
		}

		$destinationDropdown.append(
			$("<option>", { value: location.Name, text: location.Name + tags })
		);
	});
}

function togglePirateHolonet()
{
	isInstalled = $("#pirateHolonet").is(":checked");
	if (isInstalled)
	{
		// display the hidden section(s)
		$(".manifest-menu-hidden").slideDown();
	}
	else
	{
		// hide the hidden section(s)
		$(".manifest-menu-hidden").slideUp();
		// reset any hidden filter conditions to avoid confusion when the filter input is hidden
		$(".filter-input-hidden").prop("checked", false);
		$("#filterCurrStarportGrade").val("");
		$("#filterDestStarportGrade").val("");
	}
	populateLocationDropdown();
	populateDestinationDropdown();
}

// Converts a number to an integer, max 5, min 0.
function sanitize0to5(val)
{
	const saneVal = (Number.isInteger(Math.round(val)) ? Math.round(val) : 0);
	const retVal = Math.min(Math.max(saneVal, 0), 5); // integer, 0 to 5 inclusive
	return retVal;
}

// Converts a number to an integer, max 5, min -5.
function sanitizeMinus5to5(val)
{
	const saneVal = (Number.isInteger(Math.round(val)) ? Math.round(val) : 0);
	const retVal = Math.min(Math.max(saneVal, -5), 5); // integer, -5 to 5 inclusive
	return retVal;
}

// Converts a number to an integer, max 9, min 0.
// (Rarity goes higher as value goes lower)
function sanitizeRarity(val)
{
	const saneVal = (Number.isInteger(Math.round(-val)) ? Math.round(val) : 0);
	const retVal = Math.min(Math.max(saneVal, 0), 9); // integer, 0 to 9 inclusive
	return retVal;
}

// Converts a number to display value: "XXcr" or "(waived)"
function creditsOrWaived(val)
{
	const saneVal = (Number.isInteger(Math.round(val)) ? Math.round(val) : 0);
	if (saneVal === 0)
	{
		return "(waived)";
	}
	else
	{
		return saneVal + "cr";
	}
	return retVal;
}

function rarityModFor(json)
{
	baseRarity = json.Rarity;
	region = json.Region;
	regionRarity = regions.find(item => item.Name === json.Region).Rarity;
	return baseRarity + regionRarity;
}

// Converts a number to display value: "Rarity X(R)" or ""
function rarityText(val)
{
	retVal = "";
	saneRarity = sanitizeRarity(val);
	if (saneRarity>0)
	{
		retVal += "Rarity " + saneRarity;
	  if (saneRarity>6)
	  {
		  retVal += "(R) ";
	  }
	  retVal += ", ";
	}
	return retVal;
}

// Converts a number to display value for weapon/armor permits
function permitHTML(val, cost, rarityMod)
{
	const rarity = sanitizeMinus5to5(rarityMod);
	switch(sanitizeMinus5to5(val))
	{
		case -5:
		case -4:
			return '<span class="law-felony">Felony</span> (Permit ' + rarityText(rarity + 2) + (cost * 5).toFixed(0) + 'cr)'; break;
		case -3:
			return '<span class="law-misdemeanor">Misdemeanor</span> (Permit ' + rarityText(rarity) + cost + 'cr)'; break;
		case -2:
			return '<span class="law-infraction">Infraction</span> (Permit ' + rarityText(rarity) + cost + 'cr)'; break;
		case -1:
			return '<span class="law-frowned-upon">frowned on</span> (Permit ' + rarityText(rarity) + cost + 'cr)'; break;
		case 0:
			return '<span class="law-tolerated">tolerated</span>'; break;
		case 1:
			return '<span class="law-no-restrictions">no restrictions</span>'; break;
		case 2:
			return '<span class="law-common">common</span>'; break;
		case 3:
		case 4:
		case 5:
			return '<span class="law-recommended">recommended</span>'; break;
		default:
			return "ERROR: return invalid val in permitHTML()";
	}

	return "ERROR in permitHTML()";
}

// Converts a number to display value for various local crimes
function legalityOf(val)
{
	const saneVal = sanitizeMinus5to5(val);
	switch(sanitizeMinus5to5(saneVal))
	{
		case -5:
		case -4: return '<span class="law-felony">Felony</span>'; break;
		case -3: return '<span class="law-misdemeanor">Misdemeanor</span>'; break;
		case -2: return '<span class="law-infraction">Infraction</span>'; break;
		case -1: return '<span class="law-frowned-upon">frowned on</span>'; break;
		case 0: return '<span class="law-tolerated">tolerated</span>'; break;
		case 1: return '<span class="law-no-restrictions">no restrictions</span>'; break;
		case 2:
		case 3:
		case 4:
		case 5: return '<span class="law-recommended">recommended</span>'; break;
	}
}

// converts a number to a starport description
// "Operational Costs" fan supplement grades them 1 (best) to 5 (worst)
function starportText(val)
{
	switch(sanitize0to5(val))
	{
		// Operational Costs pg11, Grade 1 is best
		case 5: return "Grade 1 (Imperial Class)";
		case 4: return "Grade 2 (Stellar Class)";
		case 3: return "Grade 3 (Standard Class)";
		case 2: return "Grade 4 (Limited Services)";
		case 1: return "Grade 5 (Landing Field)";
		case 0: return "None (Wilderness)";
	}
	return "ERROR: unknown"; // fallthrough default
}

// converts a number into a Gravity description
function gravityText(val)
{
	if (val > 1.0) return '<span class="gravity-high">High (' + val + ')</span>';
	if (val < 1.0) return '<span class="gravity-low">Low (' + val + ')</span>';
	return 'Standard';
}

// updates the current location Atmosphere description
function updateCurrentAtmosphere()
{
	$('#currentAtmosphere').text(currentLoc.Atmosphere);

	$('#currentAtmosphere').removeClass('atmos-1 atmos-2 atmost3 atmos-4').addClass('font-normal');
	if (currentLoc.Atmosphere === "Type IV")
	{
		$('#currentAtmosphere').addClass('atmos-4');
	}
	else if (currentLoc.Atmosphere === "Type III")
	{
		$('#currentAtmosphere').addClass('atmos-3');
	}
	else if (currentLoc.Atmosphere === "Type II")
	{
		$('#currentAtmosphere').addClass('atmos-2');
	}
	else if (currentLoc.Atmosphere === "Type I")
	{
		$('#currentAtmosphere').addClass('atmos-1');
	}
}

// updates the destination location Atmosphere description
function updateDestAtmosphere()
{
	$('#destAtmosphere').text(destLoc.Atmosphere);

	$('#destAtmosphere').removeClass('atmos-1 atmos-2 atmost3 atmos-4').addClass('font-normal');;
	if (destLoc.Atmosphere === "Type IV")
	{
		$('#destAtmosphere').addClass('atmos-4');
	}
	else if (destLoc.Atmosphere === "Type III")
	{
		$('#destAtmosphere').addClass('atmos-3');
	}
	else if (destLoc.Atmosphere === "Type II")
	{
		$('#destAtmosphere').addClass('atmos-2');
	}
	else if (destLoc.Atmosphere === "Type I")
	{
		$('#destAtmosphere').addClass('atmos-1');
	}
}

// Arrival event
function populateArrivalEvent() {
	const hiddenRounds = Math.round(Math.random() * 2); // this will be impacted by ship components like Holonet Pirate Array and similar
	arrivalEvent = "ATTENTION, NAVIGATOR: ";
	if (hiddenRounds > 0)
	{
		arrivalEvent += "You are hidden for " + hiddenRounds + " round(s) from detection attempts.";
	}
	else
	{
		arrivalEvent += "You have arrived safely.";
	}
	$("#arrivalEvent").text(arrivalEvent);

//	const localWeather = "unknown"; // @FIX
//	const localTerrain = "some starport"; // @FIX
//	$("#localWeather").text(localWeather + ", " + localTerrain);
}

// Arrival in system events
function populateArrivalEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		$("#local-events").append(arrivalEvents[ii]);
	}
}

// Local events
function populateEmpireEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = localEmpireEvents[Math.floor(Math.random() * localEmpireEvents.length)];
		$("#local-events").append(newEvent);
	}
}

function populateOldWestEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = localOldWestEvents[Math.floor(Math.random() * localOldWestEvents.length)];
		$("#local-events").append(newEvent);
	}
}

function updateLocalEvents()
{
	// Reset local events
	$("#local-events").empty();
	$("#local-events").append('<li id="arrivalEvent">ATTENTION, NAVIGATOR: You have arrived safely.</li>');
//	$("#local-events").append('<li><strong>Local Weather and Terrain:</strong> <span id="localWeather">please select a Location</span></li>');

	// Shadowport
	if (currentLoc.Shadowport) {
		$("#local-events").append('<li>RUMOR HAS IT: A clandestine <href="https://starwars.fandom.com/wiki/Shadowport">shadowport</a> is here somewhere.</li>');
	}

	// Black Market
	if (currentLoc.BlackMarket) {
		$("#local-events").append('<li>RUMOR HAS IT: A thriving <href="https://starwars.fandom.com/wiki/Black_market/Legends">black market</a> is here somewhere.</li>');
	}

	// Plot Hooks
	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"Psst. I got a job for you. Legal (mostly), easy work, pays the rent, y\'know? You in?"</i></li>');
	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"Hey, you. You look tough. I got a job, pays well for <em>\'\'tough\'\'</em>."</i></li>');
	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"My client has an exclusive offer for an elite team with a handsome payout. There is considerable danger involved."</li>');

	// Arrival event
	populateArrivalEvent();

	if (! currentLoc) window.alert("ERROR in updateLocalEvents()");

	// Arrival in system events
	populateArrivalEvents(currentLoc.ImperialPresence);

	// Local events
	populateEmpireEvents(currentLoc.ImperialPresence);
	populateEmpireEvents(currentRegion.ImperialPresence);

	// Old West events
	populateOldWestEvents(currentLoc.OldWestiness);
	populateOldWestEvents(currentRegion.OldWestiness);

	// Flora & Fauna events
	populateOldWestEvents(currentLoc.Megafauna);
}

function updateCurrentDetails()
{
	if (currentLoc)
	{
		// Current Location update screen elements
		$('#currentRegion').html(currentLoc.Region);
		$('#currentSector').html(currentLoc.Sector);
		$('#currentSystem').html(currentLoc.System);
		$('#currentCapital').html(currentLoc.CapitalCity);
		$('#currentMap').html(currentLoc.Map);
		updateCurrentAtmosphere();
		$('#currentTerrain').html(currentLoc.Terrain);
		$('#currentInhabitants').html(currentLoc.Inhabitants);
		$('#currentClimate').html(currentLoc.Climate);
		$('#currentGravity').html(gravityText(currentLoc.Gravity));
		$('#currentStarport').html(starportText(currentLoc.Starport));
		$('#starportHeader').html(starportText(currentLoc.Starport));
		$('#currentURL').attr('title', currentLoc.Name);
		$('#currentURL').attr('href', currentLoc.URL);
		$('#currentURL').text(currentLoc.URL);
		$('#currentRegionURL').attr('title', currentRegion.Name);
		$('#currentRegionURL').attr('href', 'https://starwars.fandom.com/wiki/' + currentRegion.Name.replace(' ', '_') + '/Legends');
		$('#currentRegionURL').text(currentRegion.Name);
	}
	else
	{
		window.alert("ERROR in updateCurrentDetails()");
	}
}

function updateDestDetails()
{
	if (destLoc)
	{
		$('#destRegion').html(destLoc.Region);
		$('#destSector').html(destLoc.Sector);
		$('#destSystem').html(destLoc.System);
		$('#destCapital').html(destLoc.CapitalCity);
		$('#destMap').html(destLoc.Map);
		updateDestAtmosphere();
		$('#destTerrain').html(destLoc.Terrain);
		$('#destInhabitants').html(destLoc.Inhabitants);
		$('#destClimate').html(destLoc.Climate);
		$('#destGravity').html(gravityText(destLoc.Gravity));
		$('#destStarport').html(starportText(destLoc.Starport));
		$('#destURL').attr('title', destLoc.Name);
		$('#destURL').attr('href', destLoc.URL);
		$('#destURL').text(destLoc.URL);
		$('#destRegionURL').attr('title', destRegion.Name);
		$('#destRegionURL').attr('href', 'https://starwars.fandom.com/wiki/' + destRegion.Name.replace(' ', '_') + '/Legends');
		$('#destRegionURL').text(destRegion.Name);
	}
	else
	{
		window.alert("ERROR attempting in updateDestDetails()");
	}
}

function updateLocalCustoms() // and starport costs, permits, contraband,...
{
	if (! currentLoc) window.alert("ERROR in updateLocalCustoms()");

	// Options calculations & variables
	const shipCargoDeclared = $('#cargo').val();
	const shipHyperdrive = $('#hyperdrive').val();
	const rarityMod = rarityModFor(currentLoc);

	// Empire Presence calculations
	// https://star-wars-rpg-ffg.fandom.com/wiki/Category:Ship_Operating
	shipSilh = $('#silh').val();
	const silhCostFactor = shipSilh * (shipSilh > 4 ? 25 : 10); // Capital ships start at Silhouette 5 and have a large jump in capability/cost
	const feePortLanding = (sanitize0to5(currentLoc.ImperialPresence) + sanitize0to5(currentRegion.ImperialPresence)) * silhCostFactor;
	const textFeePortLanding = creditsOrWaived(feePortLanding);
	const feePortBerthing = Math.round(feePortLanding * 0.1);
	const textFeePortBerthing = creditsOrWaived(feePortBerthing);
	const feeCustoms = Math.round(shipCargoDeclared * 0.01); // "waived" if zero
	const textFeeCustoms = creditsOrWaived(Math.max(feeCustoms, 10));
	const feeVisitation = Math.round(feePortBerthing * 0.1); // "waived" if zero
	const textFeeVisitation = creditsOrWaived(Math.max(feeVisitation, 10));
//	const feeSmuggling = Math.round(shipCargoDeclared * 0.2); // "no cargo declared" if no cargo; "(minor bribe)" if small
//	const textFeeSmuggling = creditsOrWaived(Math.max(feeSmuggling, 10));
	const waitDeparture = Math.round(feePortLanding); // in hours
	const textWaitDeparture = (waitDeparture>24
		? (waitDeparture/24).toFixed(1) + " days"
		: waitDeparture.toFixed(0) + " hours"
		);

	// Empire Presence update screen elements
	$('#textFeePortLanding').text(textFeePortLanding);
	$('#textFeePortBerthing').text(textFeePortBerthing);
	$('#textFeeCustoms').text(textFeeCustoms);
	$('#textFeeVisitation').text(textFeeVisitation);
//	$('#textFeeSmuggling').text(textFeeSmuggling);
	$('#textWaitDeparture').text(textWaitDeparture);

	// Weapon Permits calculations
	const baseWeapon = currentLoc.OldWestiness + currentRegion.OldWestiness;

	const permitWeaponConcealed = baseWeapon;
	const permitWeaponConcealedCost = (0 - permitWeaponConcealed) * 10;
	const textPermitWeaponConcealed = permitHTML(permitWeaponConcealed, permitWeaponConcealedCost, rarityMod);

	const permitWeaponSmall = baseWeapon - 1;
	const permitWeaponSmallCost = (0 - permitWeaponSmall) * 10;
	const textPermitWeaponSmall = permitHTML(permitWeaponSmall, permitWeaponSmallCost, rarityMod);

	const permitWeaponRifle = baseWeapon -	2;
	const permitWeaponRifleCost = (0 - permitWeaponRifle) * 10;
	const textPermitWeaponRifle = permitHTML(permitWeaponRifle, permitWeaponRifleCost, rarityMod);

	const permitWeaponHeavy = baseWeapon - 3;
	const permitWeaponHeavyCost = (0 - permitWeaponHeavy) * 10;
	const textPermitWeaponHeavy = permitHTML(permitWeaponHeavy, permitWeaponHeavyCost, rarityMod);

	const permitArmorLight = baseWeapon -2;
	const permitArmorLightCost = (0 - permitArmorLight) * 10;
	const textPermitArmorLight = permitHTML(permitArmorLight, permitArmorLightCost, rarityMod);

	const permitArmorPower = baseWeapon - 3;
	const permitArmorPowerCost = (0 - permitArmorPower) * 10;
	const textPermitArmorPower = permitHTML(permitArmorPower, permitArmorPowerCost, rarityMod);

	// Weapon Permits update screen elements
	$('#textPermitWeaponConcealed').html(textPermitWeaponConcealed);
	$('#textPermitWeaponSmall').html(textPermitWeaponSmall);
	$('#textPermitWeaponRifle').html(textPermitWeaponRifle);
	$('#textPermitWeaponHeavy').html(textPermitWeaponHeavy);
	$('#textPermitArmorLight').html(textPermitArmorLight);
	$('#textPermitArmorPower').html(textPermitArmorPower);

	// Law & Order calculations
	const baseLaw = 0; // - sanitizeMinus5to5(currentLoc.ImperialPresence + currentRegion.ImperialPresence);

	const lawSpice = baseLaw + currentLoc.Spice + currentRegion.Spice;
	const textLawSpice = legalityOf(lawSpice);

	const lawTrespassing = baseLaw + currentLoc.Trespassing + currentRegion.Trespassing;
	const textLawTrespassing = legalityOf(lawTrespassing);

	const lawMilitary = baseLaw + currentLoc.Military + currentRegion.Military;
	const textLawMilitary = legalityOf(lawMilitary);

	const lawSlicing = baseLaw + currentLoc.Slicing + currentRegion.Slicing;
	const textLawSlicing = legalityOf(lawSlicing);

	const lawCriticism = baseLaw + currentLoc.Criticism + currentRegion.Criticism;
	const textLawCriticism = legalityOf(lawCriticism);

	const lawSlavery = baseLaw + currentLoc.Slavery + currentRegion.Slavery;
	const textLawSlavery = legalityOf(lawSlavery);

	const lawTheft = baseLaw + currentLoc.Theft + currentRegion.Theft;
	const textLawTheft = legalityOf(lawTheft);

	const lawBribery = baseLaw + currentLoc.Bribery + currentRegion.Bribery;
	const textLawBribery = legalityOf(lawBribery);

	// Law & Order update screen elements
	$('#textLawSpice').html(textLawSpice);
	$('#textLawTrespassing').html(textLawTrespassing);
	$('#textLawMilitary').html(textLawMilitary);
	$('#textLawSlicing').html(textLawSlicing);
	$('#textLawCriticism').html(textLawCriticism);
	$('#textLawSlavery').html(textLawSlavery);
	$('#textLawTheft').html(textLawTheft);
	$('#textLawBribery').html(textLawBribery);
}

// Hyperlane travel time multiplier
function hyperlaneFactor(startLoc, endLoc)
{
	factor = 1.0;
	Object.keys(hyperspaceRoutes).forEach(key => {
		const planets = hyperspaceRoutes[key].Route.split(",");
		if (planets.indexOf(currentLoc.Name) != -1)
		{
			routeFactor = hyperspaceRoutes[key].Route.split(",").length * 0.01;
			factor *= routeFactor;
		}
	});
	return factor;
}

// https://oakthorne.net/wiki/index.php/SW_Hyperspace_Travel_Times
function hyperspaceTravelTime(startMap, endMap)
{
	if (startMap && endMap)
	{
		const startLetter = startMap[0].charCodeAt(0); // no need to zero, we only care about the difference
		const startNumber = startMap.substring(2);
		const endLetter = endMap[0].charCodeAt(0); // no need to zero, we only care about the difference
		const endNumber = endMap.substring(2);

		// Assume straight line, ignoring hyperspace routes
		const distance = Math.sqrt(Math.pow(startLetter - endLetter, 2) + Math.pow(startNumber - endNumber, 2));

		// side effect: update the display
		$('#baseHyperSpaceDistance').text(distance.toFixed(2) + " parsecs, ")

		if (distance < 1) return 24;
		if (distance < 3) return Math.floor(distance * 42);
		if (distance < 6) return Math.floor(distance * 48);
		if (distance < 9) return Math.floor(distance * 56);
		return Math.max(Math.floor(distance * 56), 24); // minimum 24 hours travel time per Fly Casual pg78
	}
	else
	{
		return Math.NaN;
	}
}

function hoursToTravelTimeDesc(hours) // 178 = 1 week, 0 days, 10 hours
{
	retVal = "";
	const weeks = Math.floor(hours / (24*7)); //
	const days = Math.floor((hours - (weeks*24*7)) / 24);
	const hoursLeft = Math.floor(hours - (weeks*24*7) - (days*24));
	if (weeks > 0) retVal += weeks + " week" + (weeks === 1 ? "" : "s") + ", ";
	retVal += days + " day" + (days === 1 ? "" : "s") + ", " + hoursLeft + " hour" + (hoursLeft === 1 ? "" : "s");
	return retVal;
}

function updateTravelEstimates()
{
	totalFactor = 1.0;

	// Find Hyperlanes available for current location
	currentRouteList = "";
	if (currentLoc)
	{
		Object.keys(hyperspaceRoutes).forEach(key => {
			const planets = hyperspaceRoutes[key].Route.split(",");
			if (planets.indexOf(currentLoc.Name) != -1)
			{
				if (currentRouteList.length > 0) currentRouteList += "<br/>";
				const thisRoute = hyperspaceRoutes[key];
				const factor = (1.0 - (Math.max(thisRoute.Route.split(",").length, 1) * 0.005)).toFixed(2);
				totalFactor *= factor;
				currentRouteList += toGalactipediaALink(thisRoute.Name) + " (factor " + factor + ")";
			}
		});
	}

	// Find Hyperlanes available for destination
	destRouteList = "";
	if (destLoc)
	{
		Object.keys(hyperspaceRoutes).forEach(key => {
			const planets = hyperspaceRoutes[key].Route.split(",");
			if (planets.indexOf(destLoc.Name) != -1)
			{
				if (destRouteList.length > 0) destRouteList += "<br/>";
				const thisRoute = hyperspaceRoutes[key];
				const factor = (1.0 - (Math.max(thisRoute.Route.split(",").length, 1) * 0.005)).toFixed(2);
				totalFactor *= factor;
				destRouteList += toGalactipediaALink(thisRoute.Name) + " (factor " + factor + ")";
			}
		});
	};

	if (currentRouteList.length > 0 && destRouteList.length > 0)
	{
		// Same hyperroute? Bonus!
		currentRouteList.split("<br/>").forEach(currRoute => {
			destRouteList.split("<br/>").forEach(destRoute => {
				if (currRoute == destRoute)
				{
					currentRouteList = currentRouteList.replace(currRoute, '<span class="matched-hyperlane">' + currRoute + '&nbsp;&gt;&gt;&gt;</span>');
					destRouteList = destRouteList.replace(destRoute, '<span class="matched-hyperlane">&lt;&lt;&lt;&nbsp;' + destRoute + '</span>');
					totalFactor *= 0.5;
				}
			});
		});
	}

	$('#currentHyperlanes').html(currentRouteList);
	$('#destHyperlanes').html(destRouteList);

	// Fly Casual pg78
	if (currentLoc.Map && destLoc.Map)
	{
		const baseHyperspaceTime = hyperspaceTravelTime(currentLoc.Map, destLoc.Map);
		const shipHyperdrive = $('#hyperdrive').val();
		$('#ettHyperdriveClass').text(shipHyperdrive);
		$('#baseHyperspaceTime').text(hoursToTravelTimeDesc(baseHyperspaceTime));
		$('#estHyperspaceTime').text(hoursToTravelTimeDesc(baseHyperspaceTime * shipHyperdrive * totalFactor));
		$('#hyperrouteFactor').text(totalFactor.toFixed(2));
	}
}

function cleanFonts()
{
	$('#body').removeClass('font-besh font-starwars font-normal');
	$('#locationDropdownLabel').removeClass('font-besh font-starwars font-normal');
	$('#destinationDropdownLabel').removeClass('font-besh font-starwars font-normal');
	$('#instructions-box').removeClass('font-besh font-starwars font-normal');
	$('#local-customs-box-header').removeClass('font-besh font-starwars font-normal');
	$('.ship-manifest-item').removeClass('font-besh font-starwars font-normal');
}

// switch to Droidobesh (illegible) font
function switchFontBesh()
{
	cleanFonts();
	$('#body').addClass('font-besh');
	$('#locationDropdownLabel').addClass('font-starwars');
	$('#destinationDropdownLabel').addClass('font-besh');
	$('#instructions-box').addClass('font-starwars');
	$('#local-customs-box-header').addClass('font-starwars');
	$('.ship-manifest-item').addClass('font-besh');
	fontNormalElements();
}

// switch to StarWars (legible) font
function switchFontStarWars()
{
	cleanFonts();
	$('#body').addClass('font-starwars');
	$('#locationDropdownLabel').addClass('font-starwars');
	$('#destinationDropdownLabel').addClass('font-starwars');
	$('#instructions-box').addClass('font-normal');
	$('#local-customs-box-header').addClass('font-normal');
	$('.ship-manifest-item').addClass('font-starwars');
	fontNormalElements();
}

// switch to Droidobesh (illegible) font
function switchFontNormal()
{
	cleanFonts();
	$('#body').addClass('font-normal');
	$('#locationDropdownLabel').addClass('font-normal');
	$('#destinationDropdownLabel').addClass('font-normal');
	$('#instructions-box').addClass('font-normal');
	$('#local-customs-box-header').addClass('font-normal');
	$('.ship-manifest-item').addClass('font-normal');
}

function fontNormalElements()
{
	$("#baseHyperspaceTime").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentAtmosphere").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentCapital").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentClimate").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentGravity").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentInhabitants").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentMap").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentRegion").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentRegionURL").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentSector").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentStarport").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentSystem").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#currentTerrain").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destAtmosphere").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destCapital").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destClimate").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destGravity").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destInhabitants").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destMap").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destRegion").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destRegionURL").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destSector").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destStarport").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destSystem").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#destTerrain").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#estHyperspaceTime").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textFeeCustoms").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textFeePortBerthing").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textFeePortLanding").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textFeeVisitation").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawBribery").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawCriticism").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawMilitary").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawSlavery").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawSlicing").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawSpice").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawTheft").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textLawTrespassing").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitArmorLight").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitArmorPower").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitWeaponConcealed").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitWeaponHeavy").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitWeaponRifle").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textPermitWeaponSmall").removeClass("font-besh font-starwars").addClass("font-normal");
}

function toGalactipediaURL(name)
{
	return "https://starwars.fandom.com/wiki/" + name.replace(" ", "_"); // sometimes with /Legends appended; might need more fine tuning
}

function toGalactipediaALink(name)
{
	return '<a href="' + toGalactipediaURL(name) + '" target="_blank">' + name + '</a>';
}

function updateSilhouette()
{
	shipSilh = $('#silh').val();

	if (shipSilh > 4) // Commercial/Military size
	{
		$('#silhLabel').addClass("silhouette-5-plus");
	}
	else
	{
		$('#silhLabel').removeClass("silhouette-5-plus");
	}

	updateLocalCustoms();
}
