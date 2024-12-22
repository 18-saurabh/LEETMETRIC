document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  // return true or false based on a regular expression
  function validateUserName(username) {
    if (username.trim() === "") {
      alert("Enter UserName");
      return false;
    }
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      statsContainer.hidden = true;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const parsedData = await response.json();
      console.log("Logging Data:", parsedData);
      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.messsage}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      // statsContainer.style.setProperty("display", flex);
      statsContainer.hidden = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }
  function displayUserData(parsedData) {
    const totalQuestions = parsedData.totalQuestions;
    const totalEasyQuestions = parsedData.totalEasy;
    const totalMediumQuestions = parsedData.totalMedium;
    const totalHardQuestions = parsedData.totalHard;

    const solvedTotal = parsedData.totalSolved;
    const easySolved = parsedData.easySolved;
    const mediumSolved = parsedData.mediumSolved;
    const hardSolved = parsedData.hardSolved;

    updateProgress(
      easySolved,
      totalEasyQuestions,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      mediumSolved,
      totalMediumQuestions,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      hardSolved,
      totalHardQuestions,
      hardLabel,
      hardProgressCircle
    );

    const cardsData = [
      { label: "Total Questions", value: parsedData.totalQuestions },
      { label: "Total Solved", value: parsedData.totalSolved },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        (data) =>
          `<div class="card">
            <h3>${data.label}</h3>
            <p>${data.value}</p>
            </div> `
      )
      .join("");
  }
  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("Logging username", username);
    if (validateUserName(username)) {
      fetchUserDetails(username);
    }
  });
});
