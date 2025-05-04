if (annyang) {
  const commands = {
    'hello': () => alert('Hello World'),
    'change the color to *color': (color) => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': (page) => {
      window.location.href = `${page.toLowerCase()}.html`;
    }
  };
  annyang.addCommands(commands);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://zenquotes.io/api/random")
    .then((response) => response.json())
    .then((data) => {
      const quoteData = data[0];
      document.getElementById("quote-text").textContent = `"${quoteData.q}"`;
      document.getElementById("quote-author").textContent = `- ${quoteData.a}`;
    })
});