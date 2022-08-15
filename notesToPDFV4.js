const inputAuthor = document.querySelector(".author");
const inputTitle = document.querySelector(".story-title");
const inputNotes = document.querySelectorAll("textarea");
const exportNotes = document.querySelector(".export-notes");
const inputTitles = document.querySelectorAll(".title-notes");
const newNoteBtn = document.querySelector(".new-note");

//GET URL for Student to Navigate back to notes from PDF
const referenceURL = window.location.href;

//SET NOTES AUTHOR
inputAuthor.addEventListener("keyup", (ev) => {
  ev.preventDefault();
  localStorage.setItem("author", inputAuthor.value.trim());
});

//SET NOTES TITLE
inputTitle.addEventListener("keyup", (ev) => {
  ev.preventDefault();
  localStorage.setItem("title", inputTitle.value.trim());
  console.log(localStorage.getItem("title"));
});

//SET TITLES FOR EACH NOTE AREA
inputNotes.forEach((el, i) => {
  localStorage.setItem(`titles${i}`, inputTitles[i].textContent);
});

inputNotes.forEach((el, i) => {
  el.addEventListener("keyup", (ev) => {
    ev.preventDefault();
    localStorage.setItem(`notes${i}`, ev.target.value.trim());
  });
});

//POPULATE TEXTAREA FROM LOCAL STORE ON RELOAD/REFRESH
window.addEventListener("load", () => {
  inputNotes.forEach((el, i) => {
    inputNotes[i].value = localStorage.getItem(`notes${i}`).trim();
    inputAuthor.value = localStorage.getItem(`author`).trim();
    inputTitle.value = localStorage.getItem(`title`).trim();
  });
});

//NEW DOCUMENT CLEAR LOCALSTORAGE
newNoteBtn.addEventListener("click", (ev) => {
  localStorage.clear();

  //RESET VALUES
  inputNotes.forEach((el, i) => {
    inputNotes[i].value = "";
    inputAuthor.value = "";
    inputTitle.value = "";
  });
  //GET TITLES
  inputNotes.forEach((el, i) => {
    localStorage.setItem(`titles${i}`, inputTitles[i].textContent);
  });
});

//CREATE PDF ON EXPORT
exportNotes.addEventListener("click", (ev) => {
  ev.preventDefault();
  let output = [];
  inputNotes.forEach((el, i) => {
    let notes = `${localStorage.getItem(`notes${i}`).trim()}`;
    if (notes !== "" && notes !== "null") {
      let title = `${localStorage.getItem(`titles${i}`).trim()}`;
      output.push({
        text: `${title}`,
        style: "header",
      });
      output.push(notes);
    }
  });

  //IF NO AUTHOR CREATE BLANK LINE FOR PDF

  let author = "";
  if (
    localStorage.getItem("author") === "" ||
    localStorage.getItem("author") === null
  ) {
    author = "_________________________________________________________";
  } else {
    author = localStorage.getItem("author").trim();
  }

  //IF NO TITLE CREATE BLANK LINE FOR PDF

  let title = "";
  if (
    localStorage.getItem("title") === "" ||
    localStorage.getItem("title") === null
  ) {
    title = "____________________________________________________________";
  } else {
    title = localStorage.getItem("title").trim();
  }

  //IF NO NOTES INPUTS
  if (output.length === 0) {
    output.push({ text: "No notes saved to file", style: "header" });
  }

  //PUSH ALL LOGIC TO THE DOC DEFINITION

  let docDefinition = {
    pageSize: "A4",
    content: [
      { text: "Elements of a Story Notes", style: "lessonTitle" },

      {
        text: "Lesson Link: Elements of a Story",
        link: referenceURL,
        color: "#4dabf7",
        style: "link",
      },
      {
        text: `Author: ${author}`,
        style: "subHeader",
      },
      {
        text: `Title: ${title}`,
        style: "subHeader",
      },
      ...output,
    ],
    styles: {
      defaultStyle: {
        font: "helvetica",
        fontSize: 14,
      },
      lessonTitle: {
        fontSize: 22,
        bold: true,
      },
      subHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 16, 0, 5],
      },
      link: {
        margin: [0, 0, 0, 10],
      },
    },
  };
  //EXPORT PDF
  pdfMake.createPdf(docDefinition).open();
});
