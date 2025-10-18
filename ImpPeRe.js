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
// @TODO https://starwars.fandom.com/wiki/Spaceport/Legends#Known_spaceports
// @TODO https://star-wars-rpg-ffg.fandom.com/wiki/Category:Beast#RIDING_BEASTS

// Globals
currentLoc = {};
destLoc = {};
destRegion = {};
currentLocation = Cookies.get()["currentLocation"];
currentDestination = Cookies.get()["currentDestination"];
currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object

$(document).ready(function ()
{
	switchFontBesh(); // set initial font

	// minimize collapsible sections
	$("#locationDetails").slideUp();
	$("#destinationDetails").slideUp();
	$("#manifest-menu-hidden").slideUp();
	$(".hidden").slideUp();

	// Default input values
	cargoDeclared = Cookies.get()["cargoDeclared"] || 0;
	$("#cargoDeclared").val(cargoDeclared);
	shipSilhouette = Cookies.get()["shipSilhouette"] || 4;
	$("#shipSilhouette").val(shipSilhouette);
	hyperdriveClass = Cookies.get()["hyperdriveClass"] || 1;
	$("#hyperdriveClass").val(hyperdriveClass);
	gHC = Cookies.get()["GHC"] || 1;
	$("#galacticHyperspaceConstant").val(gHC);
	pirateHolonet = (Cookies.get()["pirateHolonet"] == "true");
	$("#pirateHolonet").prop("checked", pirateHolonet);
	currentLocation = Cookies.get()["currentLocation"];
	currentDestination = Cookies.get()["currentDestination"];

	populateLocationDropdown();
	populateDestinationDropdown();

	updateAll();

	// Location dropdown events
	$("#locationDropdown").on("change", function () {
		$("#locationDetails").slideDown(); // display current location details
		switchFontNormal(); // reset font-family

		currentLocation = $("#locationDropdown").val();
		Cookies.set("currentLocation", currentLocation);
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
		Cookies.set("currentRegion", currentRegion);
		$('#localEventsLocation').text(currentLocation);
		$('#instructions-box').slideUp(); // hide Suggested Usage panel

		updateAll();
	});

	// Destination dropdown events
	$("#destinationDropdown").on("change", function () {
		$("#destinationDetails").slideDown();
		switchFontNormal(); // reset font-family

		currentDestination = $("#destinationDropdown").val();
		if ("" == currentDestination)
		{
			Cookies.remove("currentDestination");
			destLoc = []; // JSON object
			destRegion = []; // JSON object
			$('#estTravelTime').slideUp();
		}
		else
		{
			Cookies.set("currentDestination", currentDestination);
			destLoc = locations.find(item => item.Name === currentDestination); // JSON object
			destRegion = regions.find(region => region.Name === destLoc.Region); // JSON object
			$('#estTravelTime').slideDown();
		}

		updateAll();
	});

	// On Change event for Ship Silhouette
	document.getElementById("shipSilhouette").addEventListener("change", onChangeSilhouette);

	// On Change event for Hyperdrive Class
	document.getElementById("hyperdriveClass").addEventListener("change", onChangeHyperdriveClass);

	// On Change event for Declared Cargo
	document.getElementById("cargoDeclared").addEventListener("change", onChangeCargoDeclared);

	// On Change event for Undeclared Cargo

	// On Change event for Pirate Holonet
	document.getElementById("pirateHolonet").addEventListener("change", togglePirateHolonet);

	// On Change event for Galactic Hyperspace Constant
	document.getElementById("galacticHyperspaceConstant").addEventListener("change", onChangeGalacticHyperspaceConstant);

	// General update of everything
	$("input").change(function() {
		Cookies.set("location", currentLoc.Name);
		Cookies.set("destination", destLoc.Name);
		populateLocationDropdown();
		populateDestinationDropdown();
		updateAll();
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
			if (location.Name == "Tantalus Detention Facility") return; // homebrew
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
			if (location.Name == "Tantalus Detention Facility") return; // homebrew
		}

		$destinationDropdown.append(
			$("<option>", { value: location.Name, text: location.Name + tags })
		);
	});
}

