const billAmount = document.getElementById("bill");
const fivepercent = document.getElementById("five");
const tenpercent = document.getElementById("ten");
const fifteenpercent = document.getElementById("fifteen");
const twentyfivepercent = document.getElementById("twenty-five");
const fiftypercent = document.getElementById("fifty");
const people = document.getElementById("people");
const custom = document.getElementById("custom");
const tiptotal = document.getElementById("tip-amount");
const totalDisplay = document.getElementById("total-amount"); 
const reset= document.getElementById("reset");

let tip = 0;

reset.addEventListener("click", function(){
    billAmount.value="";
    people.value="";
    tiptotal.textContent = "$0.00";
    totalDisplay.textContent = "$0.00";


})
fivepercent.addEventListener("click", function(){
    tip = 5; 
    calculateTip();
});
tenpercent.addEventListener("click", function(){
    tip = 10;
    calculateTip();
});
fifteenpercent.addEventListener("click", function(){
    tip = 15;
    calculateTip();
});
twentyfivepercent.addEventListener("click", function(){
    tip = 25;
    calculateTip();
});
fiftypercent.addEventListener("click", function(){
    tip = 50;
    calculateTip();
});


custom.addEventListener("input", function(){
    tip = parseFloat(custom.value) || 0; 
    calculateTip();
});

billAmount.addEventListener("input", calculateTip);
people.addEventListener("input", calculateTip);

function calculateTip(){
    let bill = parseFloat(billAmount.value);
    let persons = parseFloat(people.value);

    if (!bill || !persons || persons === 0 || bill<0 || persons <0 ){
        tiptotal.textContent="Enter Valid values";
        totalDisplay.textContent="Enter Valid Values"
    }

    let tipAmount = (bill * tip) / 100;
    let tipPerPerson = tipAmount / persons;
    let billPerPerson = (bill / persons) + tipPerPerson;

    tiptotal.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalDisplay.textContent = `$${billPerPerson.toFixed(2)}`;
}