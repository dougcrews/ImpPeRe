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
currentRouteList = [];

const htmlRightArrow = '&#8658;';
const htmlBoostDie = '<span class="font-normal starwars-dice-text boost">b</span>';
const htmlSetbackDie = '<span class="font-normal starwars-dice-text setback">s</span>';
const htmlSuccess = '<img alt="Success" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_success.png"/>';
const htmlFailure = '<img alt="Failure" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_failure.png"/>';
const htmlAdvantage = '<img alt="Advantage" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_advantage.png"/>';
const htmlThreat = '<img alt="Threat" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_threat.png"/>';
const htmlTriumph = '<img alt="Triumph" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_triumph.png"/>';
const htmlDespair = '<img alt="Despair" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_despair.png"/>';

const htmlAbilityDie = '<img alt="Ability" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_ability.png"/>';
const htmlProficiencyDie = '<img alt="Proficiency" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_proficiency.png"/>';
const htmlDifficultyDie = '<img alt="Difficulty" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_difficulty.png"/>';
const htmlChallengeDie = '<img alt="Challenge" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_challenge.png"/>';

const htmlForceDie = '<img alt="Force" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_force.png"/>';
const htmlForceLight = '<img alt="Force" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_force_light.png"/>';
const htmlForceDark = '<img alt="Force" style="display: inline; vertical-align: text-top; max-width: 20px;" src="assets/images/swrpg_dice_force_dark.png"/>';

const htmlUpgradeDifficultyDie1x = '<span class="font-normal starwars-dice-text challenge">1x</span>';
const htmlUpgradeDiff1x = '(' + htmlDifficultyDie + htmlRightArrow + htmlChallengeDie + ')';
const htmlDowngradeDifficultyDie1x = '<span class="font-normal starwars-dice-text difficulty">1x</span>';
const htmlDowngradeDiff1x = '(' + htmlChallengeDie + htmlRightArrow + htmlDifficultyDie + ')';
const htmlUpgradeAbilityDie1x = '<span class="font-normal starwars-dice-text proficiency">1x</span>';
const htmlUpgradeAbility1x = '(' + htmlAbilityDie + htmlRightArrow + htmlProficiencyDie + ')';
const htmlDowngradeAbility1x = '(' + htmlProficiencyDie + htmlRightArrow + htmlAbilityDie + ')';


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

	$('#hullMax').val(Cookies.get()["hullMax"] || 22); // YT-1300
	$('#hullCurrent').val(Cookies.get()["hullCurrent"] || 0);
	$('#strainMax').val(Cookies.get()["strainMax"] || 15); // YT-1300
	$('#strainCurrent').val(Cookies.get()["strainCurrent"] || 0);
	$("#cargoDeclared").val(Cookies.get()["cargoDeclared"] || 0);
	$("#cargoHidden").val(Cookies.get()["cargoHidden"] || 0);
	$("#shipSilhouette").val(Cookies.get()["shipSilhouette"] || 4); // YT-1300
	$("#hyperdriveClass").val(Cookies.get()["hyperdriveClass"] || 2); // YT-1300
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

		updateCurrentAtmosphere();
