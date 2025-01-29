const allCheckBoxList = document.querySelectorAll(".customCheckBox");
const allInputList = document.querySelectorAll(".goalInput");
const errorLabel = document.querySelector(".errorContainer");
const progressValue = document.querySelector(".progressValue");
const descriptionUpdate = document.querySelector(".descriptionText");

const storedGoals = JSON.parse(localStorage.getItem("All_Task_Items")) || [];

// Initial Input Value Update
allInputList.forEach((input, index) => {
  const storedGoal = storedGoals.find((goal) => goal.id === index + 1);
  if (storedGoal) {
    input.value = storedGoal.value || "";
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
  const initialMessageConditionCheck =
  goals?.length > 0 &&
    goals.every((item) => !item.isChecked && item.value.trim() !== "");

  if (initialMessageConditionCheck) {
    errorLabel.classList.add("approveLabel");
    errorLabel.classList.remove("errorLabel");
    errorLabel.innerText =
      "Mark the checkbox after completing your goals to track your progress.";
  } else {
    errorLabel.classList.remove("approveLabel");
    errorLabel.classList.remove("errorLabel");
    errorLabel.innerText = "";
  }

  const completedGoals = goals?.filter((item) => item.isChecked).length;
  const totalGoals = goals?.length;

  const widthValue = (completedGoals / totalGoals) * 100;
  progressValue.style.width = `${widthValue}%`;
  progressValue.firstElementChild.innerText = `${completedGoals}/${totalGoals} Completed`;
  progressValue.lastElementChild.innerText = `${widthValue}%`;

  progressValue.firstElementChild.style.paddingLeft = "20px";
  progressValue.lastElementChild.style.paddingRight = "20px";

  descriptionUpdate.style.color = widthValue > 0 ? "#48a300" : "#858585";

  if (widthValue === 100) {
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

  const updatedGoals = allGoalsData?.map((item) =>
    item.id === Number(checkBox.id)
      ? { ...item, isChecked: !item.isChecked }
      : item
  );

  updateProgressBar(updatedGoals);
  checkBox.parentElement.classList.toggle("completed");
  localStorage.setItem("All_Task_Items", JSON.stringify(updatedGoals));
};

const updateUI = (dataGoals) => {
  const allGoalsAdded = dataGoals.every((input) => input.value.trim() !== "");
  const remainingGoals = dataGoals.filter(
    (input) => input.value.trim() === ""
  ).length;

  const totalGoals = dataGoals.length;

  // Fix: Ensure the message appears only when all goals have values but are unchecked
  const initialMessageConditionCheck =
    dataGoals?.length > 0 &&
    dataGoals.every((item) => !item.isChecked && item.value.trim() !== "");

  if (initialMessageConditionCheck) {
    errorLabel.classList.add("approveLabel");
    errorLabel.classList.remove("errorLabel");
    errorLabel.innerText =
      "Mark the checkbox after completing your goals to track your progress.";
  }

  localStorage.setItem("All_Task_Items", JSON.stringify(dataGoals));

  if (!initialMessageConditionCheck) {
    if (allGoalsAdded) {
      errorLabel.classList.remove("errorLabel");
      errorLabel.innerText = "";
    } else if (remainingGoals === totalGoals) {
      errorLabel.classList.remove("errorLabel");
      errorLabel.innerText = "";
    } else {
      errorLabel.classList.add("errorLabel");
      errorLabel.innerText = `Please set all the ${totalGoals} goals! ${remainingGoals} remaining.`;
      progressValue.style.width = "0%";
      progressValue.firstElementChild.innerText = "";
      progressValue.lastElementChild.innerText = "";
      progressValue.firstElementChild.style.paddingLeft = "0";
      progressValue.lastElementChild.style.paddingRight = "0";

      allCheckBoxList.forEach((checkBox) => {
        if (remainingGoals > 0) {
          checkBox.parentElement.classList.remove("completed");
        }
      });

      descriptionUpdate.style.color = '#858585';
      descriptionUpdate.innerText = "Raise the bar by completing your Goals!";

      const updatedNewGoalsForEmpty = dataGoals?.map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      });
      localStorage.setItem(
        "All_Task_Items",
        JSON.stringify(updatedNewGoalsForEmpty)
      );
    }
  }
};

// Event listener for input changes
allInputList.forEach((input) => {
  input.addEventListener("input", () => {
    const allGoals = JSON.parse(localStorage.getItem("All_Task_Items"));
    const updatedGoals = Array.from(allInputList).map((input, index) => ({
      id: index + 1,
      value: input.value.trim(),
      isChecked:
        allGoals.find((goal) => goal.id === index + 1)?.isChecked || false,
    }));

    updateUI(updatedGoals);
  });
});

// Event listener for checkbox click (goal completion)
allCheckBoxList.forEach((checkBox) => {
  checkBox.addEventListener("click", () => {
    const allGoalsAdded = Array.from(allInputList).every(
      (input) => input.value.trim() !== ""
    );

    if (allGoalsAdded) {
      updateCheckBox(checkBox);
    }
  });
});

// Ensure UI updates after state updates
setTimeout(() => {
  updateUI(storedGoals);
  updateProgressBar(storedGoals);
}, 100);
