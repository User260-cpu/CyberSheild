const params = new URLSearchParams(window.location.search);
const unsafeUrl = params.get("url");

const proceedLink = document.getElementById("proceed");
proceedLink.href = unsafeUrl;

function goBack() {
  history.back();
}
