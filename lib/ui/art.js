import figlet from "figlet";
import gradient from "gradient-string";

export const getBanner = (text = "GITHATE") => {
  const art = figlet.textSync(text, {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  return gradient.retro(art);
};

export const getHaterReveal = (text) => {
  const art = figlet.textSync(text, {
    font: "ANSI Shadow",
  });
  return gradient.passion(art);
};
