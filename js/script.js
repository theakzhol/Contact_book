// json-server
const API = "http://localhost:8000/info";

// pull elements from html

let inpName = document.querySelector(".inp-name");
let inpSurname = document.querySelector(".inp-surname");
let inpPhoto = document.querySelector(".inp-photo");
let inpNumber = document.querySelector(".inp-number");
let inpEmail = document.querySelector(".inp-email");
let bntSubmit = document.querySelector(".btn-submit");
let btnReset = document.querySelector(".btn-reset");
let btnSave = document.querySelector(".btn-save");

let infoList = document.querySelector(".right-block");

let editer_id = 0;

// search
let btnSearch = document.querySelector(".btn-search");
let searchVal = "";

// ? ------------------------------------------------------ ADD -------------------------------------------
bntSubmit.addEventListener("click", async function () {
  // create obj for add to json.server
  let info = {
    name: inpName.value,
    surname: inpSurname.value,
    photo: inpPhoto.value,
    number: inpNumber.value,
    email: inpEmail.value,
  };

  console.log(info);

  //   check for empty
  if (
    !inpName.value.trim() ||
    !inpSurname.value.trim() ||
    !inpNumber.value.trim() ||
    !inpPhoto.value.trim() ||
    !inpEmail.value.trim()
  ) {
    alert("Fill inputs");
    return;
  }

  //   add to json-server
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(info),
  });

  // clear inputs
  inpName.value = "";
  inpSurname.value = "";
  inpPhoto.value = "";
  inpNumber.value = "";
  inpEmail.value = "";

  //   display show
  read();
});

//  ? ---------------------------------------------------- READ -------------------------------------
async function read() {
  let cards = await fetch(`${API}?q=${searchVal}`);
  let res = await cards.json();

  console.log(res);

  infoList.innerHTML = "";

  res.forEach((element) => {
    infoList.innerHTML += `<div class='main-cards'>
    <div class="avatar">
      <img src="${element.photo}" class="img" style="width: 80%"/>
    </div>
    <div class="right-elements">
      <div class="data">
        <h2>${element.name}</h2>
        <h2>${element.surname}</h2>
      </div> 
      <div class="number">
        <p>${element.number}</p>
        <p>${element.email}</p>
      </div>
      <div class='btns'>
      <button onclick="editer(${element.id})"class='btn-edit'>EDIT</button>
      <button class='btn-delete' id="${element.id}">DELETE</button>
      </div>
    </div>
  </div>`;
  });
}

read();

// ? -------------------------------------------------- DELETE -----------------------------------------------

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    console.log(id);
    fetch(`${API}/${id}`, {
      method: "DELETE",
    })
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        read();
      });
  }
});

// reset

btnReset.addEventListener("click", () => {
  inpName.value = "";
  inpSurname.value = "";
  inpPhoto.value = "";
  inpNumber.value = "";
  inpEmail.value = "";
});

// ? ------------------------------------------- UPTADE ------------------------------------------------------------

async function editer(id) {
  editer_id = id;
  await fetch(`${API}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      btnSave.style.display = "block";
      bntSubmit.style.display = "none";
      if (data?.name) {
        inpName.value = data.name;
        inpSurname.value = data.surname;
        inpPhoto.value = data.photo;
        inpNumber.value = data.number;
        inpEmail.value = data.email;
      }
    });
  read();
}

btnSave.addEventListener("click", async function () {
  let newInfo = {
    name: inpName.value,
    surname: inpSurname.value,
    photo: inpPhoto.value,
    number: inpNumber.value,
    email: inpEmail.value,
  };

  fetch(`${API}/${editer_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newInfo),
  });
  inpName.value = "";
  inpSurname.value = "";
  inpPhoto.value = "";
  inpNumber.value = "";
  inpEmail.value = "";
  read();
});

read();

// ? -------------------------------------- SEARCH -------------------------------------------

btnSearch.addEventListener("click", () => {
  searchVal = inpName.value;
  read();
});
