const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
console.log(searchParams);
console.log("loc: " + searchParams.get("loc"));
console.log("dest: " + searchParams.get("dest"));