function updateAll()
{
	if (currentLocation)
	{
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
	}
	if (currentDestination)
	{
		destLoc = locations.find(item => item.Name === currentDestination); // JSON object
		destRegion = regions.find(region => region.Name === destLoc.Region); // JSON object
	}

	updateCurrentAtmosphere();
	updateDestAtmosphere();
	updateLocalEvents();
	updateCurrentDetails();
	updateDestDetails();
	updateLocalCustoms();
	updateTravelEstimates();

	if (currentLocation && currentLoc && currentLoc.Name)
		$("#locationDetails").slideDown();
	if (currentDestination && destLoc && destLoc.Name)
		$("#destinationDetails").slideDown();
}

// updates the current location Atmosphere description
function updateCurrentAtmosphere()
{
	if (! currentLoc.Name) return;

	$('#currentAtmosphere').text(currentLoc.Atmosphere);

	$('#currentAtmosphere').removeClass('atmos-1 atmos-2 atmost3 atmos-4 highlight').addClass('font-normal');
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
	if (! destLoc) return;

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

function updateLocalEvents()
{
	if (! currentLoc.Name) return;

	currentLocation = $("#locationDropdown").val();
	if (! (currentLoc && currentLoc.Name))
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
	if (! (currentRegion && currentRegion.Name))
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object

	// Reset local events
	$("#local-events").empty();
	$("#local-events").append('<li id="arrivalEvent">ATTENTION, NAVIGATOR: You have arrived safely.</li>');

	// Shadowport
	if (currentLoc.Shadowport) {
		$("#local-events").append('<li>RUMOR HAS IT: A clandestine <href="https://starwars.fandom.com/wiki/Shadowport">shadowport</a> is here somewhere.</li>');
	}

	// Black Market
	if (currentLoc.BlackMarket) {
		$("#local-events").append('<li>RUMOR HAS IT: A thriving <href="https://starwars.fandom.com/wiki/Black_market/Legends">black market</a> is here somewhere.</li>');
	}

	// Plot Hooks to be dangled by the GM
//	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"Psst. I got a job for you. Legal (mostly), easy work, pays the rent, y\'know? You in?"</i></li>');
//	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"Hey, you. You look tough. I got a job, pays well for <em>\'\'tough\'\'</em>."</i></li>');
//	$("#local-events").append('<li><span class="local-event-free">HOT PLOOK:</span> <i>"My client has an exclusive offer for an elite team with a handsome payout. There is considerable danger involved."</li>');

	// Arrival event
	populateArrivalEvent();

	if (! (currentLoc && currentLoc.Name))
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
	if (! (currentRegion && currentRegion.Name))
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object

	// Arrival in system events
	populateArrivalEvents(currentLoc.ImperialPresence);

	// Local events
//	populateEmpireMissions(currentLoc.ImperialPresence);
	populateEmpireEvents(currentRegion.ImperialPresence);

	// Old West events
//	populateOldWestMissions(currentLoc.OldWestiness);
	populateOldWestEvents(currentRegion.OldWestiness);

	// Flora & Fauna events
	populateOldWestEvents(currentLoc.Megafauna);
}

function updateCurrentDetails()
{
	if (currentLoc && currentLoc.Name)
	{
		if (! (currentRegion && currentRegion.Name)) currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object

		// Current Location update screen elements
		$("#currentRegion").html(currentLoc.Region);
		$("#currentSector").html(currentLoc.Sector);
		$("#currentSystem").html(currentLoc.System);
		$("#currentCapital").html(currentLoc.CapitalCity);
		$("#currentMap").html(currentLoc.Map);
		updateCurrentAtmosphere();
		$("#currentTerrain").html(currentLoc.Terrain);
		$("#currentInhabitants").html(currentLoc.Inhabitants);
		$("#currentClimate").html(currentLoc.Climate);
		$("#currentGravity").html(gravityText(currentLoc.Gravity));
		$("#currentStarportURL").text(starportText(currentLoc.Starport));
		$("#starportHeader").html(starportText(currentLoc.Starport));
		$("#currentURL").attr("title", currentLoc.Name);
		$("#currentURL").attr("href", currentLoc.URL);
		$("#currentURL").text(currentLoc.Name);
		$("#currentRegionURL").attr("title", currentRegion.Name);
		$("#currentRegionURL").attr("href", "https://starwars.fandom.com/wiki/" + currentRegion.Name.replace(" ", "_") + "/Legends");
		$("#currentRegionURL").text(currentRegion.Name);
	}
}

function updateDestDetails()
{
	if (destLoc && destLoc.Name)
	{
		if (! (destRegion && destRegion.Name)) destRegion = regions.find(region => region.Name === destLoc.Region); // JSON object

		$("#destRegion").html(destLoc.Region);
		$("#destSector").html(destLoc.Sector);
		$("#destSystem").html(destLoc.System);
		$("#destCapital").html(destLoc.CapitalCity);
		$("#destMap").html(destLoc.Map);
		updateDestAtmosphere();
		$("#destTerrain").html(destLoc.Terrain);
		$("#destInhabitants").html(destLoc.Inhabitants);
		$("#destClimate").html(destLoc.Climate);
		$("#destGravity").html(gravityText(destLoc.Gravity));
		$("#destStarportURL").text(starportText(destLoc.Starport));
		$("#destURL").attr("title", destLoc.Name);
		$("#destURL").attr("href", destLoc.URL);
		$("#destURL").text(destLoc.URL);
		$("#destRegionURL").attr("title", destRegion.Name);
		$("#destRegionURL").attr("href", "https://starwars.fandom.com/wiki/" + destRegion.Name.replace(" ", "_") + "/Legends");
		$("#destRegionURL").text(destRegion.Name);
	}
}
function updateLocalCustoms() // and starport costs, permits, contraband,...
{
	if (!currentLocation) return;
	if (! (currentLoc && currentLoc.Name))
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
	if (! (currentRegion && currentRegion.Name))
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
	shipSilhouette = $('#shipSilhouette').val();

	// Options calculations & variables
	const shipCargoDeclared = $("#cargoDeclared").val();
	const shipHyperdrive = $("#hyperdriveClass").val();
	const rarityMod = rarityModFor(currentLoc);

	// Empire Presence calculations
	// https://star-wars-rpg-ffg.fandom.com/wiki/Category:Ship_Operating
	const silhCostFactor = shipSilhouette * (shipSilhouette > 4 ? 2.5 : 1); // Capital ships start at Silhouette 5 and have a large jump in capability/cost
	const starportGradeFactor = currentLoc.Starport; // 0 = none; 5 = best
	const feePortLanding = (sanitize0to5(currentLoc.ImperialPresence) + sanitize0to5(currentRegion.ImperialPresence)) *
		silhCostFactor * starportGradeFactor;
	const textFeePortLanding = creditsOrWaived(feePortLanding);
	const feePortBerthing = Math.round(feePortLanding * 0.1);
	const textFeePortBerthing = creditsOrWaived(feePortBerthing);
	const feeCustoms = Math.round(shipCargoDeclared * 0.001 * currentLoc.Starport);
	const textFeeCustoms = creditsOrWaived(feeCustoms); // "waived" if zero
	const feeVisitation = Math.round(feePortBerthing * 0.1);
	const textFeeVisitation = creditsOrWaived(feeVisitation); // "waived" if zero
//	const feeSmuggling = Math.round(shipCargoDeclared * 0.2); // "no cargo declared" if no cargo; "(minor bribe)" if small
//	const textFeeSmuggling = creditsOrWaived(Math.max(feeSmuggling, 10));
	const waitDeparture = Math.round(currentLoc.Starport *
		Math.max(1, sanitize0to5(currentLoc.ImperialPresence) + sanitize0to5(currentRegion.ImperialPresence))); // in hours
	const textWaitDeparture = (waitDeparture>24
		? (waitDeparture/24).toFixed(1) + " days"
		: waitDeparture.toFixed(0) + " hours"
		);
	const textSmugglingPenalty = smugglingPenalty(sanitize0to5(currentLoc.ImperialPresence) +
		sanitize0to5(currentRegion.ImperialPresence) - sanitize0to5(currentLoc.OldWestiness) -
		sanitize0to5(currentRegion.OldWestiness));
	const textRarityMod = "" + (rarityMod >= 0 ? "+" : "") + rarityMod + " (base cost " + rarityCostIncrease(rarity) + ")";

	// Starport update screen elements
	$('#textFeePortLanding').text(textFeePortLanding);
	$('#textFeePortBerthing').text(textFeePortBerthing);
	$('#textFeeCustoms').text(textFeeCustoms);
	$('#textFeeVisitation').text(textFeeVisitation);
//	$('#textFeeSmuggling').text(textFeeSmuggling);
	$('#textWaitDeparture').text(textWaitDeparture);
	$('#textSmugglingPenalty').html(textSmugglingPenalty);
	$('#textRarityMod').html(textRarityMod);

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

	const textWeaponPenalty = weaponPenalty(sanitize0to5(currentLoc.OldWestiness) +
		sanitize0to5(currentRegion.OldWestiness) - sanitize0to5(currentLoc.EmpirePresence) -
		sanitize0to5(currentRegion.EmpirePresence));

	// Weapon Permits update screen elements
	$('#textPermitWeaponConcealed').html(textPermitWeaponConcealed);
	$('#textPermitWeaponSmall').html(textPermitWeaponSmall);
	$('#textPermitWeaponRifle').html(textPermitWeaponRifle);
	$('#textPermitWeaponHeavy').html(textPermitWeaponHeavy);
	$('#textPermitArmorLight').html(textPermitArmorLight);
	$('#textPermitArmorPower').html(textPermitArmorPower);
	$('#textWeaponPenalty').html(textWeaponPenalty);

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

function updateTravelEstimates()
{
	totalFactor = 1.0;

	// Find Hyperlanes available for current location
	currentRouteList = "";
	if (currentLoc)
	{
		Object.keys(hyperspaceRoutes).forEach(key => {
			// Only show the secret ones if you have the right equipment
			if (key in ["Biox Detour"])
			{
				if (! $("#pirateHolonet").is(":checked")) return;
			}

			const planets = hyperspaceRoutes[key].Route.split(",");
			if (planets.indexOf(currentLoc.Name) != -1)
			{
				if (currentRouteList.length > 0) currentRouteList += "<br/>";
				const thisRoute = hyperspaceRoutes[key];
				const factor = (1.0 - (Math.max(1.0, thisRoute.Route.split(",").length) * 0.005)).toFixed(2);
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
			// Only show the secret ones if you have the right equipment
			if (key in ["Biox Detour"])
			{
				if (! $("#pirateHolonet").is(":checked")) return;
			}

			if (planets.indexOf(destLoc.Name) != -1)
			{
				if (destRouteList.length > 0) destRouteList += "<br/>";
				const thisRoute = hyperspaceRoutes[key];
				const factor = (1.0 - (Math.max(1.0, thisRoute.Route.split(",").length) * 0.005)).toFixed(2);
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
		const shipHyperdrive = $("#hyperdriveClass").val();
		$("#ettHyperdriveClass").text(shipHyperdrive);
		$("#baseHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime));
		$("#estHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime * shipHyperdrive * totalFactor));
		$("#hyperrouteFactor").text(totalFactor.toFixed(2));
	}
}

function togglePirateHolonet()
{
	isInstalled = $("#pirateHolonet").is(":checked");
	Cookies.set("pirateHolonet", isInstalled);

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
	const retVal = Math.min(5, Math.max(saneVal, 0)); // integer, 0 to 5 inclusive
	return retVal;
}

// Converts a number to an integer, max 5, min -5.
function sanitizeMinus5to5(val)
{
	const saneVal = (Number.isInteger(Math.round(val)) ? Math.round(val) : 0);
	const retVal = Math.min(5, Math.max(saneVal, -5)); // integer, -5 to 5 inclusive
	return retVal;
}

// Converts a number to an integer, max 9, min 0.
// (Rarity goes higher as value goes lower)
function sanitizeRarity(val)
{
	const saneVal = (Number.isInteger(Math.round(-val)) ? Math.round(val) : 0);
	const retVal = Math.min(9, Math.max(0, saneVal)); // integer, 0 to 9 inclusive
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

// Converts a -5 to 5 number to display value, i.e., "Confiscation + 20% contraband value"
function smugglingPenalty(val)
{
	switch(sanitizeMinus5to5(val)) // Empire Bureacracy minus Old Westiness
	{
		case -5:
			return '<span class="law-recommended">verbal warning</span>'; break;
		case -4:
			return '<span class="law-common">written warning</span>'; break;
		case -3:
			return '<span class="law-common">an inquiry will be made</span>'; break;
		case -2:
			return '<span class="law-common">1% of street value</span>'; break;
		case -1:
			return '<span class="law-no-restrictions">2% of street value</span>'; break;
		case 0:
			return '<span class="law-tolerated">5% of street value</span>'; break;
		case 1:
			return '<span class="law-frowned-upon">10% of street value</span>'; break;
		case 2:
			return '<span class="law-infraction">50% of street value</span>'; break;
		case 3:
			return '<span class="law-misdemeanor">automatic confiscation of cargo</span>'; break;
		case 4:
			return '<span class="law-misdemeanor">automatic confiscation of cargo; indictment likely</span>'; break;
		case 5:
			return '<span class="law-felony">automatic confiscation of ship and cargo; indictment likely</span>'; break;
		default:
			return "(unknown)";
	}
}
// Converts a -5 to 5 number to display value
function weaponPenalty(val)
{
	switch(sanitizeMinus5to5(val)) // Old Westiness
	{
		case -5:
			return '<span class="law-felony">automatic confiscation; indictment likely</span>'; break;
		case -4:
			return '<span class="law-misdemeanor">automatic confiscation; arrest likely</span>'; break;
		case -3:
			return '<span class="law-misdemeanor">automatic confiscation</span>'; break;
		case -2:
			return '<span class="law-infraction">250% of permit cost</span>'; break;
		case -1:
			return '<span class="law-frowned-upon">200% of permit cost</span>'; break;
		case 0:
			return '<span class="law-tolerated">150% of permit cost</span>'; break;
		case 1:
			return '<span class="law-no-restrictions">temporary confiscation likely</span>'; break;
		case 2:
			return '<span class="law-common">weapon inspection</span>'; break;
		case 3:
			return '<span class="law-common">nominal fee, 10-20cr</span>'; break;
		case 4:
			return '<span class="law-common">written warning</span>'; break;
		case 5:
			return '<span class="law-recommended">verbal warning</span>'; break;
		default:
			return "(unknown)";
	}
}

function rarityModFor(json)
{
	rarity = json.Rarity + 0;
	if (json.Region)
	{
		rarity += regions.find(item => item.Name === json.Region).Rarity;
	}

	// EotE pg150 Primary Core worlds; https://www.reddit.com/r/swrpg/comments/l9hau2/what_are_the_primary_worlds_of_the_star_wars/
	if (["Coruscant", "Duro", "Corellia", "Alderaan", "Hosnian Prime", "Kuat", "Nar Shaddaa", "Scipio", "Denon", "Eufornis Major", "Taris", "Chandrilla"].includes(json.Name))
	{
		rarity += -1;
	}

	// EotE pg150 World on primary trade lane
	// Appromimate by counting the planets in the hyperlanes which include this location.
	totalFactor = 0;
	if (currentLoc)
	{
		Object.keys(hyperspaceRoutes).forEach(key => {
			const planets = hyperspaceRoutes[key].Route.split(",");
			if (planets.indexOf(currentLoc.Name) != -1)
			{
				const thisRoute = hyperspaceRoutes[key];
				const factor = (Math.max(1.0, thisRoute.Route.split(",").length) * 0.005);
				totalFactor += factor;
			}
		});

		rarity -= totalFactor.toFixed(0);
	}

	return rarity;
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
			return '<span class="law-misdemeanor">Misdemeanor</span> (Permit ' + rarityText(rarity + 1) + cost + 'cr)'; break;
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
		const newEvent = getRandom(localEmpireEvents);
		$("#local-events").append(newEvent);
	}
}

function populateOldWestEvents(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = getRandom(localOldWestEvents);
		$("#local-events").append(newEvent);
	}
}

/*
function populateEmpireMissions(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = generateEmpireMission();
		$("#local-events").append(newEvent);
	}
}

function populateOldWestMissions(eventCount)
{
	for (ii = 0; ii < eventCount; ii++)
	{
		const newEvent = generateOldWestMission();
		$("#local-events").append(newEvent);
	}
}
*/

function onChangeCargoDeclared()
{
	Cookies.set("cargoDeclared", $("#cargoDeclared").val());
	updateLocalCustoms();
}


// Galactic Travel Time adjustment
function onChangeGalacticHyperspaceConstant()
{
	Cookies.set("GHC", $("#galacticHyperspaceConstant").val());
	Cookies.set("hyperdriveClass", $("#hyperdriveClass").val());
	updateTravelEstimates();
}

// Hyperlane travel time multiplier
/*
function hyperlaneFactor(startLoc, endLoc)
{
	if (!currentLoc) return;

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
*/

// EotE pg247, Fly Casual pg78
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
		const distance = Math.max(0.5, Math.sqrt(Math.pow(startLetter - endLetter, 2) + Math.pow(startNumber - endNumber, 2)));

		// side effect: update the display
		$('#baseHyperSpaceDistance').text(distance.toFixed(2) + " parsecs, ")

		baseTime = 0;
		if (distance < 1) baseTime = 12; // sublight, planet-to-planet within a system
		if (distance < 3) baseTime = Math.floor(distance * 20); // within a sector: 10-24 hours
		if (distance < 6) baseTime = Math.floor(distance * 25); // within a region: 10-72 hours
		if (distance < 9) baseTime = Math.floor(distance * 28); // between regions: 3-7 days
		baseTime = Math.floor(distance * 30); // across the galaxy: 1-3 weeks

		// Adjust for Galactic Hyperspace Constant
		baseTime *= ($("#galacticHyperspaceConstant").val() || 1.0);

		return baseTime;
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

function onChangeHyperdriveClass()
{
	Cookies.set("hyperdriveClass", $("#hyperdriveClass").val());
	updateTravelEstimates();
}


function cleanFonts()
{
	$("#body").removeClass("font-besh font-starwars font-normal");
	$("#locationDropdownLabel").removeClass("font-besh font-starwars font-normal");
	$("#destinationDropdownLabel").removeClass("font-besh font-starwars font-normal");
	$("#instructions-box").removeClass("font-besh font-starwars font-normal");
	$("#local-customs-box-header").removeClass("font-besh font-starwars font-normal");
	$(".ship-manifest-item").removeClass("font-besh font-starwars font-normal");
}

// switch to Droidobesh (illegible) font
function switchFontBesh()
{
	cleanFonts();
	$("#body").addClass("font-besh");
	$("#locationDropdownLabel").addClass("font-starwars");
	$("#destinationDropdownLabel").addClass("font-besh");
	$("#instructions-box").addClass("font-starwars");
	$("#local-customs-box-header").addClass("font-starwars");
	$(".ship-manifest-item").addClass("font-besh");
	fontNormalElements();
}

// switch to StarWars (legible) font
function switchFontStarWars()
{
	cleanFonts();
	$("#body").addClass("font-starwars");
	$("#locationDropdownLabel").addClass("font-starwars");
	$("#destinationDropdownLabel").addClass("font-starwars");
	$("#instructions-box").addClass("font-normal");
	$("#local-customs-box-header").addClass("font-normal");
	$(".ship-manifest-item").addClass("font-starwars");
	fontNormalElements();
}

// switch to Droidobesh (illegible) font
function switchFontNormal()
{
	cleanFonts();
	$("#body").addClass("font-normal");
	$("#locationDropdownLabel").addClass("font-normal");
	$("#destinationDropdownLabel").addClass("font-normal");
	$("#instructions-box").addClass("font-normal");
	$("#local-customs-box-header").addClass("font-normal");
	$(".ship-manifest-item").addClass("font-normal");
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
	$("#textSmugglingPenalty").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textWeaponPenalty").removeClass("font-besh font-starwars").addClass("font-normal");
	$("#textWaitDeparture").removeClass("font-besh font-starwars").addClass("font-normal");

}

function toGalactipediaURL(name)
{
	return "https://starwars.fandom.com/wiki/" + name.replace(" ", "_"); // sometimes with /Legends appended; might need more fine tuning
}

function toGalactipediaALink(name)
{
	return '<a href="' + toGalactipediaURL(name) + '" target="_blank">' + name + '</a>';
}

function onChangeSilhouette()
{
	shipSilhouette = $('#shipSilhouette').val();
	Cookies.set("shipSilhouette", shipSilhouette);

	if (shipSilhouette > 4) // Commercial/Military size
	{
		$('#silh5plus').addClass("silhouette-5-plus");
	}
	else
	{
		$('#silh5plus').removeClass("silhouette-5-plus");
	}

	updateLocalCustoms();
}

function toggleHelp()
{
	$('#instructions-box').slideToggle();
}

function rarityCostIncrease(rarity)
{
	switch(rarity)
	{
		case -5:
		case -4:
		case -3:
			return "75% for certain items";
		case -2:
		case -1:
			return "90% for certain items";
		case 0:
		case 1:
			return "standard";
		case 2:
			return "200%";
		case 3:
			return "300%"
		case 4:
		case 5:
			return "400%";
		default:
			return "?";
	}
}