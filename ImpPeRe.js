// Globals
currentLoc = {};
destLoc = {};
destRegion = {};
currentDestination = "unknown";
currentRegion = "unknown";
shipSilh = $('#silh').val();

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
function permitText(val, cost)
{
	const rarity = sanitizeMinus5to5(val);
	switch(sanitizeMinus5to5(val))
	{
		case -5: return "Felony (Permit " + rarityText(rarity + 2) + cost + "cr)"; break;
		case -4: return "Felony (Permit " + rarityText(rarity) + cost + "cr)"; break;
		case -3: return "Misdemeanor (Permit " + rarityText(rarity) + cost + "cr)"; break;
		case -2: return "Infraction (Permit " + rarityText(rarity) + cost + "cr)"; break;
		case -1: return "frowned on (Permit " + rarityText(rarity) + cost + "cr)"; break;
		case 0: return "tolerated"; break;
		case 1: return "no restrictions"; break;
		case 2: return "common"; break;
		case 3: return "recommended"; break;
		case 4: return "recommended"; break;
		case 5: return "recommended"; break;
		default: return "ERROR: return invalid val in permitText()";
	}

	return "ERROR in permitText()";
}

// Converts a number to display value for various local crimes
function legalityOf(val)
{
	const saneVal = sanitizeMinus5to5(val);
	switch(sanitizeMinus5to5(saneVal))
	{
		case -5: return "Felony";
		case -4: return "Felony";
		case -3: return "Misdemeanor";
		case -2: return "Infraction";
		case -1: return "frowned upon";
		case 0: return "tolerated";
		case 1: return "allowed";
		case 2: return "encouraged";
		case 3: return "encouraged";
		case 4: return "encouraged";
		case 5: return "encouraged";
	}
}

// converts a number to a starport description
// "Operational Costs" fan supplement grades them 1 (best) to 5 (worst)
function starportText(val)
{
	switch(sanitize0to5(val))
	{
		// Operational Costs pg11, Grade 1 is best
		case 5: return "Grade 1 Imperial Class";
		case 4: return "Grade 2 Stellar Class";
		case 3: return "Grade 3 Standard Class";
		case 2: return "Grade 4 Limited Services";
		case 1: return "Grade 5 Landing Field";
		case 0: return "Wilderness";
	}
	return "ERROR: unknown"; // fallthrough default
}

// converts a number into a Gravity description
function gravityText(val)
{
	if (val > 1.0) return '<span class="gravityHigh">High (' + val + ')</span>';
	if (val < 1.0) return '<span class="gravityLow">Low (' + val + ')</span>';
	return 'Standard';
}

// updates the current location Atmosphere description
function updateCurrentAtmosphere()
{
	$('#currentAtmosphere').text(currentLoc.Atmosphere);

	$('#currentAtmosphereLabel').removeClass('atmos1 atmos2 atmost3 atmos4');
	if (currentLoc.Atmosphere === "Type IV")
	{
		$('#currentAtmosphereLabel').addClass('atmos4');
	}
	else if (currentLoc.Atmosphere === "Type III")
	{
		$('#currentAtmosphereLabel').addClass('atmos3');
	}
	else if (currentLoc.Atmosphere === "Type II")
	{
		$('#currentAtmosphereLabel').addClass('atmos2');
	}
	else if (currentLoc.Atmosphere === "Type I")
	{
		$('#currentAtmosphereLabel').addClass('atmos1');
	}
	else
	{
		window.alert("ERROR in updateCurrentAtmosphere()");
	}
}

// updates the destination location Atmosphere description
function updateDestAtmosphere()
{
	$('#destAtmosphere').text(destLoc.Atmosphere);

	$('#destAtmosphereLabel').removeClass('atmos1 atmos2 atmost3 atmos4');
	if (destLoc.Atmosphere === "Type IV")
	{
		$('#destAtmosphereLabel').addClass('atmos4');
	}
	else if (destLoc.Atmosphere === "Type III")
	{
		$('#destAtmosphereLabel').addClass('atmos3');
	}
	else if (destLoc.Atmosphere === "Type II")
	{
		$('#destAtmosphereLabel').addClass('atmos2');
	}
	else if (destLoc.Atmosphere === "Type I")
	{
		$('#destAtmosphereLabel').addClass('atmos1');
	}
	else
	{
		window.alert("ERROR in updateDestAtmosphere()");
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

	const localWeather = "unknown"; // @FIX
	const localTerrain = "some starport"; // @FIX
	$("#localWeather").text(localWeather + ", " + localTerrain);
}

// Imperial Presence events
function populateImperialEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		$("#localEvents").append(arrivalEvents[ii]);
	}
}

// Local events
function populateEmpireEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = localEmpireEvents[Math.floor(Math.random() * localEmpireEvents.length)];
		$("#localEvents").append(newEvent);
	}
}

function populateOldWestEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = localOldWestEvents[Math.floor(Math.random() * localOldWestEvents.length)];
		$("#localEvents").append(newEvent);
	}
}

