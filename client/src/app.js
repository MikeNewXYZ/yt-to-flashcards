const formEl = document.getElementById("form");
const resultsSectionEl = document.getElementById("results-section");
const flashcardsEl = document.getElementById("flashcards");
const flashcardTemplate = document.getElementById("flashcard");
const loadingEl = document.getElementById("loading");

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    formEl.reset();
    resultsSectionEl.style.display = "none";
    loadingEl.style.removeProperty("display");

    const response = await fetch("yt-to-flashcards-production.up.railway.app", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: data.get("url"),
        })
    });

    if (response.ok) {
        const { flashcards } = await response.json();

        loadingEl.style.display = "none";
        resultsSectionEl.style.removeProperty("display");
        flashcardsEl.innerHTML = "";

        flashcards.forEach(item => {
            const flashcardClone = flashcardTemplate.content.cloneNode(true);

            const questionEl = flashcardClone.querySelector("#question");
            const answerEl = flashcardClone.querySelector("#answer");

            questionEl.querySelector("#content").textContent = item.front;
            answerEl.querySelector("#content").textContent = item.back;

            flashcardsEl.appendChild(flashcardClone);
        });
    } else {
        const error = await response.text();
        alert(error);
    }
}

formEl.addEventListener("submit", handleSubmit);
formEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleSubmit(e);
    }
});