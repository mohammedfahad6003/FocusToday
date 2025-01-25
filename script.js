const allCheckBoxList = document.querySelectorAll(".customCheckBox");
const allInputList = document.querySelectorAll(".goalInput");
const errorLabel = document.querySelector(".errorContainer");
const progressValue = document.querySelector(".progressValue");
const descriptionUpdate = document.querySelector(".descriptionText");

const storedGoals = JSON.parse(localStorage.getItem("All_Task_Items")) || [];

// Initial Input Value Update
allInputList.forEach((input, index) => {
  const storedGoal = storedGoals.find((goal) => goal.id === index + 1);
  if (storedGoal && storedGoal.value) {
    input.value = storedGoal.value;
  }
});

// Initial Check Box Update
allCheckBoxList.forEach((checkBox, index) => {
  checkBox.id = index + 1;

  const storedGoal = storedGoals.find(
    (goal) => goal.id === Number(checkBox.id)
  );
  if (storedGoal && storedGoal.isChecked) {
    checkBox.parentElement.classList.toggle("completed");
  }
});

const updateProgressBar = (goals) => {
  const updateTheProgressBar = goals?.filter((item) => item.isChecked)?.length;

  const widthValue = (updateTheProgressBar / goals?.length) * 100;
  progressValue.style.width = `${widthValue}%`;
  progressValue.firstElementChild.innerText = `${updateTheProgressBar}/${goals?.length} Completed`;
  progressValue.lastElementChild.innerText = `${widthValue}%`;
  progressValue.firstElementChild.style.paddingLeft = "20px";
  progressValue.lastElementChild.style.paddingRight = "20px";
  if (widthValue > 0) {
    descriptionUpdate.style.color = "#48a300";
  } else {
    descriptionUpdate.style.color = "#858585";
  }
  if (widthValue == 100) {
    descriptionUpdate.innerText = `You've smashed all your Goals, Time to Unwind!`;
  } else if (widthValue >= 75) {
    descriptionUpdate.innerText = `Just a Step Away, Keep It Going!`;
  } else if (widthValue >= 50) {
    descriptionUpdate.innerText =
      "Well Begun, Halfway Through—Let's Complete the Goals!";
  } else if (widthValue >= 25) {
    descriptionUpdate.innerText = `Let's Begin, You can do it!`;
  } else {
    descriptionUpdate.innerText = "Raise the bar by completing your Goals!";
  }
};

const updateCheckBox = (checkBox) => {
  const allGoalsData = JSON.parse(localStorage.getItem("All_Task_Items")) || [];

  const updateCheckValue = allGoalsData?.map((item) => {
    if (item.id === Number(checkBox.id)) {
      return { ...item, isChecked: !item.isChecked };
    }
    return item;
  });

  updateProgressBar(updateCheckValue);
  checkBox.parentElement.classList.toggle("completed");

  localStorage.setItem("All_Task_Items", JSON.stringify(updateCheckValue));
};

// Function to update the error label
const updateUI = () => {
  const allGoalsAdded = Array.from(allInputList).every((input) =>
    input.value.trim()
  );

  const remainingGoals = Array.from(allInputList).filter(
    (input) => !input.value.trim()
  ).length;

  // Set the error label message
  if (allGoalsAdded) {
    errorLabel.classList.remove("errorLabel");
    errorLabel.innerText = "";
  } else if (remainingGoals === allInputList?.length) {
    errorLabel.classList.remove("errorLabel");
    errorLabel.innerText = "";
  } else {
    errorLabel.classList.add("errorLabel");
    errorLabel.innerText = `Please set all the ${storedGoals?.length} goals! ${remainingGoals} remaining.`;
    progressValue.style.width = "0%";
    progressValue.firstElementChild.innerText = "";
    progressValue.lastElementChild.innerText = "";
    progressValue.firstElementChild.style.paddingLeft = "0";
    progressValue.lastElementChild.style.paddingRight = "0";

    // To Remove all Goals if any of the Input Text is Fully Changed
    allCheckBoxList?.forEach((checkBox) => {
      checkBox.parentElement.classList.remove("completed");
    });

    //Update localStorage with isChecked value to false
    const allGoalsData =
      JSON.parse(localStorage.getItem("All_Task_Items")) || [];
    const updateCheckValue = allGoalsData?.map((item) => {
      return { ...item, isChecked: false };
    });

    const updateTheProgressBar = allGoalsData?.filter(
      (item) => item.isChecked
    )?.length;

    const widthValue = (updateTheProgressBar / allGoalsData?.length) * 100;

    if (widthValue == 100) {
      descriptionUpdate.innerText = `You've smashed all your Goals, Time to Unwind!`;
    } else if (widthValue >= 75) {
      descriptionUpdate.innerText = `Just a Step Away, Keep It Going!`;
    } else if (widthValue >= 50) {
      descriptionUpdate.innerText =
        "Well Begun, Halfway Through—Let's Complete the Goals!";
    } else if (widthValue >= 25) {
      descriptionUpdate.innerText = `Let's Begin, You can do it!`;
    } else {
      descriptionUpdate.innerText = "Raise the bar by completing your Goals!";
    }
    localStorage.setItem("All_Task_Items", JSON.stringify(updateCheckValue));
  }
};

// Event listener for input changes
allInputList.forEach((input) => {
  input.addEventListener("input", () => {
    const updatedGoals = Array.from(allInputList).map((input, index) => ({
      id: index + 1,
      value: input.value.trim(),
      isChecked: false,
    }));

    // Store updated goals in localStorage
    localStorage.setItem("All_Task_Items", JSON.stringify(updatedGoals));

    // Update the UI (error label)
    updateUI();
  });
});

// Event listener for checkbox click (goal completion)
allCheckBoxList.forEach((checkBox) => {
  checkBox.addEventListener("click", () => {
    const allGoalsAdded = Array.from(allInputList).every((input) =>
      input.value.trim()
    );

    if (allGoalsAdded) {
      updateCheckBox(checkBox);
    }
  });
});

// Initial UI update when the page loads
updateUI();
updateProgressBar(storedGoals);
