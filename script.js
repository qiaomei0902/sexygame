const board = document.getElementById('game-board');
const rollButton = document.getElementById('roll-button');
const message = document.getElementById('message');
const diceResult = document.getElementById('dice-result');
const winScreen = document.getElementById('win-screen');
const winImage = document.getElementById('win-image');
const restartButton = document.getElementById('restart-button');
const player1ScoreBoard = document.getElementById('player1-score');
const player2ScoreBoard = document.getElementById('player2-score');
const scoreBoard = document.getElementById('score-board');

const boardSize = 50;
const messages = [
    '起點',
    '幫對手含住蛋蛋或陰蒂10秒舌頭打轉',
    '被捆住雙手直到遊戲結束',
    '對方給你口交指定部位1分鐘',
    '後退1格',
    '用腳幫對方按摩1分鐘',
    '舔對手的絲足或手指10秒',
    '後退2格',
    '幫對方按腳30秒',
    '親吻大腿內側10秒',
    '吸吮對方手指10秒',
    '被蒙住雙眼直到遊戲結束',
    '被對手用牙齒咬住乳頭磨蹭10秒',
    '對方含著水在你身上親吻30秒',
    '用嘴含住對手蛋蛋或陰蒂10秒',
    '舔對方的脖子到胸部30秒',
    '男從後背伸手揉女胸30秒',
    '後入抽插30次不許射',
    '跟對手乳頭互碰互磨30秒',
    '後退3格',
    '後退2格',
    '搔對方癢30秒',
    '將液體到在對方身體上並舔乾淨',
    '前進2格',
    '前進至41',
    '後面插入20次並拍視頻',
    '拍一段幫對方口交的15秒視頻',
    '男方站立抱起女方懸空抽插30次不許射',
    '男揉女胸對鏡子拍視頻20秒',
    '用胸或JJ蹭對方臉10秒',
    '回到26',
    '觀音座蓮抽插30秒不許射',
    '後退4格',
    '對手幫你舔全身2分鐘',
    '被對手用JJ打臉三下或是用鮑魚蹭臉10秒',
    '含熱水給對方口交30秒',
    '含冰水給對方口交30秒',
    '拍一段30秒做愛視頻',
    '對手跪著幫自己口交1分鐘',
    '回到26',
    '女方幫男方足交1分鐘',
    '撅起屁股讓對方打3下',
    '被搔癢10秒',
    '男方公主抱女方在房內行走一圈',
    '對方自慰並拍視頻30秒',
    '對著鏡子做愛30秒',
    '女幫男乳交30秒',
    '舔對方耳朵30秒',
    '揉對方胸3下或輕咬對方耳垂5下',
    '終點，勝利方可以要求任何讓自己舒服的方式'
];

const players = [
    { position: 1, score: 1, color: 'red', element: createPlayerElement('player-1') },
    { position: 1, score: 1, color: 'blue', element: createPlayerElement('player-2') }
];
let currentPlayerIndex = 0; // 玩家1先行動
let turn = 1; // 第1回合

function createBoard() {
    const layout = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [40, 39, 38, 37, 36, 35, 34, 33, 32, 31],
        [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
    ];
    
    for (let row of layout) {
        for (let cellNumber of row) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.number = cellNumber;  // Set data attribute for cell number
            board.appendChild(cell);
        }
    }

    moveToPosition(players[0], 1);
    moveToPosition(players[1], 1);
}

function createPlayerElement(playerClass) {
    const player = document.createElement('div');
    player.classList.add('player', playerClass);
    return player;
}

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function animateDiceRoll() {
    return new Promise((resolve) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - start >= 1000) {
                clearInterval(interval);
                resolve(rollDice());
            } else {
                diceResult.textContent = `投擲結果: ${Math.floor(Math.random() * 6) + 1}`;
            }
        }, 100);
    });
}

async function movePlayer(player, steps) {
    let newPosition = player.position + steps;
    if (newPosition > boardSize) {
        newPosition = boardSize;
    }
    await animateMove(player, player.position, newPosition);
    player.position = newPosition;
    player.score = newPosition;

    checkForMessage(player.position);

    if ([5, 8, 20, 21, 24, 25, 31, 33, 40].includes(player.position)) {
        rollButton.disabled = true;
        await delay(3000); // 延遲3秒再觸發規則
        await applyScoreRules(player);
        rollButton.disabled = false;
    }
    
    checkForWin(player);
    turn++;
    currentPlayerIndex = (turn - 1) % players.length; // 切換玩家，奇數回合玩家1，偶數回合玩家2
    updateRollButtonColor();
}

async function applyScoreRules(player) {
    let newPosition = player.position;
    switch (player.position) {
        case 5:
            newPosition -= 1;
            break;
        case 8:
            newPosition -= 2;
            break;
        case 20:
            newPosition -= 3;
            break;
        case 21:
            newPosition -= 2;
            break;
        case 24:
            newPosition += 2;
            break;
        case 25:
            newPosition += 16;
            break;
        case 31:
            newPosition -= 5;
            break;
        case 33:
            newPosition -= 4;
            break;
        case 40:
            newPosition -= 14;
            break;
    }
    await animateMove(player, player.position, newPosition);
    player.position = newPosition;
    player.score = newPosition;
    checkForMessage(player.position);
}

function checkForWin(player) {
    if (player.position === 50) {
        showWinScreen(player);
    }
}

function showWinScreen(player) {
    winImage.src = player.color === 'red' ? 'player1_win.png' : 'player2_win.png';
    winScreen.classList.remove('hidden');
}

function restartGame() {
    players.forEach(player => {
        player.position = 1;
        player.score = 1;
        moveToPosition(player, 1);
    });
    currentPlayerIndex = 0; // 重置為玩家1先行動
    turn = 1; // 重置回合
    updateRollButtonColor();
    message.style.borderColor = 'transparent';
    message.style.display = 'none';
    winScreen.classList.add('hidden');
}

function animateMove(player, from, to) {
    return new Promise(async (resolve) => {
        const step = from < to ? 1 : -1;
        for (let i = from + step; i !== to + step; i += step) {
            await moveToPosition(player, i);
        }
        resolve();
    });
}

function moveToPosition(player, position) {
    return new Promise((resolve) => {
        const newCell = board.children[getBoardIndex(position)];
        player.element.style.left = '50%';
        player.element.style.top = '50%';
        player.element.style.transform = 'translate(-50%, -50%)';
        newCell.appendChild(player.element);
        setTimeout(resolve, 600); // 600ms 移動動畫
    });
}

function getBoardIndex(position) {
    const layout = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
        [40, 39, 38, 37, 36, 35, 34, 33, 32, 31],
        [41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
    ];
    for (let i = 0; i < layout.length; i++) {
        const index = layout[i].indexOf(position);
        if (index !== -1) {
            return i * 10 + index;  // Convert 2D index to 1D index
        }
    }
    return -1;
}

function checkForMessage(position) {
    message.textContent = messages[position - 1];
    message.style.borderColor = players[currentPlayerIndex].color;
    message.style.display = 'block';
}

function updateRollButtonColor() {
    rollButton.style.backgroundColor = players[currentPlayerIndex].color;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

rollButton.addEventListener('click', async () => {
    message.style.display = 'none';
    diceResult.style.display = 'none';

    diceResult.style.display = 'block';
    const steps = await animateDiceRoll();
    diceResult.textContent = `投擲結果: ${steps}`;

    await movePlayer(players[currentPlayerIndex], steps);
});

restartButton.addEventListener('click', restartGame);

createBoard();
updateRollButtonColor();