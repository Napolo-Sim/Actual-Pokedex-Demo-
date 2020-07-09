const mainScreen = document.querySelector(`.main-screen`)
const pokeName = document.querySelector(`.poke-name`);
const pokeId = document.querySelector(`.poke-id`);
const pokeFrontImage = document.querySelector(`.poke-front-image`);
const pokeBackImage = document.querySelector(`.poke-back-image`);
const pokeTypeOne = document.querySelector(`.poke-type-one`);
const pokeTypeTwo = document.querySelector(`.poke-type-two`);
const pokeWeight = document.querySelector(`.poke-weight`);
const pokeHeight = document.querySelector(`.poke-height`);
const pokeListItems = document.querySelectorAll(`.list-item`);
const leftButton = document.querySelector(`.left-button`);
const rightButton = document.querySelector(`.right-button`);


//Constants and Variables
const TYPES = [
    "normal", "fighting", "flying",
    "poison", "ground", "rock", "bug",
    "ghost", "steel", "fire", "water",
    "grass", "electric", "psychic",
    "ice", "dragon", "dark", "fairy"
];

let prevUrl = null;
let nextUrl = null;


//Functions
const resetScreen = () => {
    for (const type of TYPES) {
        mainScreen.classList.remove(type);
    }
}

const fetchPokeList = (url) => {
    //Get data for right screen
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for (let i = 0; i < pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];
                const { name } = resultData;

                if (resultData) {
                    const { name, url } = resultData;
                    const urlArray = url.split("/");
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = id + ". " + name;
                } else {
                    pokeListItem.textContent = "";
                }
            }
        });
}

const fetchPokeData = (id) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            resetScreen();

            const dataTypes = data.types;
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];
            pokeTypeOne.textContent = dataFirstType.type.name;
            if (dataSecondType) {
                pokeTypeTwo.classList.remove("hide");
                pokeTypeTwo.textContent = dataSecondType.type.name;
            } else {
                pokeTypeTwo.classList.add("hide");
                pokeTypeTwo.textContent = "";
            }

            mainScreen.classList.add(dataFirstType.type.name);
            mainScreen.classList.remove(`hide`);

            pokeName.textContent = data.name;
            pokeId.textContent = data.id;
            pokeWeight.textContent = data.weight;
            pokeHeight.textContent = data.height;

            pokeFrontImage.src = data.sprites.front_default || "";
            pokeBackImage.src = data.sprites.back_default || "";
        });
}


const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl)
    }
};

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl)
    }
};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split(".")[0];
    fetchPokeData(id);
};


//Event Listeners
leftButton.addEventListener("click", handleLeftButtonClick)
rightButton.addEventListener("click", handleRightButtonClick)

for (const pokeListitem of pokeListItems) {
    pokeListitem.addEventListener("click", handleListItemClick)

}

//Initialize App
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");


