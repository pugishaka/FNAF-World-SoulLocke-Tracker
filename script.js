const columns = document.getElementById("columns");
const skullColumn = document.getElementById("skullColumn");

const addColumnButton =
    document.getElementById("addColumn");

const removeColumnButton =
    document.getElementById("removeColumn");


/* ============================================
   STARTING CHARACTERS
   ============================================ */

const characters = [
    "Freddy",
    "Bonnie",
    "Chica",
    "Foxy",
    "Toy Freddy",
    "Toy Bonnie",
    "Toy Chica",
    "Mangle"
];


/* ============================================
   RANDOMIZER POOLS
   ============================================ */

const characterPools = {
    2: [...characters],
    3: [...characters]
};


/* ============================================
   GET RANDOM CHARACTER
   ============================================ */

function getRandomCharacter(columnNumber) {

    const pool =
        characterPools[columnNumber];

    const randomIndex =
        Math.floor(
            Math.random() * pool.length
        );

    return pool.splice(
        randomIndex,
        1
    )[0];
}


/* ============================================
   CREATE REMOVE BUTTON
   ============================================ */

function createRemoveButton() {

    const button =
        document.createElement("button");

    button.classList.add("remove-box");

    button.textContent = "×";

    button.title = "Remove";

    return button;
}


/* ============================================
   ADD RANDOMIZED BOX
   ============================================ */

function addRandomizedBox(
    column,
    character
) {

    const list =
        column.querySelector(
            ".character-list"
        );

    const box =
        document.createElement("div");

    box.classList.add("character");

    box.textContent = character;

    box.dataset.character =
        character;

    box.dataset.randomized =
        "true";

    box.appendChild(
        createRemoveButton()
    );

    list.appendChild(box);

    updateSkulls();
}


/* ============================================
   ADD MANUAL BOX
   ============================================ */

function addManualBox(column) {

    const list =
        column.querySelector(
            ".character-list"
        );

    const box =
        document.createElement("div");

    box.classList.add("character");

    box.dataset.randomized =
        "false";


    const input =
        document.createElement("input");

    input.type = "text";

    input.classList.add(
        "character-input"
    );

    input.placeholder =
        "Enter character...";


    box.appendChild(input);

    box.appendChild(
        createRemoveButton()
    );

    list.appendChild(box);

    input.focus();

    updateSkulls();
}


/* ============================================
   ADD BOX
   ============================================ */

function addBox(column) {

    const columnNumber =
        Number(column.dataset.column);

    const list =
        column.querySelector(
            ".character-list"
        );

    const boxCount =
        list.children.length;


    /*
     * COLUMN 1
     *
     * Its original 8 are fixed.
     * Anything added is manual.
     */

    if (columnNumber === 1) {

        addManualBox(column);

        return;
    }


    /*
     * COLUMNS 2 & 3
     *
     * First 8 = randomized.
     * 9+ = manual.
     */

    if (boxCount < 8) {

        const character =
            getRandomCharacter(
                columnNumber
            );

        addRandomizedBox(
            column,
            character
        );

    } else {

        addManualBox(column);
    }
}


/* ============================================
   REMOVE BOX
   ============================================ */

function removeBox(box) {

    const column =
        box.closest(".column");

    const columnNumber =
        Number(column.dataset.column);


    /*
     * Return randomized character
     * to its pool.
     */

    if (
        (columnNumber === 2 ||
            columnNumber === 3) &&
        box.dataset.randomized === "true"
    ) {

        const character =
            box.dataset.character;

        if (
            character &&
            !characterPools[
                columnNumber
                ].includes(character)
        ) {

            characterPools[
                columnNumber
                ].push(character);
        }
    }

    box.remove();

    updateSkulls();
}


/* ============================================
   UPDATE SKULLS
   ============================================ */

function updateSkulls() {

    skullColumn.innerHTML = "";


    /*
     * Find the maximum number of rows
     * currently existing in any column.
     */

    const allColumns =
        [...document.querySelectorAll(
            ".column"
        )];

    let maxRows = 0;

    allColumns.forEach(column => {

        const count =
            column.querySelector(
                ".character-list"
            ).children.length;

        maxRows =
            Math.max(maxRows, count);
    });


    /*
     * Create one skull per row.
     */

    for (
        let row = 0;
        row < maxRows;
        row++
    ) {

        const skullRow =
            document.createElement("div");

        skullRow.classList.add(
            "skull-row"
        );


        const skull =
            document.createElement("button");

        skull.classList.add(
            "skull-button"
        );

        skull.textContent = "💀";

        skull.title =
            "Mark entire row as dead";


        skull.dataset.row =
            row;


        skullRow.appendChild(skull);

        skullColumn.appendChild(
            skullRow
        );
    }


    syncDeadRows();
}


