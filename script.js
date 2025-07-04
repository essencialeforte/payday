const dayContainer = document.getElementById("days-container");
const dayTemplate = document.getElementById("day-template");
const totalOutput = document.getElementById("total");

const addOneBtn = document.getElementById("add-one");
const addMultipleBtn = document.getElementById("add-multiple");
const resetBtn = document.getElementById("reset");

const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("close-modal");
const confirmAddBtn = document.getElementById("confirm-add");
const daysToAddInput = document.getElementById("days-to-add");

const MAX_DAYS = 31;

let typingTimer;

window.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(localStorage.getItem("salaryData")) || [];
    
    if (saved.length === 0) {
        addDay();
    } else {
        saved.forEach((item) => {
            addDay(item.revenue, item.percent);
        });
    }

    updateTotal();
});

function addDay (revenue = "", percent = 5) {
    if (dayContainer.children.length >= MAX_DAYS) {
        alert(`Нельзя добавить больше ${MAX_DAYS} дней.`);
        return;
    }

    const clone = dayTemplate.content.cloneNode(true);
    const revenueInput = clone.querySelector(".revenue");
    const percentSelect = clone.querySelector(".percent");
    const deleteBtn = clone.querySelector(".delete-day");

    revenueInput.value = revenue;
    percentSelect.value = percent;

    revenueInput.addEventListener("input", () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(updateTotal, 300);
    });
    percentSelect.addEventListener("change", updateTotal);
    deleteBtn.addEventListener("click", (e) => {
        e.target.closest(".day").remove();
        updateTotal();
    });

    dayContainer.appendChild(clone);
    updateTotal();
}

function updateTotal() {
    let total = 0;
    const allDays = document.querySelectorAll(".day");

    const dataToSave = [];

    allDays.forEach((dayEl, index) => {
        const revenueInput = dayEl.querySelector(".revenue");
        const revenueRaw = revenueInput.value.trim();
        let revenue = parseFloat(revenueRaw);

        if (revenueRaw !== "" && isNaN(revenue)) {
            revenueInput.classList.add("invalid");
            return;
        } else {
            revenueInput.classList.remove("invalid");
            if (revenueRaw === "" || isNaN(revenue)) revenue = 0;
        }
        const percent = parseInt(dayEl.querySelector(".percent").value);
        const daily = 1500 + (revenue * percent) / 100;
        /*dayEl.querySelector(".day-result").textContent = `Итого за день: ${Math.round(daily)} ₽`*/
        dayEl.querySelector(".day-sum").textContent = `${Math.round(daily)} ₽`;
        total += daily;

        dataToSave.push({ revenue, percent });

        dayEl.querySelector(".day-number").textContent = `День ${index + 1}`;

        const deleteBtn = dayEl.querySelector(".delete-day");
        deleteBtn.disabled = allDays.length === 1;
    });

    totalOutput.textContent = `${Math.round(total)} ₽`;
    localStorage.setItem("salaryData", JSON.stringify(dataToSave));
}

addOneBtn.addEventListener("click", () => {
    addDay();
});

addMultipleBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    daysToAddInput.value = "";
    daysToAddInput.focus();
});

confirmAddBtn.addEventListener("click", () => {
    const count = parseInt(daysToAddInput.value);
    const current = dayContainer.children.length;

    if (isNaN(count) || count <= 0) {
        alert("Введите число дней.");
        return;
    }
    if (current + count > MAX_DAYS) {
        alert(`Можно добавить максимум ${MAX_DAYS - current} дней`);
        return;
    }

    for (let i = 0; i < count; i++) {
        addDay();
    }
    modal.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

resetBtn.addEventListener("click", () => {
    if (confirm("Удалить все данные?")) {
        localStorage.removeItem("salaryData");
        dayContainer.innerHTML = "";
        addDay();
    }
});

const toggleThemeBtn = document.getElementById("toggle-theme");
function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
    toggleThemeBtn.textContent = mode === "dark" ? "☀️" : "🌙";
}
toggleThemeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    setTheme(newTheme);
});

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    //document.body.classList.add(savedTheme);
});
