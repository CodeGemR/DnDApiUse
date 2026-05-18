const monsterInput = document.getElementById("monsterInput")
const searchButton = document.getElementById("searchButton")
const monsterResult = document.getElementById("monsterResult")
const monsterList = document.getElementById("monsters")
const ruleResult = document.getElementById("ruleResult")
const searchRuleButton = document.getElementById("searchRuleButton")
const ruleInput = document.getElementById("ruleInput")
const ruleList = document.getElementById("rules")

searchButton.addEventListener("click", () => {
    const monsterName = monsterInput.value.toLowerCase();
    if (monsterName){
        searchMonster(monsterName);
    } else {
        monsterResult.textContent = "Please enter a monster name"
    }
});

let monsters = [];
let monstersLoaded = false;

async function loadMonster() {
    const response = await fetch(
        "https://www.dnd5eapi.co/api/2014/monsters"
    );
    const data = await response.json();
    monsters = data.results;
    monstersLoaded = true;
    console.log(data)
}

loadMonster();


monsterInput.addEventListener("input",() => {
    const value = monsterInput.value.toLowerCase().trim()

    if(!monstersLoaded) return;

    if(!value){
        monsterList.replaceChildren();
        return;
    }
    const matches = monsters.filter(m => m.name.toLowerCase().includes(value));

    renderDropDown(matches);
})

function renderDropDown(list){
    monsterList.replaceChildren();
    const fragment = document.createDocumentFragment();
    list.forEach(monster => {
        const option = document.createElement("div");
        option.className = "dropDownOption";
        option.textContent = monster.name;

        option.addEventListener("click", () => {
            monsterInput.value = monster.name;
            monsterList.replaceChildren();
            const monsterName = monsterInput.value.toLowerCase();
            searchMonster(monsterName);
            console.log(searchMonster(monsterName));
        })
        fragment.appendChild(option)
    })  
    monsterList.appendChild(fragment)
}

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

monsterInput.addEventListener(`keypress`, (e) => {
    const monsterName = monsterInput.value.toLowerCase();
    if(e.key === "Enter"){
        searchMonster(monsterName);
    }
})


async function searchMonster(monsterName){
    monsterResult.textContent = "Searching..."
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



let rules = [];
let rulesLoaded = false;

async function loadRules(){
    const response = await fetch(
        "https://www.dnd5eapi.co/api/2014/rule-sections"
    );
    const data = await response.json();
    rules = data.results;
    rulesLoaded = true;
    console.log(data)
}
loadRules();

searchRuleButton.addEventListener("click", () => {
    const ruleName = ruleInput.value.toLowerCase();
    if (ruleName){
        searchRules(ruleName);
    } else {
        ruleResult.textContent = "Please enter a rule"
    }
});

async function searchRules(ruleName){
    ruleResult.textContent = "Searching...";
    if(!rulesLoaded){
        ruleResult.textContent = "Not yet loaded"
        return;
    }
    const matchedRule = rules.find(
    (rule) => rule.name.toLowerCase().includes(ruleName))
    if(matchedRule){
        ruleResult.replaceChildren()
        const response = await fetch(
            `https://www.dnd5eapi.co${matchedRule.url}`
        );
        const ruleData = await response.json();
        const card = document.createElement("div")
        card.className = "rule-card"

        const ruleCont = document.createElement("div")
        ruleCont.className = "ruleCont";

        const ruleText = ruleData.desc;
        const textParts = ruleText.split("### ")
        const mainSection = textParts.shift();

        const mainTitle = document.createElement("h2");
        mainTitle.textContent = mainSection.split("\n")[0].replace("## ", " ");
        ruleCont.appendChild(mainTitle)

        textParts.forEach(part => {
            const lines = part.split("\n\n");
            const sectionTitle = document.createElement("h2");
            sectionTitle.textContent = lines[0];

            const sectionBody = document.createElement("p");
            sectionBody.textContent = lines.slice(1).join("\n\n").replace("#", " ");
            ruleCont.appendChild(sectionTitle)
            ruleCont.appendChild(sectionBody)
        })

    
        ruleResult.appendChild(card)
        card.append(
            ruleCont,
        )
        
    }else{
        ruleResult.textContent = "no rule found"
    }
}
ruleInput.addEventListener("input",() => {
    const value = ruleInput.value.toLowerCase().trim()

    if(!rulesLoaded) return;

    if(!value){
        renderRuleDropDown();
        return;
    }
    const matches = rules.filter(m => m.name.toLowerCase().includes(value));

    renderRuleDropDown(matches);
})

function renderRuleDropDown(list){
    ruleList.replaceChildren();
    const fragment = document.createDocumentFragment();
    list.forEach(rule => {
        const option = document.createElement("div");
        option.className = "dropDownOption";
        option.textContent = rule.name;

        option.addEventListener("click", () => {
            ruleInput.value = rule.name;
            ruleList.replaceChildren();
        })
        fragment.appendChild(option)
    })  
    ruleList.appendChild(fragment)
}