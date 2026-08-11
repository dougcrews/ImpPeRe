const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
console.log(searchParams);
console.log("planet: " + searchParams.get("planet"));