function updateLocalEvents()
{
	// Reset local events
	$("#localEvents").empty();
	$("#localEvents").append('<li id="arrivalEvent">ATTENTION, NAVIGATOR: You have arrived safely.</li>');
	$("#localEvents").append('<li><strong>Local Weather and Terrain:</strong> <span id="localWeather">please select a Location</span></li>');

	// Arrival event
	populateArrivalEvent();

	if (! currentLoc) window.alert("ERROR in updateLocalEvents()");

	// Imperial Presence events
	populateImperialEvents(currentLoc.ImperialPresence);

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
		$('#currentRegion').text(currentLoc.Region);
		$('#currentSector').text(currentLoc.Sector);
		$('#currentSystem').text(currentLoc.System);
		$('#currentCapital').text(currentLoc.CapitalCity);
		$('#currentMap').text(currentLoc.Map);
		updateCurrentAtmosphere();
		$('#currentTerrain').text(currentLoc.Terrain);
		$('#currentInhabitants').text(currentLoc.Inhabitants);
		$('#currentClimate').text(currentLoc.Climate);
		$('#currentGravity').html(gravityText(currentLoc.Gravity));
		$('#currentStarport').html(starportText(currentLoc.Starport));
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
		$('#destRegion').text(destLoc.Region);
		$('#destSector').text(destLoc.Sector);
		$('#destSystem').text(destLoc.System);
		$('#destCapital').text(destLoc.CapitalCity);
		$('#destMap').text(destLoc.Map);
		updateDestAtmosphere();
//		$('#destAtmosphere').text(destLoc.Atmosphere);
		$('#destTerrain').text(destLoc.Terrain);
		$('#destInhabitants').text(destLoc.Inhabitants);
		$('#destClimate').text(destLoc.Climate);
		const gravityT= gravityText(currentLoc.Gravity);
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
//				const feeSmuggling = Math.round(shipCargoDeclared * 0.2); // "no cargo declared" if no cargo; "(minor bribe)" if small
//				const textFeeSmuggling = creditsOrWaived(Math.max(feeSmuggling, 10));
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
//				$('#textFeeSmuggling').text(textFeeSmuggling);
	$('#textWaitDeparture').text(textWaitDeparture);

	// Weapon Permits calculations
	const baseWeapon = currentRegion.OldWestiness;

	const permitWeaponConcealed = baseWeapon;
	const permitWeaponConcealedCost = (0 - permitWeaponConcealed) * 10;
	const textPermitWeaponConcealed = permitText(permitWeaponConcealed, permitWeaponConcealedCost, rarityMod);

	const permitWeaponSmall = baseWeapon - 1;
	const permitWeaponSmallCost = (0 - permitWeaponSmall) * 10;
	const textPermitWeaponSmall = permitText(permitWeaponSmall, permitWeaponSmallCost, rarityMod);

	const permitWeaponRifle = baseWeapon -	2;
	const permitWeaponRifleCost = (0 - permitWeaponRifle) * 10;
	const textPermitWeaponRifle = permitText(permitWeaponRifle, permitWeaponRifleCost, rarityMod);

	const permitWeaponHeavy = baseWeapon - 3;
	const permitWeaponHeavyCost = (0 - permitWeaponHeavy) * 10;
	const textPermitWeaponHeavy = permitText(permitWeaponHeavy, permitWeaponHeavyCost, rarityMod);

	const permitArmorLight = baseWeapon -2;
	const permitArmorLightCost = (0 - permitArmorLight) * 10;
	const textPermitArmorLight = permitText(permitArmorLight, permitArmorLightCost, rarityMod);

	const permitArmorPower = baseWeapon - 3;
	const permitArmorPowerCost = (0 - permitArmorPower) * 10;
	const textPermitArmorPower = permitText(permitArmorPower, permitArmorPowerCost, rarityMod);

	// Weapon Permits update screen elements
	$('#textPermitWeaponConcealed').text(textPermitWeaponConcealed);
	$('#textPermitWeaponSmall').text(textPermitWeaponSmall);
	$('#textPermitWeaponRifle').text(textPermitWeaponRifle);
	$('#textPermitWeaponHeavy').text(textPermitWeaponHeavy);
	$('#textPermitArmorLight').text(textPermitArmorLight);
	$('#textPermitArmorPower').text(textPermitArmorPower);

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

	const lawTheft = baseLaw + currentLoc.Theft + currentRegion.Theft;
	const textLawTheft = legalityOf(lawTheft);

	const lawBribery = baseLaw + currentLoc.Bribery + currentRegion.Bribery;
	const textLawBribery = legalityOf(lawBribery);

	// Law & Order update screen elements
	$('#textLawSpice').text(textLawSpice);
	$('#textLawTrespassing').text(textLawTrespassing);
	$('#textLawMilitary').text(textLawMilitary);
	$('#textLawSlicing').text(textLawSlicing);
	$('#textLawCriticism').text(textLawCriticism);
	$('#textLawTheft').text(textLawTheft);
	$('#textLawBribery').text(textLawBribery);
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

	// Find Hyperspace Lanes available for current location
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
				currentRouteList += thisRoute.Name + " (factor " + factor + ")";
			}
		});
	}

	// Find Hyperspace Lanes available for destination
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
				destRouteList += thisRoute.Name + " (factor " + factor + ")";
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
					currentRouteList = currentRouteList.replace(currRoute, '<span class="matchedHyperlane">' + currRoute + '</span>');
					destRouteList = destRouteList.replace(destRoute, '<span class="matchedHyperlane">' + destRoute + '</span>');
					totalFactor *= 0.5;
				}
			});
		});
	}

	$('#currentHyperspaceLanes').html(currentRouteList);
	$('#destHyperspaceLanes').html(destRouteList);

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
