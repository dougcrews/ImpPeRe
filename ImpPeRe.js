// @TODO https://starwars.fandom.com/wiki/Prison https://starwars.fandom.com/wiki/Stars%27_End/Legends
// @TODO boosts/setbacks/upgrades options per location; see
//	https://starwars.fandom.com/wiki/Kala%27uun_Starport for example
//	https://starwars.fandom.com/wiki/Sarkan/Legends#Society_and_culture
// @TODO Pirate Holonet, ECS, Sensor Baffler, Sensor Shunt, Mobile Listening Post, Nightshadow Coating, Pseudo-Cloaking Device, Encryption Array
// @TODO "Undeclared" cargo, smuggler compartments
// @TODO Add local storage and remember events chosen
// @TODO https://star-wars-rpg-ffg.fandom.com/wiki/Category:Beast#RIDING_BEASTS

// Globals
currentLocation = Cookies.get()["currentLocation"] ;
currentLoc = {}; // JSON object
currentRegion = {}; // JSON object
destLocation = Cookies.get()["destLocation"];
destLoc = {}; // JSON object
destRegion = {}; // JSON object

const htmlBoostDie = '<span class="font-normal starwars-dice boost">b</span>';
const htmlSetbackDie = '<span class="font-normal starwars-dice setback">s</span>';
const htmlThreatDie = '<span class="font-normal starwars-dice threat">Threat</span>';
const htmlAdvantageDie = '<span class="font-normal starwars-dice advantage">Advantage</span>';
const htmlDifficultyDie = '<span class="font-normal starwars-dice difficulty">p</span>';
const htmlChallengeDie = '<span class="font-normal starwars-dice challenge">R</span>';
const htmlAbilityDie = '<span class="font-normal starwars-dice ability">g</span>';
const htmlProficiencyDie = '<span class="font-normal starwars-dice proficiency">Y</span>';
const htmlSuccess = '<span class="font-normal starwars-dice success">¤</span>';
const htmlUpgradeDifficultyDie1x = '<span class="font-normal starwars-dice challenge">1x</span>';
const htmlUpgradeDiff1x = 'Upgrade difficulty (+' + htmlDifficultyDie + '»' + htmlChallengeDie + ')';
const htmlDowngradeDifficultyDie1x = '<span class="font-normal starwars-dice difficulty">1x</span>';
const htmlDowngradeDiff1x = 'Downgrade difficulty (-' + htmlDifficultyDie + '«' + htmlChallengeDie + ')';
const htmlUpgradeAbilityDie1x = '<span class="font-normal starwars-dice proficiency">1x</span>';
const htmlUpgradeAbility1x = 'Upgrade next check (+' + htmlAbilityDie + '»' + htmlProficiencyDie + ')';

