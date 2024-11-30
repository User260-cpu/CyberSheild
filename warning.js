document.getElementById("go-back").addEventListener("click", () => {
  history.back();
});

document.getElementById("proceed").addEventListener("click", () => {
  alert("Proceeding to the flagged site. Be cautious!");
});
