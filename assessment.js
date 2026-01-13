document.getElementById("assessmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // --- Collect user data ---
  const data = {
    name: document.getElementById("userName").value,
    age: document.getElementById("userAge").value,
    sex: document.getElementById("userSex").value,
    height: document.getElementById("userHeight").value,
    weight: document.getElementById("userWeight").value,
    occupation: document.getElementById("occupationType").value,
    water: document.getElementById("waterIntake").value,
    processed: document.getElementById("processedFood").value,
    activity: document.getElementById("activityLevel").value,
    sedentary: document.getElementById("sedentaryTime").value,
    sleepDuration: document.getElementById("sleepDuration").value,
    sleepQuality: document.getElementById("sleepQuality").value,
    stress: document.getElementById("stressLevel").value
  };

  // --- Domain logic ---
  const getNutritionState = d => {
    if (d.water === "Adequate" && d.processed === "Low") return "strong";
    if (d.water === "Low" && d.processed === "High") return "weak";
    return "mixed";
  };
  const getActivityState = d => d.activity === "High" ? "strong" : d.activity === "Low" ? "weak" : "moderate";
  const getRecoveryState = d => d.sleepQuality === "Good" && d.sleepDuration === "Optimal" ? "strong" : d.sleepQuality === "Poor" || d.sleepDuration === "Short" ? "weak" : "mixed";
  const getStressState = d => d.stress === "High" ? "high" : "manageable";

  const nutritionState = getNutritionState(data);
  const activityState = getActivityState(data);
  const recoveryState = getRecoveryState(data);
  const stressState = getStressState(data);

  // --- Persona ---
  let weakCount = [nutritionState, activityState, recoveryState].filter(s => s === "weak").length;
  let persona = weakCount >= 2 ? "reset"
              : activityState === "strong" && stressState === "high" ? "overextended"
              : activityState === "weak" && nutritionState !== "weak" ? "sedentary"
              : "optimized";

  const personaMeta = {
    reset: { title: "Rebuilding the Basics", tagline: "Several core systems need support — and that’s okay.", image: "images/personas/persona1.jpg" },
    overextended: { title: "Driven, But Overloaded", tagline: "You’re doing a lot — recovery and balance need protection.", image: "images/personas/persona2.jpg" },
    sedentary: { title: "Healthy Intentions, Limited Movement", tagline: "Your awareness is strong — your body needs more engagement.", image: "images/personas/persona3.jpg" },
    optimized: { title: "Strong Foundation, Ready to Refine", tagline: "You’re doing many things right — now it’s about precision.", image: "images/personas/persona4.jpg" }
  };

  // --- AI perspectives ---
  const nutritionAI = {
    strong: { summary: "Your dietary patterns appear structured and supportive.", recommendation: "Maintain consistency while supporting other systems.", outlook: "A stable nutritional base supports long-term resilience." },
    mixed: { summary: "Nutrition intent is present, but inconsistency may be limiting impact.", recommendation: "Stabilize one habit before expanding.", outlook: "Consistency unlocks faster gains." },
    weak: { summary: "Nutrition fundamentals appear to be a limiting factor.", recommendation: "Focus on hydration and meal regularity first.", outlook: "Strengthening basics unlocks progress everywhere." }
  };
  const activityAI = {
    strong: { summary: "Your activity supports metabolic health.", recommendation: "Balance effort with recovery.", outlook: "Sustainable movement preserves performance." },
    moderate: { summary: "Activity is present but not yet consistent.", recommendation: "Increase frequency before intensity.", outlook: "Momentum builds capacity." },
    weak: { summary: "Low activity may limit stress regulation and energy.", recommendation: "Introduce low-pressure daily movement.", outlook: "Small changes produce noticeable improvements." }
  };
  const stressRecoveryAI = (stress, recovery) => {
    if (stress === "high" && recovery === "weak") return { summary: "High stress combined with low recovery strains the system.", recommendation: "Reduce stress and stabilize sleep first.", outlook: "Lower strain restores capacity." };
    if (stress === "high") return { summary: "Stress is elevated despite some recovery resilience.", recommendation: "Introduce daily decompression rituals.", outlook: "Stress control preserves balance." };
    return { summary: "Stress and recovery appear balanced.", recommendation: "Maintain routines and build buffers.", outlook: "Proactive balance prevents burnout." };
  };

  const reports = [
    { title: "Overall Health Interpretation", summary: "Your health reflects a mix of strengths and constraints.", recommendation: "Support weaker systems without neglecting strengths.", outlook: "Balanced effort compounds." },
    { title: "Nutrition Perspective", ...nutritionAI[nutritionState] },
    { title: "Movement & Activity Perspective", ...activityAI[activityState] },
    { title: "Stress & Recovery Perspective", ...stressRecoveryAI(stressState, recoveryState) },
    { title: "Integrated Health Strategy", summary: "Alignment matters more than intensity.", recommendation: "Improve multiple areas gradually.", outlook: "Consistency creates durable results." }
  ];

  // --- Render results (human style) ---
  const results = document.getElementById("results");
  results.innerHTML = "";
  results.style.display = "block";

  // Persona
  const personaDiv = document.createElement("div");
  personaDiv.classList.add("persona-card");
  personaDiv.innerHTML = `
    <img src="${personaMeta[persona].image}" alt="${personaMeta[persona].title}">
    <h2>${personaMeta[persona].title}</h2>
    <p>${personaMeta[persona].tagline}</p>
  `;
  results.appendChild(personaDiv);

  // User profile
  const profileDiv = document.createElement("div");
  profileDiv.classList.add("user-profile");
  profileDiv.innerHTML = `
    <h3>Basic Profile</h3>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Age:</strong> ${data.age}</p>
    <p><strong>Sex:</strong> ${data.sex || 'Not specified'}</p>
    <p><strong>Height:</strong> ${data.height} cm</p>
    <p><strong>Weight:</strong> ${data.weight} kg</p>
    <p><strong>Occupation:</strong> ${data.occupation}</p>
  `;
  results.appendChild(profileDiv);

  // Reports
  reports.forEach((r, i) => {
    const card = document.createElement("div");
    card.classList.add("report-card");
    card.innerHTML = `
      <h3>AI Perspective ${i+1}: ${r.title}</h3>
      <p>${r.summary}</p>
      <p><strong>Recommendation:</strong> ${r.recommendation}</p>
      <p><strong>Outlook:</strong> ${r.outlook}</p>
      <div class="rating" data-index="${i}">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
    `;
    results.appendChild(card);

    // Star rating
    const stars = card.querySelectorAll(".rating span");
    stars.forEach((star, idx) => {
      star.addEventListener("click", () => {
        stars.forEach((s, i) => s.classList.toggle("active", i <= idx));
      });
    });
  });

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.id = "downloadPDF";
  downloadBtn.classList.add("primary-btn");
  downloadBtn.textContent = "Download Report as PDF";
  results.appendChild(downloadBtn);
  downloadBtn.addEventListener("click", () => window.print());

  results.scrollIntoView({ behavior: "smooth" });
});