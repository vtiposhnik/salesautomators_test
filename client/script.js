document.getElementById("modal-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const input1 = document.getElementById("input1").value;
    const input2 = document.getElementById("input2").value;

    console.log("form submit:", { input1, input2 });
});


let x = 0.1
let y = 0.2

if (x + y != 0.3) {
    console.log("object");
}