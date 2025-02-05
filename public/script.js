document.addEventListener("DOMContentLoaded", async () => {
  // Detecting user status with an API
  try {
    let response = await fetch("https://ipapi.co/json/");
    let data = await response.json();
    // Extract the name of the state
    let state = data.region; 
    if (state) {
      document.getElementById(
        "dynamic-header"
      ).innerText = `HOW MUCH WILL YOU GET IN ${state.toUpperCase()}?`;
    }
  } catch (error) {
    console.error("Error fetching location:", error);
  }

  // Handling the multi-step form
  const steps = document.querySelectorAll(".form-step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const prevButtons = document.querySelectorAll(".prev-btn");
  let currentStep = 0;

  function showStep(step) {
    steps.forEach((formStep, index) => {
      formStep.classList.toggle("active", index === step);
    });
  }

  nextButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const step = steps[currentStep];
      const inputs = step.querySelectorAll("input[type='radio']");
      let selected = Array.from(inputs).some((input) => input.checked);

      let errorMessage = step.querySelector(".error-message");
      if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.style.color = "red";
        errorMessage.style.marginTop = "25px";
        step.appendChild(errorMessage);
      }

      if (!selected) {
        errorMessage.textContent = "Please select an option before proceeding.";
        return;
      } else {
        errorMessage.textContent = "";
      }

      currentStep++;
      showStep(currentStep);
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentStep--;
      showStep(currentStep);
    });
  });

  showStep(currentStep); // Shows the first step

  // Handling form submission
  const form = document.getElementById("injury-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Capture the value of the TrustedForm certificate
    let trustedFormURL =
      document.querySelector("input[name='xxTrustedFormCertUrl']")?.value ||
      "Not Available";

    // Display certificate link in UI
    const trustedFormLink = document.getElementById("trusted-form-link");
    trustedFormLink.href = trustedFormURL;
    trustedFormLink.innerText = trustedFormURL;

    console.log("Trusted Form Certificate:", trustedFormURL);

    // Success message simulation
    const successMessage = document.createElement("p");
    successMessage.textContent = "Form submitted successfully!";
    successMessage.style.color = "green";
    successMessage.style.marginTop = "10px";
    form.appendChild(successMessage);
  });
});