//		updateDestAtmosphere();
		updateLocalEvents();
		updateCurrentDetails();
		updateDestDetails();
		updateLocalCustoms();
		updateTravelEstimates();
		populateDestinationDropdown();
	}

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
	if (currentLoc.Atmosphere.includes("Type IV"))
	{
		$('#currentAtmosphere').addClass('atmos-4');
	}
	else if (currentLoc.Atmosphere.includes("Type III"))
	{
		$('#currentAtmosphere').addClass('atmos-3');
	}
	else if (currentLoc.Atmosphere.includes("Type II"))
	{
		$('#currentAtmosphere').addClass('atmos-2');
	}
	else if (currentLoc.Atmosphere.includes("Type I"))
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

	// Arrival event
	populateArrivalEvent();

	if (! (currentLoc && currentLoc.Name))
		currentLoc = locations.find(item => item.Name === currentLocation); // JSON object
	if (! (currentRegion && currentRegion.Name))
		currentRegion = regions.find(region => region.Name === currentLoc.Region); // JSON object

	// Arrival in system events
	populateArrivalEvents(currentLoc.ImperialPresence);

	// Local events
	populateEmpireEvents(currentRegion.ImperialPresence);

	// Old West events
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

		$("#destURL").attr("title", destLoc.Name);
		$("#destURL").attr("href", destLoc.URL);
		$("#destURL").text(destLoc.Name);
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
	const feePortLanding = (sanitize(currentLoc.ImperialPresence, 0, 5) + sanitize(currentRegion.ImperialPresence, 0, 5)) *
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
		Math.max(1, sanitize(currentLoc.ImperialPresence, 0, 5) + sanitize(currentRegion.ImperialPresence, 0, 5))); // in hours
	const textWaitDeparture = (waitDeparture>24
		? (waitDeparture/24).toFixed(1) + " days"
		: waitDeparture.toFixed(0) + " hours"
		);
	const textSmugglingPenalty = smugglingPenalty(sanitize(currentLoc.ImperialPresence, 0, 5) +
		sanitize(currentRegion.ImperialPresence, 0, 5) - sanitize(currentLoc.OldWestiness, 0, 5) -
		sanitize(currentRegion.OldWestiness, 0, 5));
	const rarity = rarityModFor(currentLoc);
	const textRarityMod = "" + (rarityMod >= 0 ? "+" : "") + rarityMod + " (base cost " + rarityCostIncrease(rarity) + ")";
	const textLocalRarity = getTextLocalRarity(rarity);

	// Starport update screen elements
	$('#textFeePortLanding').html(textFeePortLanding);
	$('#textFeePortBerthing').html(textFeePortBerthing);
	$('#textFeeCustoms').html(textFeeCustoms);
	$('#textFeeRepairs').html(textFeeRepairs);
	$('#textFeeVisitation').html(textFeeVisitation);
	$('#textWaitDeparture').html(textWaitDeparture);
	$('#textSmugglingPenalty').html(textSmugglingPenalty);
	$('#textRarityMod').html(textRarityMod);
	$('#textLocalRarity').html(textLocalRarity);

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

	const textWeaponPenalty = weaponPenalty(sanitize(currentLoc.OldWestiness, 0, 5) +
		sanitize(currentRegion.OldWestiness, 0, 5) - sanitize(currentLoc.EmpirePresence, 0, 5) -
		sanitize(currentRegion.EmpirePresence, 0, 5));

	// Weapon Permits update screen elements
	$('#textPermitWeaponConcealed').html(textPermitWeaponConcealed);
	$('#textPermitWeaponSmall').html(textPermitWeaponSmall);
	$('#textPermitWeaponRifle').html(textPermitWeaponRifle);
	$('#textPermitWeaponHeavy').html(textPermitWeaponHeavy);
	$('#textPermitArmorLight').html(textPermitArmorLight);
	$('#textPermitArmorPower').html(textPermitArmorPower);
	$('#textWeaponPenalty').html(textWeaponPenalty);

	// Law & Order calculations
	const baseLaw = 0; // - sanitize(currentLoc.ImperialPresence + currentRegion.ImperialPresence, -5, 5);

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

	// Update Astrogation possible boosts/setbacks
	astrogationHtml = "";
	astrogationPopupHtml = "";

	parsecsTraveled = getParsecsBetween(currentLoc.Map, destLoc.Map);
	baseDifficulty = (parsecsTraveled * 1).toFixed(1); // number of purple & yellow dice

	htmlBaseDicePool = getDicePool(baseDifficulty); // just for raw distance
	$('#astrogationDicePoolBase').html(htmlBaseDicePool);

	// Find Hyperlanes available for current location
	currentRouteList = "";
	if (currentLoc)
	{
		hyperspaceRoutes.forEach(route => {
			// Only show the secret ones if you have the right equipment
			if (route.Name in ["Biox Detour"])
			{
				if (! $("#pirateHolonet").is(":checked")) return;
			}

			const planets = route.Route.split(",");
			if (planets.indexOf(currentLoc.Name) != -1)
			{
				hyperlanesAtOrigin++;
				if (currentRouteList.length > 0) currentRouteList += "<br/>";
				const factor = (1.0 - (Math.max(1.0, route.Route.split(",").length) * 0.005)).toFixed(2);
				totalFactor *= factor;
				currentRouteList += toGalactipediaALink(route.Name) + " (factor " + factor + ")";
			}
		});
	}

	// Find Hyperlanes available for destination
	destRouteList = "";
	if (destLoc)
	{
		hyperspaceRoutes.forEach(route => {
			const planets = route.Route.split(",");
			// Only show the secret ones if you have the right equipment
			if (route.Name in ["Biox Detour"])
			{
				if (! $("#pirateHolonet").is(":checked")) return;
			}

			if (planets.indexOf(destLoc.Name) != -1)
			{
				hyperlanesAtDest++;
				if (destRouteList.length > 0) destRouteList += "<br/>";
				const factor = (1.0 - (Math.max(1.0, route.Route.split(",").length) * 0.005)).toFixed(2);
				totalFactor *= factor;
				destRouteList += toGalactipediaALink(route.Name) + " (factor " + factor + ")";
			}
		});
	};

	if (currentRouteList.length > 0 && destRouteList.length > 0)
	{
		// short-circuit if origin & destination are the same system
		if (currentLoc.System != destLoc.System)
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
						astrogationHtml += '<br/><strong>Single Hyperlane</strong>: ' + htmlDowngradeDiff1x;
						baseDifficulty -= 8; // effectively a yellow to purple conversion
					}
				});
			});
		}
	}

	$('#currentHyperlanes').html(currentRouteList);
	$('#destHyperlanes').html(destRouteList);

	// Fly Casual pg78
	if  (! (currentLoc.Map && destLoc.Map)) return;

	const baseHyperspaceTime = hyperspaceTravelTime(currentLoc.Map, destLoc.Map);
	const shipHyperdrive = Number($("#hyperdriveClass").val());
	$("#ettHyperdriveClass").text(shipHyperdrive);
	$("#baseHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime));
	$("#estHyperspaceTime").text(hoursToTravelTimeDesc(baseHyperspaceTime * shipHyperdrive * totalFactor));
	$("#hyperrouteFactor").text(totalFactor.toFixed(2));

	if (['Core Worlds'].includes(currentLoc.Region))
	{
		astrogationHtml += "<br/>Origin: " + currentLoc.Region + " (+" + htmlBoostDie + htmlBoostDie + ")";
	}
	if (["Colonies", "Inner Rim", "Expansion Region"].includes(currentLoc.Region))
	{
		astrogationHtml += "<br/>Origin: " + currentLoc.Region + " (+" + htmlBoostDie + ")";
	}
	if (["Outer Rim", "Hutt Space"].includes(currentLoc.Region))
	{
		astrogationHtml += "<br/>Origin: " + currentLoc.Region + " (+" + htmlSetbackDie + ")";
	}
	if (["Wild Space", "Unknown Regions", "Deep Core", "Extragalactic"].includes(currentLoc.Region))
	{
		astrogationHtml += "<br/>Origin: " + currentLoc.Region + " (+" + htmlSetbackDie + htmlSetbackDie + ")";
	}

	if (hyperlanesAtOrigin == 0 && hyperlanesAtDest == 0 && parsecsTraveled > 1)
	{
		astrogationHtml += "<br/>No hyperlanes at either end: " + htmlSetbackDie;
	}

	if (hyperlanesAtOrigin > 0 && hyperlanesAtDest > 0)
	{
		astrogationHtml += "<br/>Hyperlanes at both ends: (+" + htmlBoostDie +")";
	}

	if (['Core Worlds'].includes(destLoc.Region))
	{
		astrogationHtml += "<br/>Destination: " + destLoc.Region + " (+" + htmlBoostDie + htmlBoostDie + ")";
	}
	if (["Colonies", "Inner Rim", "Expansion Region"].includes(destLoc.Region))
	{
		astrogationHtml += "<br/>Destination: " + destLoc.Region + " (+" + htmlBoostDie + ")";
	}
	if (["Outer Rim", "Hutt Space"].includes(destLoc.Region))
	{
		astrogationHtml += "<br/>Destination: " + destLoc.Region + " (+" + htmlSetbackDie + ")";
	}
	if (["Wild Space", "Unknown Regions", "Deep Core", "Extragalactic"].includes(destLoc.Region))
	{
		astrogationHtml += "<br/>Destination: " + destLoc.Region + " (+" + htmlSetbackDie + htmlSetbackDie + ")";
	}

	const hullMax = Number($('#hullMax').val());
	const hullCurrent = Number($('#hullCurrent').val());
	const strainMax = Number($('#strainMax').val());
	const strainCurrent = Number($('#strainCurrent').val());

	if ((hullCurrent > (hullMax * 0.5)) || (strainCurrent > (strainMax * 0.5)))
	{
		astrogationHtml += '<br/>Hull Trauma (' + hullCurrent + '/' + hullMax + ') or System Strain (' + strainCurrent + '/' + strainMax + ') > 50% max: (+' + htmlSetbackDie + htmlSetbackDie + ")";
	}
	else if ((hullCurrent > (hullMax * 0.25)) || (strainCurrent > (strainMax * 0.25)))
	{
		astrogationHtml += '<br/>Hull Trauma (' + hullCurrent + '/' + hullMax + ') or System Strain (' + strainCurrent + '/' + strainMax + ') > 25% max: (+' + htmlSetbackDie + ")";
	}

	$('#hyperspaceDice').html(astrogationHtml);

	astrogationDicePool = getDicePool(baseDifficulty);

	$('#astrogationDicePool').html(astrogationDicePool);

	astrogationPopupHtml +=
		'<h2 align="center">Astrogation</h2>' +
		'<h3 align="left">Situational Modifiers:</h3>' +
		'<ul>' +
		'<li>(familiar with this route): +' + htmlBoostDie + '</lu>' +
		'<li>(discovered this route): ' + htmlUpgradeAbility1x + '</lu>' +
		'<li>(each enemy targeting you): +' + htmlSetbackDie + '</lu>' +
		'<li>(each speed increment): +' + htmlSetbackDie + '</lu>' +
		'<li>(each extra astromech droid assisting): +' + htmlBoostDie + '</lu>' +
		'<li>(damaged navicomputer or astromech): +' + htmlSetbackDie + ' to +' + htmlSetbackDie + htmlSetbackDie + htmlSetbackDie + '</lu>' +
		'<li>(missing navicomputer or astromech): +' + htmlUpgradeDiff1x + '</lu>' +
		'<li>(start or end in gravity well): automatic +' + htmlThreat + '</lu>' +
		'</ul>'+
		'<h3 align="left">Dice Results:</h3>' + // Vehicle Ops Star Journeys https://sites.google.com/view/sturns-stuff/star-wars-stuff/vehicle-ops
		'<ul>' +
		'<li>' + htmlSuccess + ' ' + htmlRightArrow + ' better exit point or reduced calculation time</li>' +
		'<li>' + htmlAdvantage + ' ' + htmlRightArrow + ' reduced travel time or +' + htmlBoostDie + ' next Piloting check</li>' +
		'<li>' + htmlAdvantage + htmlAdvantage + ' ' + htmlRightArrow + ' hidden 1 round (stacking) from detection attempts</li>' +
		'<li>' + htmlTriumph + '/' + htmlAdvantage + htmlAdvantage + ' ' + htmlRightArrow + ' minimum calculation time or travel time</li>' +
		'<li>' + htmlTriumph + '/' + htmlAdvantage + htmlAdvantage + htmlAdvantage + ' ' + htmlRightArrow + ' discovered a new Hyperroute</li>' +
		'<li>' + htmlFailure + ' ' + htmlRightArrow + ' real-space debris near miss during flight: +1 System Strain</li>' +
		'<li>' + htmlThreat + ' ' + htmlRightArrow + ' +' + htmlSetbackDie + ' on next Piloting check</li>' +
		'<li>' + htmlThreat + ' ' + htmlRightArrow + ' navicomputer or astromech damaged 1 step (minor +' + htmlSetbackDie + ' ' + htmlRightArrow + ' major ' + htmlUpgradeDiff1x + ' ' + htmlRightArrow + ' unusable)';
		'<li>' + htmlThreat + ' ' + htmlRightArrow + ' real-space debris collision on arrival: +1 Hull Trauma</li>' +
		'<li>' + htmlThreat + ' ' + htmlRightArrow + ' +10 on a Vehicle Critical Hit this flight</li>' +
		'<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' Imperial presence (capital ship/base) nearby</li>' +
		'<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' Imperial Customs inspection</li>' +
		'<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' Astrogation computer damaged</li>' +
		'<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' real-space debris collision: +1 Vehicle Critical Hit</li>' +
		'</ul>';

	$('#astrogationPopup').html(astrogationPopupHtml);
}

