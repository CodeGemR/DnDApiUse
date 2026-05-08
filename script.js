const monsterInput = document.getElementById("monsterInput")
const searchButton = document.getElementById("searchButton")
const monsterResult = document.getElementById("monsterResult")

searchButton.addEventListener("click", () => {
    const monsterName = monsterInput.value.toLowerCase();
    if (monsterName){
        searchMonster(monsterName);
    } else {
        monsterResult.textContent = "Please enter a monster name"
    }
});

async function searchMonster(monsterName){
    monsterResult.textContent = "Searchin..."
    const response = await fetch(
        "https://www.dnd5eapi.co/api/2014/monsters"
    );
    const data = await response.json();
    const monsters = data.results;
    const matchedMonster = monsters.find(
        (monster) => monster.name.toLowerCase().includes(monsterName)
    );
    if(matchedMonster){
        const response = await fetch(
            `https://www.dnd5eapi.co${matchedMonster.url}`
        );
        const monsterData = await response.json();
        const ac = monsterData.armor_class?.[0]?.value;
        const acType = monsterData.armor_class?.[0]?.type;
        monsterResult.textContent = "";
        const card = document.createElement("div");
        card.className = "monster-card";
        
        const name = document.createElement("h2");
        name.textContent = monsterData.name;
        const size = document.createElement("p");
        size.textContent = `${monsterData.size} ${monsterData.type}`;

        const subStatCont = document.createElement("div");
        subStatCont.className = "subStat";

        const nameCont = document.createElement("div");
        nameCont.className = "nameCont";

        const armor = document.createElement("p");
        armor.textContent = `Armor Class: ${ac} (${acType})`;
        
        const speed = document.createElement("p");
        speed.textContent = `Speed ${monsterData.speed.walk}`;   

        const hitPoints = document.createElement("p");
        hitPoints.textContent = `Hit Points ${monsterData.hit_points}(${monsterData.hit_points_roll})`

        const mainStats = document.createElement("div");
        mainStats.className = "mainStatCont";

        const strCont = document.createElement("div")
        strCont.className = "strCont";

        const dexCont = document.createElement("div")
        dexCont.className = "dexCont";

        const conCont = document.createElement("div")
        conCont.className = "conCont";

        const intCont = document.createElement("div")
        intCont.className = "intCont";

        const wisCont = document.createElement("div")
        wisCont.className = "wisCont";

        const chaCont = document.createElement("div")
        chaCont.className = "chaCont";

        const strName = document.createElement("p");
        strName.textContent = `Strength`;

        const str = document.createElement("p");
        str.textContent = `${monsterData.strength}(${modifier})`;

        

        const img = document.createElement("img");
        img.src = `https://www.dnd5eapi.co${monsterData.image}`;
        img.alt = monsterData.name;
        img.className = `monster-img`;
        
        monsterResult.appendChild(card);
        card.appendChild(nameCont);
        card.appendChild(subStatCont);
        card.appendChild(mainStats);
        nameCont.appendChild(name);
        nameCont.appendChild(size);
        subStatCont.appendChild(armor);
        subStatCont.appendChild(speed);
        subStatCont.appendChild(hitPoints);
        card.appendChild(mainStats)
        mainStats.appendChild(strCont)
        strCont.appendChild(strName)
        strCont.appendChild(str)
        mainStats.appendChild(dexCont)
        mainStats.appendChild(conCont)
        mainStats.appendChild(intCont)
        mainStats.appendChild(wisCont)
        mainStats.appendChild(chaCont)
        card.appendChild(img);
        console.log(monsterData)
    }else{
        monsterResult.textContent = "Monster Not found";
    }
}