$(document).ready(function ()
{
	switchFontBesh(); // set initial font

	// minimize collapsible sections
	$("#locationDetails").slideUp();
	$("#destinationDetails").slideUp();
	$("#manifest-menu-hidden").slideUp();
	$(".hidden").slideUp();

	// Default input values
	getCookies();

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

		destLocation = $("#destinationDropdown").val();
		if ("" == destLocation)
		{
			destLoc = {}; // JSON object
			destRegion = {}; // JSON object
			$('#estTravelTime').slideUp();
		}
		else
		{
			destLoc = locations.find(item => item.Name === destLocation); // JSON object
			destRegion = regions.find(region => region.Name === destLoc.Region); // JSON object
			$('#estTravelTime').slideDown();
		}

		updateDestDetails();
		updateTravelEstimates();
	});

	// On Change event for Ship Silhouette
	document.getElementById("shipSilhouette").addEventListener("change", onChangeSilhouette);

	// On Change event for Hyperdrive Class
	document.getElementById("hyperdriveClass").addEventListener("change", onChangeHyperdriveClass);

	// On Change event for Declared Cargo
	document.getElementById("cargoDeclared").addEventListener("change", onChangeCargoDeclared);

	// On Change event for Hidden Cargo
	document.getElementById("cargoHidden").addEventListener("change", onChangeCargoDeclared);

	// On Change event for Pirate Holonet
	document.getElementById("pirateHolonet").addEventListener("change", togglePirateHolonet);

	// On Change event for Galactic Hyperspace Constant
	document.getElementById("galacticHyperspaceConstant").addEventListener("change", onChangeGalacticHyperspaceConstant);

	// On Change event for Distance from current location
	document.getElementById("filterDistance").addEventListener("change", populateDestinationDropdown());

	// On Change event for ship hull & system strain
	document.getElementById("hullMax").addEventListener("change", onChangeShipManifest);
	document.getElementById("hullCurrent").addEventListener("change", onChangeShipManifest);
	document.getElementById("strainMax").addEventListener("change", onChangeShipManifest);
	document.getElementById("strainCurrent").addEventListener("change", onChangeShipManifest);

	// General update of everything
	$("input").change(function() {
		Cookies.set("currentLocation", currentLoc.Name);
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

	if (!currentLocation) return;
	currentLoc = locations.find(item => item.Name === currentLocation); // JSON object

	startMap = currentLoc.Map;
	minDistance = Number($("#filterDistance").val());
	$.each(locations, function (index, location) {
		tags = " ";
		if ($("#pirateHolonet").is(":checked"))
		{
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
			endMap = location.Map;
			distance = getParsecsBetween(startMap, endMap).toFixed(1);
			if (minDistance)
			{
				if (distance > minDistance)
				{
					return;
				}
			}

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
			tags += "[" + distance + " parsecs]";
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

function setCookies()
{
	Cookies.set("currentLocation", currentLocation);

	Cookies.set("hullMax", $('#hullMax').val());
	Cookies.set("hullCurrent", $('#hullCurrent').val());
	Cookies.set("strainMax", $('#strainMax').val());
	Cookies.set("strainCurrent", $('#strainCurrent').val());
	Cookies.set("cargoDeclared", $("#cargoDeclared").val());
	Cookies.set("cargoHidden", $("#cargoHidden").val());
	Cookies.set("shipSilhouette", $("#shipSilhouette").val());
	Cookies.set("hyperdriveClass", $("#hyperdriveClass").val());
	Cookies.set("gHC", $("#gHC").val());
	Cookies.set("pirateHolonet", $("#pirateHolonet").val());
}

function getCookies()
{
	currentLocation = Cookies.get()["currentLocation" || ""];

	$('#hullMax').val(Cookies.get()["hullMax"] || 99);
	$('#hullCurrent').val(Cookies.get()["hullCurrent"] || 0);
	$('#strainMax').val(Cookies.get()["strainMax"] || 99);
	$('#strainCurrent').val(Cookies.get()["strainCurrent"] || 0);
	$("#cargoDeclared").val(Cookies.get()["cargoDeclared"] || 0);
	$("#cargoHidden").val(Cookies.get()["cargoHidden"] || 0);
	$("#shipSilhouette").val(Cookies.get()["shipSilhouette"] || 4);
	$("#hyperdriveClass").val(Cookies.get()["hyperdriveClass"] || 1);
	$("#galacticHyperspaceConstant").val(Cookies.get()["GHC"] || 1);
	$("#pirateHolonet").prop("checked", Cookies.get()["pirateHolonet"] == "true");
}

function onChangeShipManifest()
{
	setCookies();
	updateTravelEstimates();
	updateLocalCustoms();
}

function updateAll()
{
	getCookies();

	if (currentLocation)
	{
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
	}

	updateCurrentAtmosphere();
//	updateDestAtmosphere();
	updateLocalEvents();
	updateCurrentDetails();
	updateDestDetails();
	updateLocalCustoms();
	updateTravelEstimates();
	populateDestinationDropdown();

	if (currentLocation && currentLoc && currentLoc.Name)
		$("#locationDetails").slideDown();
	if (destLocation && destLoc && destLoc.Name)
		$("#destinationDetails").slideDown();

	setCookies();
}

// updates the current location Atmosphere description
function updateCurrentAtmosphere()
{
	if (! currentLoc.Name) return;

	$('#currentAtmosphere').text(currentLoc.Atmosphere);

	$('#currentAtmosphere').removeClass('atmos-1 atmos-2 atmos-3 atmos-4 highlight').addClass('font-normal');
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

//		$("#destRegion").html(destLoc.Region);
//		$("#destSector").html(destLoc.Sector);
//		$("#destSystem").html(destLoc.System);
//		$("#destCapital").html(destLoc.CapitalCity);
//		$("#destMap").html(destLoc.Map);
//		updateDestAtmosphere();
//		$("#destTerrain").html(destLoc.Terrain);
//		$("#destInhabitants").html(destLoc.Inhabitants);
//		$("#destClimate").html(destLoc.Climate);
//		$("#destGravity").html(gravityText(destLoc.Gravity));
//		$("#destStarportURL").text(starportText(destLoc.Starport));
		$("#destURL").attr("title", destLoc.Name);
		$("#destURL").attr("href", destLoc.URL);
		$("#destURL").text(destLoc.Name);
//		$("#destRegionURL").attr("title", destRegion.Name);
//		$("#destRegionURL").attr("href", "https://starwars.fandom.com/wiki/" + destRegion.Name.replace(" ", "_") + "/Legends");
//		$("#destRegionURL").text(destRegion.Name);
	}
}

function updateLocalCustoms() // and starport costs, permits, contraband,...
{
	if (!currentLocation) return;
	if (! (currentLoc && currentLoc.Name))
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
	if (! (currentRegion && currentRegion.Name))
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object
	shipSilhouette = Number($('#shipSilhouette').val());

	// Options calculations & variables
	const shipCargoDeclared = Number($("#cargoDeclared").val());
	const shipCargoHidden = Number($("#cargoHidden").val());
	const shipHyperdrive = Number($("#hyperdriveClass").val());
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
	const textFeeRepairs = getRepairsEstimate();
	const feeVisitation = Math.round(feePortBerthing * 0.1);
	const textFeeVisitation = creditsOrWaived(feeVisitation); // "waived" if zero
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
	$('#textFeePortLanding').html(textFeePortLanding);
	$('#textFeePortBerthing').html(textFeePortBerthing);
	$('#textFeeCustoms').html(textFeeCustoms);
	$('#textFeeRepairs').html(textFeeRepairs);
	$('#textFeeVisitation').html(textFeeVisitation);
	$('#textWaitDeparture').html(textWaitDeparture);
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
	hyperlanesAtOrigin = 0;
	hyperlanesAtDest = 0;
	parsecsTraveled = 0;

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
				hyperlanesAtOrigin++;
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
				hyperlanesAtDest++;
				if (destRouteList.length > 0) destRouteList += "<br/>";
				const thisRoute = hyperspaceRoutes[key];
				const factor = (1.0 - (Math.max(1.0, thisRoute.Route.split(",").length) * 0.005)).toFixed(2);
				totalFactor *= factor;
				destRouteList += toGalactipediaALink(thisRoute.Name) + " (factor " + factor + ")";
			}
		});
	};

	// Update Astrogation possible boosts/setbacks
	astrogationHtml = "";

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

					// Also bonus to Astrogation!
					astrogationHtml += '<br/><strong>Single hyperlane</strong>: ' +
						'Downgrade difficulty -' + htmlDifficultyDie;
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
		const shipHyperdrive = Number($("#hyperdriveClass").val());
		parsecsTraveled = getParsecsBetween(currentLoc.Map, destLoc.Map);
		$("#ettHyperdriveClass").text(shipHyperdrive);
		$("#baseHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime));
		$("#estHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime * shipHyperdrive * totalFactor));
		$("#hyperrouteFactor").text(totalFactor.toFixed(2));
	}

	if (['Core Worlds'].includes(currentLoc.Region))
	{
		astrogationHtml += '<br/>origin Core Worlds: +' + htmlBoostDie + htmlBoostDie;
	}
	if (["Colonies", "Inner Rim", "Expansion Region"].includes(currentLoc.Region))
	{
		astrogationHtml += '<br/>origin Colonies/Inner Rim/Expansion Region: +' + htmlBoostDie;
	}
	if (["Outer Rim", "Hutt Space"].includes(currentLoc.Region))
	{
		astrogationHtml += '<br/>origin Outer Rim/Hutt Space: +' + htmlSetbackDie;
	}
	if (["Wild Space", "Unknown Regions", "Deep Core", "Extragalactic"].includes(currentLoc.Region))
	{
		astrogationHtml += '<br/>origin Wild Space/Unknown Regions/Deep Core/Extragalactic: +' + htmlSetbackDie + htmlSetbackDie;
	}

	if (hyperlanesAtOrigin > 0)
	{
		astrogationHtml += "<br/>Hyperlanes at origin: +";
		for (ii = 0; ii < hyperlanesAtOrigin; ii++) {
			astrogationHtml += htmlBoostDie;
		}
	}
	if (parsecsTraveled > 1) // first parsec is free
	{
		astrogationHtml += '<br/>Parsecs travelled (straight line): ';
		for (ii = 1; ii < parsecsTraveled; ii++) {
			astrogationHtml += htmlSetbackDie;
		}
	}

	if (hyperlanesAtDest > 0)
	{
		astrogationHtml += "<br/>Hyperlanes at destination: +";
		for (ii = 0; ii < hyperlanesAtDest; ii++) {
			astrogationHtml += htmlBoostDie;
		}
	}

	if (hyperlanesAtOrigin == 0 && hyperlanesAtDest == 0 && parsecsTraveled > 1)
	{
		astrogationHtml += '<br/>No hyperlanes at either end: ' + htmlUpgradeDiff1x;
	}

	if (hyperlanesAtOrigin > 0 && hyperlanesAtDest > 0)
	{
		astrogationHtml += '<br/>Hyperlanes at both ends: +	<span class="font-normal starwars-dice boost">b</span>';
	}


	if (['Core Worlds'].includes(destLoc.Region))
	{
		astrogationHtml += '<br/>destination Core Worlds: +' + htmlBoostDie + htmlBoostDie;
	}
	if (["Colonies", "Inner Rim", "Expansion Region"].includes(destLoc.Region))
	{
		astrogationHtml += '<br/>destination Colonies/Inner Rim/Expansion Region: +' + htmlBoostDie;
	}
	if (["Outer Rim", "Hutt Space"].includes(destLoc.Region))
	{
		astrogationHtml += '<br/>destination Outer Rim/Hutt Space: +' + htmlSetbackDie;
	}
	if (["Wild Space", "Unknown Regions", "Deep Core", "Extragalactic"].includes(destLoc.Region))
	{
		astrogationHtml += '<br/>dest Wild Space/Unknown Regions/Deep Core/Extragalactic: +' + htmlSetbackDie + htmlSetbackDie;
	}

	const hullMax = Number($('#hullMax').val());
	const hullCurrent = Number($('#hullCurrent').val());
	const strainMax = Number($('#strainMax').val());
	const strainCurrent = Number($('#strainCurrent').val());

	if ((hullCurrent > (hullMax * 0.5)) || (strainCurrent > (strainMax * 0.5)))
	{
		astrogationHtml += '<br/>Hull Trauma or System Strain > 50% max: +' + htmlSetbackDie + htmlSetbackDie;
	}
	else if ((hullCurrent > (hullMax * 0.25)) || (strainCurrent > (strainMax * 0.25)))
	{
		astrogationHtml += '<br/>Hull Trauma or System Strain > 25% max: +' + htmlSetbackDie;
	}

	astrogationHtml +=
		'<br/><hr width="50%"/><i>(familiar with this route): +' + htmlBoostDie + '</i>' +
		' <br/><i>(discovered this route): ' + htmlUpgradeAbility1x + '</i>' +
		' <br/><i>(each enemy targeting you): +' + htmlSetbackDie + '</i>' +
		' <br/><i>(each speed increment): +' + htmlSetbackDie + '</i>' +
		' <br/><i>(each extra astromech droid assisting): +' + htmlBoostDie + '</i>' +
		' <br/><i>(damaged navicomputer or astromech): +' + htmlSetbackDie + ' to +' + htmlSetbackDie + htmlSetbackDie + htmlSetbackDie + '</i>' +
		' <br/><i>(missing navicomputer or astromech): +' + htmlUpgradeDiff1x + '</i>' +
		' <br/><i>(start or end in gravity well): automatic +' + htmlThreatDie + '</i>';

	$('#hyperspaceDice').html(astrogationHtml);
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
	const shipCargoHidden = Number($("#cargoHidden").val()) || 0;
	switch(sanitizeMinus5to5(val)) // Empire Bureacracy minus Old Westiness
	{
		case -5:
			return '<span class="law-recommended">verbal warning</span>'; break;
		case -4:
			return '<span class="law-common">written warning</span>'; break;
		case -3:
			return '<span class="law-common">an inquiry will be made</span>'; break;
		case -2:
			return '<span class="law-common">1% of street value: ' + creditsOrWaived((shipCargoHidden * 0.01).toFixed(0)) + '</span>'; break;
		case -1:
			return '<span class="law-no-restrictions">2% of street value: ' + creditsOrWaived((shipCargoHidden * 0.02).toFixed(0)) + '</span>'; break;
		case 0:
			return '<span class="law-tolerated">5% of street value: ' + creditsOrWaived((shipCargoHidden * 0.05).toFixed(0)) + '</span>'; break;
		case 1:
			return '<span class="law-frowned-upon">10% of street value: ' + creditsOrWaived((shipCargoHidden * 0.10).toFixed(0)) + '</span>'; break;
		case 2:
			return '<span class="law-infraction">50% of street value: ' + creditsOrWaived((shipCargoHidden * 0.50).toFixed(0)) + '</span>'; break;
		case 3:
			return '<span class="law-misdemeanor">100% of cargo</span>'; break;
		case 4:
			return '<span class="law-misdemeanor">100% of cargo; indictment likely</span>'; break;
		case 5:
			return '<span class="law-felony">100% of cargo; ship impounded; indictment likely</span>'; break;
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
	if (val == 0) return '<span class="gravity-none">None (' + val + ')</span>';
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
	setCookies();
	updateLocalCustoms();
}


// Galactic Travel Time adjustment
function onChangeGalacticHyperspaceConstant()
{
	Cookies.set("GHC", $("#galacticHyperspaceConstant").val());
	Cookies.set("hyperdriveClass", $("#hyperdriveClass").val());
	updateTravelEstimates();
}

function getParsecsBetween(startMap, endMap)
{
	const minParsecs = 0.5; // minimum travel distance for Astrogation purposes
	if (startMap && endMap)
	{
		const startLetter = startMap[0].charCodeAt(0); // no need to zero, we only care about the difference
		const startNumber = startMap.substring(2);
		const endLetter = endMap[0].charCodeAt(0); // no need to zero, we only care about the difference
		const endNumber = endMap.substring(2);

		// Assume straight line, ignoring hyperspace routes
		return Number(Math.max(minParsecs, Math.sqrt(Math.pow(startLetter - endLetter, 2) + Math.pow(startNumber - endNumber, 2))));
	}
	return Number(minParsecs);
}

// EotE pg247, Fly Casual pg78
// https://oakthorne.net/wiki/index.php/SW_Hyperspace_Travel_Times
function hyperspaceTravelTime(startMap, endMap)
{
	if (startMap && endMap)
	{
		const distance = getParsecsBetween(startMap, endMap);

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
	shipSilhouette = Number($('#shipSilhouette').val());
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
			return '<span style="color:green">75% for certain items</span>';
		case -2:
		case -1:
			return '<span style="color:green">90% for certain items</span>';
		case 0:
		case 1:
			return "standard";
		case 2:
			return '<span style="color:red">200%</span>';
		case 3:
			return '<span style="color:red">300%</span>';
		case 4:
		case 5:
			return '<span style="color:red">400%</span>';
		default:
			return "the emperor is a fink!";
	}
}

// Vehicle Ops: Repairs & Wear https://star-wars-rpg-ffg.fandom.com/wiki/Category:Homebrew
function getRepairsEstimate()
{
	shipSilhouette = Number($('#shipSilhouette').val());
	starportRating = Number(currentLoc.Starport); // 0 to 5; 0 = none, 5 = best
	pirateHolonetInstalled = $("#pirateHolonet").is(":checked");
	basePrice = 0.00;
	multiplier = 1.0;
	htmlResponse = "";

	switch(starportRating)
	{
		case 0: // no facilities
			return "(no starport exists) +(" + htmlSetbackDie + htmlSetbackDie + ")";
			break;
		case 1: // Landing Field
			if (shipSilhouette > 4) return "(Grade 2 starport required)";
			multiplier *= 0.50;
			if (pirateHolonetInstalled) htmlResponse += "[Landing Field]";
			htmlResponse += " +(" + htmlSetbackDie + ")";
			break;
		case 2: // Limited Services
			if (shipSilhouette > 5) return "(Grade 3 starport required)";
			multiplier *= 0.75;
			if (pirateHolonetInstalled) htmlResponse += "[Limited Services]";
			htmlResponse += " +(" + htmlBoostDie + ")";
			break;
		case 3: // Standard Class
			if (shipSilhouette > 6) return "(Grade 4 starport required)";
			// multiplier *= 1.0;
			if (pirateHolonetInstalled) htmlResponse += "[Standard Class garage]";
			htmlResponse += " +(" + htmlSuccess + ")";
			break;
		case 4: // Stellar Class
			if (shipSilhouette > 8) return "(Grade 5 starport required)";
			multiplier *= 2.0;
			if (pirateHolonetInstalled) htmlResponse += "[Stellar Class starport]";
			htmlResponse += " +(" + htmlSuccess + htmlSuccess + ")";
			break;
		case 5: // Imperial Class
			multiplier *= 3.0;
			if (pirateHolonetInstalled) htmlResponse += "[Imperial Class starport]";
			htmlResponse += " +(" + htmlSuccess + htmlSuccess + htmlSuccess + ")";
			break;
	}

	switch (shipSilhouette)
	{
		case 0: basePrice = 100.00; break; // minimum fee to fix your space-skateboard
		case 1: basePrice = 200.00; break;
		case 2: basePrice = 400.00; break;
		case 3: basePrice = 600.00; break;
		case 4: basePrice = 800.00; break;
		case 5: basePrice = 1000.00; break;
		case 6: basePrice = 5000.00; break;
		case 7: basePrice = 20000.00; break;
		case 8: basePrice = 100000.00; break;
		case 9: basePrice = 500000.00; break;
		default: basePrice = 800.00; break;
	}

	hullMax = Number($('#hullMax').val());
	hullCurrent = Number($('#hullCurrent').val());
	if (hullCurrent > (hullMax * 0.5))
	{
		multiplier *= 2.0;
		if (pirateHolonetInstalled) htmlResponse += "[major hull trauma surcharge]";
	}
	else if (hullCurrent > (hullMax * 0.25))
	{
		multiplier *= 1.5;
		if (pirateHolonetInstalled) htmlResponse += "[minor hull trauma surcharge]";
	}
	else if (hullCurrent == 0)
	{
		return "(no repairs needed)";
	}

	if (multiplier > 1.0)
	{
		htmlResponse = '<span style="color:red">' + htmlResponse;
	}
	else if (multiplier < 1.0)
	{
		htmlResponse = '<span style="color:green">' + htmlResponse;
	}
	else
	{
		htmlResponse = '<span>' + htmlResponse;
	}

	htmlResponse += " " + (basePrice * multiplier) + "cr</span>";
	return htmlResponse;
}
