const NUM_SONGS = 5;
const CLEAR_OPTIONS = ['+0', 'HARD CLEAR (+1)', 'EX HARD CLEAR (+2)', 'FULL COMBO (+3)'];
const SHORT_CLEAR_OPTIONS = ['', '+HC', '+EX', '+FC'];

const scoreInputs = [];
const clearInputs = [];

const scoresBySong = [];
const scoresByPlayer = [];

// Creates this structure for each song:
// <tr>
    // <td>Score 1</td>
    // <td><input id="score-0"></td>
    // <td>
    //     <select>
    //         <option>+0</option>
    //         <option>HARD CLEAR (+1)</option>
    //         <option>EX HARD CLEAR (+2)</option>
    //         <option>FULL COMBO (+3)</option>
    //     </select>
    // </td>
// </tr>
function addSongRows() {
    const table = document.getElementById('add-player-body');

    for (let k = 0; k < NUM_SONGS; k++) {
        const tr = document.createElement('tr');
    
        const titleTh = document.createElement('th');
        titleTh.innerText = `Score ${k + 1}`;
        tr.appendChild(titleTh);
    
        const scoreInputTd = document.createElement('td');
        const scoreInput = document.createElement('input');
        scoreInput.id = `score-${k}`;
        scoreInputs.push(scoreInput);
        scoreInputTd.appendChild(scoreInput);
        tr.appendChild(scoreInputTd);
    
        const clearInputTd = document.createElement('td');
        const clearInput = document.createElement('select');
        clearInput.id = `clear-${k}`;
        CLEAR_OPTIONS.forEach(option => {
            const el = document.createElement('option');
            el.innerText = option;
            clearInput.appendChild(el);
        });
        clearInputs.push(clearInput);
        clearInputTd.appendChild(clearInput);
        tr.appendChild(clearInputTd);

        // insert between dj name and submit button
        table.insertBefore(tr, table.children[table.children.length - 1]);

        scoresBySong.push([]);
    }
}

function addPlayer() {
    const table = document.getElementById('scores-body');
    const djNameInput = document.getElementById('dj-name');

    if (!djNameInput.value) {
        return;
    }

    const tr = document.createElement('tr');

    const th = document.createElement('th');
    th.innerText = djNameInput.value;
    tr.appendChild(th);

    let scores = [];
    let totalBonus = 0;
    for (let k = 0; k < NUM_SONGS; k++) {
        let score = parseInt(scoreInputs[k].value) || 0;
        let scoreBySongObj = scoresBySong[k].find(it => it.score === score);
        if (!scoreBySongObj) {
            scoreBySongObj = {
                score: score,
                players: [djNameInput.value],
            }
            scoresBySong[k].push(scoreBySongObj);
        } else {
            scoreBySongObj.players.push(djNameInput.value);
        }
        scores.push(score);

        let bonus = clearInputs[k].selectedIndex;
        totalBonus += bonus;

        const bonusDesc = SHORT_CLEAR_OPTIONS[bonus];
        let text = score;
        if (bonusDesc) {
            text = `${score}${bonusDesc} (${bonus})`;
        }

        const td = document.createElement('td');
        td.innerText = text;
        tr.appendChild(td);
    }

    const totalTd = document.createElement('td');
    tr.appendChild(totalTd);

    const newScore = {
        djName: djNameInput.value,
        scores: scores,
        bonus: totalBonus,
        total: 0,
        totalTd: totalTd,
    };
    scoresByPlayer.push(newScore);

    const pos = recalculate(djNameInput.value);
    let el = null;
    if (pos != -1) {
        el = table.children[pos];
    }

    table.insertBefore(tr, el);

    const inputs = document.getElementsByTagName('input');
    for (let k = 0; k < inputs.length; k++) {
        inputs[k].value = '';
    }
}

function recalculate(name) {
    for (let k = 0; k < NUM_SONGS; k++) {
        scoresBySong[k].sort((a, b) => a.score - b.score);
    }
    console.log(scoresBySong);

    for (let k = 0; k < scoresByPlayer.length; k++) {
        const player = scoresByPlayer[k];

        let total = player.bonus;
        for (let s = 0; s < NUM_SONGS; s++) {
            const thisSongScore = scoresBySong[s].findIndex(score => score.players.includes(player.djName)) + 1;
            total += thisSongScore;
        }
        player.total = total;
        player.totalTd.innerText = total;
        console.log(`${player.djName}: ${total}`);
    }

    scoresByPlayer.sort((a, b) => (b.total - a.total));
    console.log(scoresByPlayer);

    return scoresByPlayer.findIndex(player => player.djName == name);
}

window.onload = () => {
    addSongRows();
};