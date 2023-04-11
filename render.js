import path from "path";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

const render = async (filename) => {
  const filePath = path.join(process.cwd(), filename);

  const dom = await JSDOM.fromFile(filePath, {
    runScripts: "dangerously",
    resources: "usable",
  });

  return new Promise((resolve, reject) => {
    dom.window.document.addEventListener("DOMContentLoaded", () => {
      resolve(dom);
    });
  });
};

export default render;
