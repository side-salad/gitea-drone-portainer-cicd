const test = document.querySelector(".display");
const submit = document.querySelector(".btn");
const back = document.querySelector("body");

submit.addEventListener("click", () => {
    alert(test.value);
    back.style.background = "tomato";
});