const lessonTitle = document.querySelector(".banner");
const inputTitle = document.querySelector(".story-title");
const inputNotes = document.querySelectorAll("textarea");
const exportNotes = document.querySelector(".export-notes");
const inputTitles = document.querySelectorAll(".title-notes");
const newNoteBtn = document.querySelector(".new-note");

//GET URL for Student to Navigate back to notes from PDF
const referenceURL = window.location.href;

//SET NOTES TITLE
inputTitle.addEventListener("keyup", (ev) => {
  ev.preventDefault();
  localStorage.setItem("title", inputTitle.value.trim());
});

//SET TITLES FOR EACH NOTE AREA
inputNotes.forEach((el, i) => {
  localStorage.setItem(`titles${i}`, inputTitles[i].textContent.trim());
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
    inputNotes[i].value = localStorage.getItem(`notes${i}`);
    inputTitle.value = localStorage.getItem(`title`);
  });
});

//NEW DOCUMENT CLEAR LOCALSTORAGE
newNoteBtn.addEventListener("click", (ev) => {
  ev.preventDefault();
  // localStorage.clear();
  localStorage.removeItem(`author`);
  localStorage.removeItem(`title`);
  inputTitle.value = "";

  //RESET VALUES
  inputNotes.forEach((el, i) => {
    localStorage.removeItem(`notes${i}`);
    inputNotes[i].value = "";
  });
  //GET TITLES
  inputNotes.forEach((el, i) => {
    localStorage.setItem(`titles${i}`, inputTitles[i].textContent);
  });
});

//CREATE PDF ON EXPORT
exportNotes.addEventListener("click", (ev) => {
  const filename =
    lessonTitle.textContent.trim().replaceAll(" ", "_") + "_Notes";
  ev.preventDefault();
  let output = [];
  inputNotes.forEach((el, i) => {
    let notes = `${localStorage.getItem(`notes${i}`)}`;
    if (notes !== "" && notes !== "null") {
      let title = `${localStorage.getItem(`titles${i}`)}`;
      output.push({
        text: `${title}`,
        style: "header",
      });
      output.push(notes);
    }
  });

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
      { text: `${lessonTitle.textContent.trim()}`, style: "lessonTitle" },

      {
        text: `Lesson Link: ${lessonTitle.textContent.trim()}`,
        link: referenceURL,
        color: "#4dabf7",
        style: "link",
      },
      {
        text: `Story Title: ${title}`,
        style: "subHeader",
      },
      ...output,
    ],
    styles: {
      defaultStyle: {
        font: "Times-Roman",
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
  pdfMake.createPdf(docDefinition).download(`${filename}`);
});
