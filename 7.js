class TreasureMap {
    static async getInitialClue() {
        const elements = await loadElementData();
        return `在古老的图书馆里找到了第一个线索...<br>${elements['图书馆']}`;
    }

    static async decodeAncientScript(clue) {
        const elements = await loadElementData();
        return `解码成功! 宝藏在一座古老的神庙中...<br>${elements['神庙']}`;
    }

    static async searchTemple(location) {
        const elements = await loadElementData();
        const random = Math.random();
        if (random < 0.3) {
            throw { message: `糟糕! 遇到了神庙守卫...<br>${elements['守卫']}`, image: 'mogui.jpg' };
        } else if (random < 0.8) {
            return `你遇到了恶龙! 但成功打败了它，找到了一个神秘的箱子...`;
        } else {
            throw { message: "你遇到了恶龙，并且挑战失败!", image: 'dragon.jpg' };
        }
    }

    static async openTreasureBox() {
        const random = Math.random();
        if (random < 0.8) {
            return "恭喜! 你找到了传说中的宝藏!";
        } else {
            throw { message: "糟糕! 宝箱竟然是宝箱怪，你被吃掉了!", image: '陷阱.jpg' };
        }
    }
}

async function loadElementData() {
    const response = await fetch('elements.txt');
    const text = await response.text();
    const elements = {};
    text.split('\n').forEach(line => {
        const [key, description] = line.split(':');
        elements[key.trim()] = description.trim();
    });
    return elements;
}

async function findTreasureAsync() {
    const outputDiv = document.getElementById('output');
    const imgElement = document.getElementById('storyImage');
    outputDiv.innerHTML = "游戏开始..."; // 提供游戏开始的入口状态
    imgElement.style.display = 'none';

    try {
        const clue = await TreasureMap.getInitialClue();
        updateOutputAndImage(clue, '图书馆.jpg');

        const location = await TreasureMap.decodeAncientScript(clue);
        updateOutputAndImage(location, 'temple.jpg');

        const box = await TreasureMap.searchTemple(location);
        updateOutputAndImage(box, 'dragon.jpg');

        const treasure = await TreasureMap.openTreasureBox();
        updateOutputAndImage(treasure, 'treasure.jpg');
    } catch (error) {
        updateOutputAndImage("任务失败: " + error.message, error.image || 'failure.jpg');
    }
}

function updateOutputAndImage(outcome, imageName) {
    const outputDiv = document.getElementById('output');
    const imgElement = document.getElementById('storyImage');

    outputDiv.innerHTML += outcome + "<br>";
    if (imageName) {
        imgElement.src = imageName;
        imgElement.style.display = 'block';
    }
}

document.getElementById('startButton').addEventListener('click', function () {
    findTreasureAsync();
    const music = document.getElementById('backgroundMusic');
    music.play();
});
