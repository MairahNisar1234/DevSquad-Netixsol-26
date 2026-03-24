// 1. Fixed the variable names to match your display logic below
const outputDays = document.getElementById("output-days");
const outputMonths = document.getElementById("output-month"); // Changed to plural to match logic
const outputYears = document.getElementById("output-year");  // Changed to plural to match logic
const submitBtn = document.getElementById("submit");
const errorBox= document.getElementById("error-day")

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const day = parseInt(document.getElementById("day").value);
    const month = parseInt(document.getElementById("month").value) - 1;
    const year = parseInt(document.getElementById("year").value);

    const dayNum= document.getElementById("day").value;
    const monNum= document.getElementById("month").value;
    const yearNum= document.getElementById("year").value;

    const today = new Date();
    const birthDate = new Date(year, month, day);
    
    // 3. Calculation logic
    let diffYears = today.getFullYear() - birthDate.getFullYear();
    let diffMonths = today.getMonth() - birthDate.getMonth();
    let diffDays = today.getDate() - birthDate.getDate();   
    if (diffDays < 0) {
        diffMonths--;
        diffDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (diffMonths < 0) {
        diffYears--;
        diffMonths += 12;
    }
    if (birthDate > today){
        alert("Please enter a valid date of birth.");
        return;
    }
    if (dayNum == "" || monNum == "" || yearNum == "") {
        alert("Field cannot be empty. Please enter a valid date of birth.");
        return;
        
    }
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month || birthDate.getDate() !== day) {
        alert("Please enter a valid date of birth.");
        return;
    }
   
    outputYears.textContent = diffYears;
    outputMonths.textContent = diffMonths;
    outputDays.textContent = diffDays;
});