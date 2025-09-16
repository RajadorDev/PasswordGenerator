
/***
 *   
 * Rajador Developer
 * 
 * ▒█▀▀█ ░█▀▀█ ░░░▒█ ░█▀▀█ ▒█▀▀▄ ▒█▀▀▀█ ▒█▀▀█ 
 * ▒█▄▄▀ ▒█▄▄█ ░▄░▒█ ▒█▄▄█ ▒█░▒█ ▒█░░▒█ ▒█▄▄▀ 
 * ▒█░▒█ ▒█░▒█ ▒█▄▄█ ▒█░▒█ ▒█▄▄▀ ▒█▄▄▄█ ▒█░▒█
 * 
 * GitHub: https://github.com/rajadordev
 * 
 * Discord: rajadortv
 * 
 * 
**/ 

const NORMAL_CHARS = 'abcdefghijklmnopqrstuvwxyz';

const NUMBERS_CHARS = '1234567890';

const SIMBOLS_CHARS = '&*()-+=%$#@!^;><,.{}][§*';

const PASSWORD_LENGTH_ID = 'password-length';

const GENERATE_BUTTON_ID = 'generate-button';

const LEVEL_WEAK = 'weak';

const LEVEL_MEDIUM = 'medium';

const LEVEL_STRONG = 'strong';

const LEVEL_STRONGEST = 'strongest';

const LEVELS = {
    [LEVEL_WEAK]: NORMAL_CHARS.split(''),
    [LEVEL_MEDIUM]: NORMAL_CHARS.split(''),
    [LEVEL_STRONG]: (NORMAL_CHARS + NUMBERS_CHARS).split(''),
    [LEVEL_STRONGEST]: (NORMAL_CHARS + NUMBERS_CHARS + SIMBOLS_CHARS).split('')
};

const STRENGTH_COLOR = {
    [LEVEL_WEAK]: 'aquamarine',
    [LEVEL_MEDIUM]: 'greenyellow',
    [LEVEL_STRONG]: 'red',
    [LEVEL_STRONGEST]: 'darkred'
}


var password_input = null;

var checkBoxList = null;

document.addEventListener(
    'DOMContentLoaded',
    function () {
        init();
    }
);

function init() {
    password_input = document.getElementById('password-input');
    document.getElementById(GENERATE_BUTTON_ID)
    .addEventListener('click', function (button) {
        generatePasswordFromInputs().then(
            function (password) {
                toggleOpenButton(true);
                password_input.value = password;
            }
        )
    });
    document.querySelectorAll('[copy]').forEach(
        function (element) {
            element.addEventListener('click', function (event) {
                const element = event.target;
                const elementId = element.getAttribute('copy');
                const target = elementId == '@' ? element : document.getElementById(elementId);
                const value = target.value;
                if (typeof value == 'string' && value != '')
                {
                    navigator.clipboard.writeText(value);
                }
            });
        }
    );
    checkBoxList = document.querySelectorAll('[name="strength"]');
    checkBoxList.forEach (
        /**
         * @param {HTMLElement} element 
         */
        function (element) {
            element.style.accentColor = STRENGTH_COLOR[element.value];
            element.addEventListener('change', function (event) {
                const element = event.target;
                if (element.checked)
                {
                    for (let checkBoxElement of checkBoxList)
                    {
                        if (checkBoxElement !== element)
                        {
                            checkBoxElement.checked = false;
                        }
                    }
                } else {
                    let hasSomeChecked = false;
                    for (let checkBoxElement of checkBoxList)
                    {
                        if (checkBoxElement.checked)
                        {
                            hasSomeChecked = true;
                            break;
                        }
                    }
                    if (!hasSomeChecked)
                    {
                        element.checked = true;
                    }
                }
            });
        }
    );
}


/**
 * @param {number} length 
 * @param {string[]} chars 
 * @param {boolean} randomCase
 * @returns {string}
 */
async function generatePassword(length, chars, randomCase) {
    const maxLength = chars.length;
    const password = [];
    while (password.length < length)
    {
        let randomIndex = Math.floor(Math.random() * maxLength);
        let matchedChar = chars[randomIndex];
        if (randomCase)
        {
            if (randomBool())
            {
                matchedChar = matchedChar.toUpperCase();
            }
        }
        password.push(matchedChar);
    }
    return password.join('');
}

function getPasswordLength() {
    return document.getElementById(PASSWORD_LENGTH_ID)
    .value;
}

/**
 * @returns {string}
 */
function getStrongLevel() {
    for (let element of checkBoxList)
    {
        if (element.checked)
        {
            return element.value;
        }
    }
    throw 'No strong level';
}

function getStrongLevelIndex() {
    const keys = Object.keys(LEVELS);
    return keys.indexOf(getStrongLevel());
}

function getPasswordChars() {
    return LEVELS[getStrongLevel()];
}

/** @returns {boolean} */
function randomBool() {
    return Math.floor(Math.random() * 2) == 1;
}

/**
 * @param {boolean} open 
 */
function toggleOpenButton(open) {
    /** @type {import("react").ButtonHTMLAttributes} */
    const button = document.getElementById('copy');
    button.disabled = !open;
}

async function generatePasswordFromInputs() {
    const chars = getPasswordChars();
    const length = getPasswordLength();
    const password = await generatePassword(length, chars, getStrongLevelIndex() > 0);
    return password;
}



