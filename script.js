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
        size.textContent = `${monsterData.size} ${monsterData.type}, ${monsterData.alignment}`;
        const nameCont = document.createElement("div");
        nameCont.className = "nameCont";
        nameCont.append(name,size);

        const subStatCont = document.createElement("div");
        subStatCont.className = "subStat";

        [
            `Amor Class: ${ac}(${acType})`,
            `Hit Points : ${monsterData.hit_points} (${monsterData.hit_points_roll})`,
            `Speed: ${monsterData.speed.walk}`
        ].forEach(text => {
            const p = document.createElement("p");
            p.textContent = text;
            subStatCont.appendChild(p)
        }); 

        const mainStats = document.createElement("div");
        mainStats.className = "mainStatCont";

        const statsMap = [
        { key: "STR", value: monsterData.strength },
        { key: "DEX", value: monsterData.dexterity },
        { key: "CON", value: monsterData.constitution },
        { key: "INT", value: monsterData.intelligence },
        { key: "WIS", value: monsterData.wisdom },
        { key: "CHA", value: monsterData.charisma },
        ];
        statsMap.forEach(stat => {
            const box = document.createElement("div");
            box.className = "statBox"

            const label = document.createElement("p")
            label.textContent = stat.key;
            
            const value = document.createElement("p")
            value.textContent = `${stat.value} (${getBonus(stat.value)})`;

            box.append(label, value);
            mainStats.appendChild(box);

        });

        function getBonus(stats){
            const bonus = Math.floor((stats - 11) / 2)
            return bonus >= 0 ? `+${bonus}` : `${bonus}`
        };

        const statMap = {
        CON: "Con",
        DEX: "Dex",
        STR: "Str",
        WIS: "Wis",
        INT: "Int",
        CHA: "Cha"
        };

        const skillCont = document.createElement("div");
        skillCont.className = "skillCont"

        const savingThowVal = monsterData.proficiencies?.filter(p => ["CON","DEX","STR","WIS","INT","CHA"].some(stat => p.proficiency.name.includes(stat))).map(p => ({name : p.proficiency.name.split(": ")[1], value: p.value}));
        const savingThrowDisplay = savingThowVal?.map(s => `${statMap[s.name.toUpperCase()]} +${s.value}`).join(", ")

        const savingThrow = document.createElement("p");
        savingThrow.textContent = `Saving Throws ${savingThrowDisplay}`
        skillCont.appendChild(savingThrow);

        const sense = monsterData.senses;
        const senses = document.createElement("p")
        const sensesText = Object.keys(sense).map(key => `${key.replaceAll("_"," ")} ${sense[key]}`);
        senses.textContent = sensesText;
        skillCont.appendChild(senses)

        function addParagraph(container,label,value){
            const p = document.createElement("p");
            p.textContent = `${label} ${value}`;
            container.appendChild(p);
        }
        addParagraph(skillCont, "Language", monsterData.languages);
        addParagraph(skillCont, "Challenge", `${monsterData.challenge_rating}(${monsterData.xp})`)

        

        const img = document.createElement("img");
        img.src = `https://www.dnd5eapi.co${monsterData.image}`;
        img.alt = monsterData.name;
        img.className = `monster-img`;
        
        monsterResult.appendChild(card);
        card.append(
            nameCont,
            subStatCont,
            mainStats,
            skillCont,
            img
        )
        console.log(monsterData)
    }else{
        monsterResult.textContent = "Monster Not found";
    }
}
