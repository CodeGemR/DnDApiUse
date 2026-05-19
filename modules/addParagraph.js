export function addParagraph(container,label,value){
    const p = document.createElement("p");
    const bold = document.createElement("strong");
    bold.textContent = label;

    p.appendChild(bold);
    p.append(` ${value}`);

    container.appendChild(p);
}