function getDicePool(difficulty)
{
	html = "";
	const difficultyToChallengeDice = 10;
	const difficultyToDifficultyDice = 2;

	if (difficulty < difficultyToDifficultyDice) return "(-)"; // Simple, no purple dice

	while (difficulty >= difficultyToChallengeDice)
	{
		html += htmlChallengeDie;
		difficulty -= difficultyToChallengeDice;
	}
	while (difficulty >= difficultyToDifficultyDice) {
		html += htmlDifficultyDie;
		difficulty -= difficultyToDifficultyDice;
	}

	return html;
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

// Converts a number to an integer within the given bounds
function sanitize(val, lowerBound, upperBound)
{
	const saneVal = (Number.isInteger(Math.round(val)) ? Math.round(val) : 0);
	const retVal = Math.min(upperBound, Math.max(saneVal, lowerBound));
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
	switch(sanitize(val, -5, 5)) // Empire Bureacracy minus Old Westiness
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
	switch(sanitize(val, -5, 5)) // Old Westiness
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

// More hyperspace connections means lower Rarity and faster Astrogation and ...
// Returns a real number between 0 and 1, with lower values denoting more hyperspace connections.
function getHyperspaceFactor()
{
	totalFactor = 1;
	if (currentLoc)
	{
		// EotE pg150 World on primary trade lane
		// Appromimate by counting the planets in the hyperlanes which include this location.
		// More planets on the route, more important hyperroute, lower rarity,
		hyperspaceRoutes.forEach(hyperspaceRoute => {
			// Only show the secret ones if you have the right equipment
			if (hyperspaceRoute.Name in ["Biox Detour"])
			{
				if (! $("#pirateHolonet").is(":checked")) return;
			}

			const planets = hyperspaceRoute.Route.split(",");
			if (planets.indexOf(currentLoc.Name) != -1)
			{
				if (currentRouteList && currentRouteList.length > 0) currentRouteList += "<br/>";
				const factor = (1.0 - (hyperspaceRoute.Route.split(",").length * 0.01)); // largest length 44, smallest 0
				totalFactor *= factor;
				currentRouteList += toGalactipediaALink(hyperspaceRoute.Name) + " (factor " + factor + ")";
			}
		});
	}

	return totalFactor;
}

function rarityModFor(json)
{
	localRarity = json.Rarity + 0;
	if (json.Region)
	{
		localRarity += regions.find(item => item.Name === json.Region).Rarity;
	}

	// adjust for specific location
	localRarity += currentLoc.Rarity;

	// EotE pg150 Primary Core worlds; https://www.reddit.com/r/swrpg/comments/l9hau2/what_are_the_primary_worlds_of_the_star_wars/
	if (["Coruscant", "Duro", "Corellia", "Alderaan", "Hosnian Prime", "Kuat", "Nar Shaddaa", "Scipio", "Denon", "Eufornis Major", "Taris", "Chandrilla"].includes(json.Name))
	{
		localRarity -= 1;
	}

	localRarity -= (1 - getHyperspaceFactor()); // lower factor == better; getHyperspaceFactor = 0.1715 Coruscant

	return sanitize(localRarity.toFixed(0), -4, 4);
}

// Converts a number to display value: "Rarity X(R)" or ""
function rarityText(val)
{
	retVal = "";
	saneRarity = sanitize(val, -4, 4);
	if (saneRarity > 0)
	{
		retVal += "Rarity " + saneRarity;
		if (val > 6) // house rule, Rarity > 6 indicates very very rare, thus Restricted
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
	permitRarity = sanitize(rarityMod, -5, 5);
	switch(sanitize(val, -5, 5))
	{
		case -5:
		case -4:
			return '<span class="law-felony">Felony</span> (Permit ' + rarityText(permitRarity + 2) + (cost * 5).toFixed(0) + 'cr)'; break;
		case -3:
			return '<span class="law-misdemeanor">Misdemeanor</span> (Permit ' + rarityText(permitRarity + 1) + cost + 'cr)'; break;
		case -2:
			return '<span class="law-infraction">Infraction</span> (Permit ' + rarityText(permitRarity) + cost + 'cr)'; break;
		case -1:
			return '<span class="law-frowned-upon">frowned on</span> (Permit ' + rarityText(permitRarity) + cost + 'cr)'; break;
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
	switch(sanitize(val, -5, 5))
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
	switch(sanitize(val, 0, 5))
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
	$("#local-events").append(currentLoc.events);
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
		$('#baseHyperSpaceDistance').text(distance.toFixed(2) + " parsecs")

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

function rarityCostIncrease(costRarity)
{
	switch(sanitize(costRarity, -4, 4))
	{
		case -4:
			return '<span style="color:green">50% for certain items</span>';
		case -3:
			return '<span style="color:green">75% for certain items</span>';
		case -2:
			return '<span style="color:green">90% for certain items</span>';
		case -1:
			return '<span style="color:green">95% for certain items</span>';
		case 0:
		case 1:
			return "standard";
		case 2:
			return '<span style="color:red">200%</span>';
		case 3:
			return '<span style="color:red">300%</span>';
		case 4:
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
		if (pirateHolonetInstalled) htmlResponse += "[major hull trauma surcharge] ";
	}
	else if (hullCurrent > (hullMax * 0.25))
	{
		multiplier *= 1.5;
		if (pirateHolonetInstalled) htmlResponse += "[minor hull trauma surcharge] ";
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

	htmlResponse += (basePrice * multiplier) + "cr ";

	switch(starportRating)
	{
		case 0: // no facilities
			return "(no starport exists) +(" + htmlSetbackDie + htmlSetbackDie + ")";
			break;
		case 1: // Landing Field, grade 5
			if (shipSilhouette > 4) return "(Grade 4 starport required)";
			multiplier *= 0.50;
			htmlResponse += " (" + htmlAbilityDie + " +" + htmlSetbackDie + ")";
			break;
		case 2: // Limited Services, grade 4
			if (shipSilhouette > 5) return "(Grade 3 starport required)";
			multiplier *= 0.75;
			htmlResponse += " (" + htmlProficiencyDie + htmlAbilityDie + " +" + htmlBoostDie + ")";
			break;
		case 3: // Standard Class, grade 3
			if (shipSilhouette > 6) return "(Grade 2 starport required)";
			// multiplier *= 1.0;
			htmlResponse += " (" + htmlProficiencyDie + htmlProficiencyDie + htmlAbilityDie + " +" + htmlSuccess + ")";
			break;
		case 4: // Stellar Class, grade 2
			if (shipSilhouette > 8) return "(Grade 1 starport required)";
			multiplier *= 2.0;
			htmlResponse += " (" + htmlProficiencyDie + htmlProficiencyDie + htmlProficiencyDie + htmlAbilityDie + " +" + htmlSuccess + htmlSuccess + ")";
			break;
		case 5: // Imperial Class, grade 1
			multiplier *= 3.0;
			htmlResponse += " (" + htmlProficiencyDie + htmlProficiencyDie + htmlProficiencyDie + htmlProficiencyDie + htmlAbilityDie + " +" + htmlSuccess + htmlSuccess + htmlSuccess + ")";
			break;
	}

	htmlResponse += '</span>';

	return htmlResponse;
}

// EotE Table 5-1 pg150
function getTextLocalRarity()
{
	htmlResponse = '';

	htmlResponse += '<h2 align="center">Negotiation</h2>';
	htmlResponse += '<h3 align="left">Base Difficulty:</h3>';
	htmlResponse += 'Rarity 0-1: Simple (-)<br/>';
	htmlResponse += 'Rarity 2-3: Easy (' + htmlDifficultyDie + ')<br/>';
	htmlResponse += 'Rarity 4-5: Average (' + htmlDifficultyDie + htmlDifficultyDie + ')<br/>';
	htmlResponse += 'Rarity 6-7: Hard (' + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + ')<br/>';
	htmlResponse += 'Rarity 8-9: Daunting (' + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + ')<br/>';
	htmlResponse += 'Rarity 10: Formidable (' + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + htmlDifficultyDie + ')<br/>';
	htmlResponse += '(R)estricted: ' + htmlUpgradeDiff1x + '<br/>';
	htmlResponse += '<br/>';

	htmlResponse += '<h3 align="left">Dice Results:</h3>';
	htmlResponse += '<ul>';
	htmlResponse += '<li>' + htmlSuccess + ' ' + htmlRightArrow + ' 1 of that specific item available to purchase</li>';
	htmlResponse += '<li>' + htmlAdvantage + ' ' + htmlRightArrow + ' boost for the next vendor (which might be on a completely different planet)';
	htmlResponse += '<li>' + htmlAdvantage + ' ' + htmlRightArrow + ' 1% discount (stacking) on price</li>';
	htmlResponse += '<li>' + htmlTriumph + '/' + htmlAdvantage + htmlAdvantage + ' ' + htmlRightArrow + ' 1 item for sale already has a random mod installed, lower Encumbrance, or a situation-specific boost die</li>';
	htmlResponse += '<li>' + htmlTriumph + '/' + htmlAdvantage + htmlAdvantage + htmlAdvantage + ' ' + htmlRightArrow + ' the shopkeeper likes you and gives you a discount</li>';
	htmlResponse += '<li>' + htmlFailure + ' ' + htmlRightArrow + ' the item is not in local stock</li>';
	htmlResponse += '<li>' + htmlThreat + ' ' + htmlRightArrow + ' setback for the next vendor (if the item is not available locally)';
	htmlResponse += '<li>' + htmlThreat + ' ' + htmlRightArrow + ' item for sale is damaged 1 step (minor +' + htmlSetbackDie + ' ' + htmlRightArrow + ' major ' + htmlUpgradeDiff1x + ' ' + htmlRightArrow + ' unusable)';
	htmlResponse += '<li>' + htmlThreat + ' ' + htmlRightArrow + ' cost is increased 1% (stacking) due to local demand</li>';
	htmlResponse += '<li>' + htmlDespair + '/' + htmlThreat + ' ' + htmlRightArrow + ' the item is available but on a different planet';
	htmlResponse += '<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' <i>"do me a favor first"</i></li>';
	htmlResponse += '<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' you\'ve angered the shopkeeper';
	htmlResponse += '<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' local law enforcement shows up';
	htmlResponse += '<li>' + htmlDespair + '/' + htmlThreat + htmlThreat + htmlThreat + ' ' + htmlRightArrow + ' another buyer starts a bidding war';
	htmlResponse += '</ul>';

	return htmlResponse;
}