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
    monsterResult.textContent = "Searching..."
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
        size.className = "size-font";

        const nameCont = document.createElement("div");
        nameCont.className = "nameCont";
        nameCont.append(name,size);

        const subStatCont = document.createElement("div");
        subStatCont.className = "subStat";

        const speedVal = monsterData.speed;
        const speedDisplay = Object.entries(speedVal).map(([name, value]) => `${name}: ${value}`);

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
            label.className = "boldStat"
            
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

        const skillVal = monsterData.proficiencies?.filter(p => ["Skill:"].some(skill => p.proficiency.name.includes(skill))).map(p => ({name : p.proficiency.name.split(": ")[1], value: p.value}));
        const skillDisplay = skillVal.map(skill => `${skill.name}: ${skill.value}`)

        const savingThrow = document.createElement("p");
        savingThrow.textContent = `Saving Throws ${savingThrowDisplay}`;

        const sense = monsterData.senses;
        const senses = document.createElement("p")
        const sensesText = Object.keys(sense).map(key => `${key.replaceAll("_"," ")} ${sense[key]}`);
        senses.textContent = sensesText;

        const abilityCont = document.createElement("div");
        abilityCont.className = "abilityCont";

        const abilities = monsterData.special_abilities.map(ability => ({name : ability.name, desc : ability.desc}));

        const actions = monsterData.actions.map(action => ({name : action.name, desc : action.desc}));

        const actionCont = document.createElement("div");
        actionCont.className = "actionCont" 


        function addParagraph(container,label,value){
            const p = document.createElement("p");
            const bold = document.createElement("strong");
            bold.textContent = label;

            p.appendChild(bold);
            p.append(` ${value}`);

            container.appendChild(p);
        }

        function addSmallParagraph(container,label,value){
            const p = document.createElement("p");
            const bold = document.createElement("strong");
            bold.textContent = label;
            bold.className = "boldBlack"
            p.className = "normalBlack"

            p.appendChild(bold);
            p.append(` ${value}`)

            container.appendChild(p);
        }


        addParagraph(subStatCont, "Armor Class", `${ac}(${acType})`)
        addParagraph(subStatCont, "Hit Points", `${monsterData.hit_points} (${monsterData.hit_points_roll})`)
        addParagraph(subStatCont, "Speed", `${speedDisplay}`)

        

        addParagraph(skillCont, "Saving Throws", `${savingThrowDisplay}`)
        addParagraph(skillCont, "Skills", `${skillDisplay}`)
        addParagraph(skillCont, "Senses", `${sensesText}`)
        addParagraph(skillCont, "Languages", monsterData.languages);
        addParagraph(skillCont, "Challenge", `${monsterData.challenge_rating}(${monsterData.xp})`)

        monsterData.special_abilities.forEach(ability => {addSmallParagraph(abilityCont,`${ability.name}:`, `${ability.desc}`)})

        const actionName = document.createElement("h2");
        actionName.textContent = `Actions`;
        actionName.className = "underlineH2"
        abilityCont.appendChild(actionName)

        monsterData.actions.forEach(action => {addSmallParagraph(actionCont,`${action.name}:`, `${action.desc}`)})

        

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
            abilityCont,
            actionCont,
            img
        )
        console.log(monsterData)
    }else{
        monsterResult.textContent = "Monster Not found";
    }
}
