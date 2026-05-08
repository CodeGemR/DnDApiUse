const statsMap = [
    { key: "STR", value: monsterData.strength },
    { key: "DEX", value: monsterData.dexterity },
    { key: "CON", value: monsterData.constitution },
    { key: "INT", value: monsterData.intelligence },
    { key: "WIS", value: monsterData.wisdom },
    { key: "CHA", value: monsterData.charisma },
];

const mainStats = document.createElement("div");
mainStats.className = "mainStatsCont";

const statFragment = document.createDocumentFragment();

statsMap.forEach(stats => {
    const cont = document.createElement("div");
    cont.className = `${statFragment.key.toLoweCase()}Cont`;

    const name = document.createElement("p");
    name.textContent = stat.key;

    const stat = document.createElement("p");
    stat = `${stat.value}(${getBonus(stat.value)})`;

    cont.append(name, value);
    statFragment.appendChild(cont)
})

mainStats.appendChild(statFragment);

console.log(statFragment)