/* ============================================
   TOGGLE ENTIRE ROW
   ============================================ */

function toggleRowDead(row) {

    const allColumns =
        [...document.querySelectorAll(
            ".column"
        )];


    /*
     * Find all boxes in this row.
     */

    const rowBoxes = [];

    allColumns.forEach(column => {

        const boxes =
            column.querySelector(
                ".character-list"
            ).children;

        if (boxes[row]) {
            rowBoxes.push(boxes[row]);
        }
    });


    /*
     * If ANY box is alive,
     * kill the entire row.
     *
     * If they're all dead,
     * revive the entire row.
     */

    const shouldKill =
        rowBoxes.some(
            box =>
                !box.classList.contains(
                    "dead"
                )
        );


    rowBoxes.forEach(box => {

        if (shouldKill) {
            box.classList.add("dead");
        } else {
            box.classList.remove("dead");
        }
    });


    syncDeadRows();
}


/* ============================================
   SYNC SKULL APPEARANCE
   ============================================ */

function syncDeadRows() {

    const skulls =
        [...document.querySelectorAll(
            ".skull-button"
        )];


    const allColumns =
        [...document.querySelectorAll(
            ".column"
        )];


    skulls.forEach((skull, row) => {

        const rowBoxes = [];

        allColumns.forEach(column => {

            const boxes =
                column.querySelector(
                    ".character-list"
                ).children;

            if (boxes[row]) {
                rowBoxes.push(boxes[row]);
            }
        });


        const allDead =
            rowBoxes.length > 0 &&
            rowBoxes.every(
                box =>
                    box.classList.contains(
                        "dead"
                    )
            );


        if (allDead) {
            skull.style.opacity = "0.4";
        } else {
            skull.style.opacity = "1";
        }
    });
}


/* ============================================
   CLICK HANDLER
   ============================================ */

document.addEventListener(
    "click",
    event => {

        /*
         * PLUS
         */

        if (
            event.target.classList.contains(
                "add-box"
            )
        ) {

            const column =
                event.target.closest(
                    ".column"
                );

            addBox(column);

            return;
        }


        /*
         * REMOVE
         */

        if (
            event.target.classList.contains(
                "remove-box"
            )
        ) {

            const box =
                event.target.closest(
                    ".character"
                );

            removeBox(box);

            return;
        }


        /*
         * SKULL
         */

        if (
            event.target.classList.contains(
                "skull-button"
            )
        ) {

            const row =
                Number(
                    event.target.dataset.row
                );

            toggleRowDead(row);

            return;
        }
    }
);


/* ============================================
   ADD THIRD COLUMN
   ============================================ */

addColumnButton.addEventListener(
    "click",
    () => {

        const existing =
            document.querySelector(
                '[data-column="3"]'
            );

        if (existing) {
            return;
        }


        const column =
            document.createElement(
                "div"
            );

        column.classList.add(
            "column"
        );

        column.dataset.column = "3";


        column.innerHTML = `
    <h2>
        <input
            class="column-name"
            type="text"
            value="Column 3"
            maxlength="30"
        >
    </h2>

    <div class="character-list"></div>

    <button class="add-box">
        +
    </button>
`;


        columns.appendChild(column);


        characterPools[3] =
            [...characters];


        addColumnButton.classList.add(
            "hidden"
        );

        removeColumnButton.classList.remove(
            "hidden"
        );


        updateSkulls();
    }
);


/* ============================================
   REMOVE THIRD COLUMN
   ============================================ */

removeColumnButton.addEventListener(
    "click",
    () => {

        const thirdColumn =
            document.querySelector(
                '[data-column="3"]'
            );

        if (thirdColumn) {
            thirdColumn.remove();
        }


        characterPools[3] =
            [...characters];


        addColumnButton.classList.remove(
            "hidden"
        );

        removeColumnButton.classList.add(
            "hidden"
        );


        updateSkulls();
    }
);


/* ============================================
   INITIAL SKULLS
   ============================================ */

updateSkulls();