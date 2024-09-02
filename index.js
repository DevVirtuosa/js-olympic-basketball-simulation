const groups = {
  A: [
    {
      Team: "Kanada",
      ISOCode: "CAN",
      FIBARanking: 7,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Australija",
      ISOCode: "AUS",
      FIBARanking: 5,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Grčka",
      ISOCode: "GRE",
      FIBARanking: 14,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Španija",
      ISOCode: "ESP",
      FIBARanking: 2,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
  ],
  B: [
    {
      Team: "Nemačka",
      ISOCode: "GER",
      FIBARanking: 3,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Francuska",
      ISOCode: "FRA",
      FIBARanking: 9,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Brazil",
      ISOCode: "BRA",
      FIBARanking: 12,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Japan",
      ISOCode: "JPN",
      FIBARanking: 26,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
  ],
  C: [
    {
      Team: "Sjedinjene Države",
      ISOCode: "USA",
      FIBARanking: 1,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Srbija",
      ISOCode: "SRB",
      FIBARanking: 4,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Južni Sudan",
      ISOCode: "SSD",
      FIBARanking: 34,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
    {
      Team: "Puerto Riko",
      ISOCode: "PRI",
      FIBARanking: 16,
      points: 0,
      scored: 0,
      conceded: 0,
      wins: 0,
      defeats: 0,
      "plus-minus": 0,
    },
  ],
};

console.log("----------------POCETAK TURNIRA----------------");

function simulateMatch(team1, team2) {
  const rankDiff = team2.FIBARanking - team1.FIBARanking;
  const team1Advantage = Math.random() * rankDiff;
  const team1Score = Math.floor(Math.random() * 50 + 75 + team1Advantage);
  const team2Score = Math.floor(Math.random() * 50 + 75 - team1Advantage);

  team1.scored += team1Score;
  team1.conceded += team2Score;
  team2.scored += team2Score;
  team2.conceded += team1Score;

  const scoreDiff = team1Score - team2Score;
  team1["plus-minus"] += scoreDiff;
  team2["plus-minus"] -= scoreDiff;

  if (team1Score > team2Score) {
    team1.points += 2;
    team1.wins += 1;
    team2.points += 1;
    team2.defeats += 1;
  } else {
    team1.points += 1;
    team1.defeats += 1;
    team2.points += 2;
    team2.wins += 1;
  }

  return `${team1.Team} - ${team2.Team} (${team1Score}:${team2Score})`;
}

console.log("\n\n----------------GRUPNA FAZA----------------\n");

function simulateGroup(group) {
  const results = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      results.push(simulateMatch(group[i], group[j]));
    }
  }
  return results;
}

function rankTeams(group) {
  return group.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.points !== a.points) return b.points - a.points;
    if (b["plus-minus"] !== a["plus-minus"])
      return b["plus-minus"] - a["plus-minus"];
    const goalDifferenceA = a.scored - a.conceded;
    const goalDifferenceB = b.scored - b.conceded;
    if (goalDifferenceB !== goalDifferenceA)
      return goalDifferenceB - goalDifferenceA;
    return b.scored - a.scored;
  });
}

const firstPlaced = [];
const secondPlaced = [];
const thirdPlaced = [];

for (let group in groups) {
  console.log(`Grupa ${group}:`);
  const results = simulateGroup(groups[group]);
  results.forEach((result) => console.log(` ${result}`));
  console.log("\n-----------\n");
}

console.log("\n------------ RANGIRANJE U GRUPAMA ------------\n");

for (let group in groups) {
  const rankedTeams = rankTeams(groups[group]);
  console.log(`\nKonačno rangiranje u Grupi ${group}:`);
  rankedTeams.forEach((team, index) => {
    console.log(
      `${index + 1}. ${team.Team} - Pobede: ${team.wins} / Porazi: ${
        team.defeats
      } / Bodovi: ${team.points} / Postignuti kosevi: ${
        team.scored
      } / Primljeni kosevi: ${team.conceded} / Plus-Minus: ${
        team["plus-minus"]
      }`
    );
  });

  firstPlaced.push(rankedTeams[0]);
  secondPlaced.push(rankedTeams[1]);
  thirdPlaced.push(rankedTeams[2]);
}

function rankOverall(teams) {
  return teams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b["plus-minus"] !== a["plus-minus"])
      return b["plus-minus"] - a["plus-minus"];
    return b.scored - a.scored;
  });
}

const rankedFirstPlaced = rankOverall(firstPlaced);
const rankedSecondPlaced = rankOverall(secondPlaced);
const rankedThirdPlaced = rankOverall(thirdPlaced);

const overallRanking = [
  ...rankedFirstPlaced,
  ...rankedSecondPlaced,
  ...rankedThirdPlaced,
];

console.log("\n------------ KONAČNO RANGIRANJE ------------\n");
overallRanking.forEach((team, index) => {
  console.log(`${index + 1}. ${team.Team} - Rang: ${index + 1}`);
});

const advancingTeams = overallRanking.slice(0, 8);
const eliminatedTeam = overallRanking[8];

console.log(
  "\n------------ TIMOVI KOJI PROLAZE U ELIMINACIONU FAZU ------------\n"
);
advancingTeams.forEach((team, index) => {
  console.log(`${index + 1}. ${team.Team}`);
});

console.log(`\nEkipa koja ne nastavlja takmičenje: ${eliminatedTeam.Team}`);

console.log(
  "\n---------------------------- ŽREB ------------------------------\n"
);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function canPlay(team1, team2, groupMatchups) {
  return !groupMatchups.some(
    (match) => match.includes(team1.Team) && match.includes(team2.Team)
  );
}

function createQuarterFinalPairs(hat1, hat2, groupMatchups) {
  const pairs = [];
  const availableHat2Teams = [...hat2];

  for (let team of hat1) {
    shuffleArray(availableHat2Teams);
    let opponent = availableHat2Teams.find((opponent) =>
      canPlay(team, opponent, groupMatchups)
    );

    if (opponent) {
      pairs.push({
        pair: `${team.Team} vs ${opponent.Team}`,
        teams: [team, opponent],
      });
      availableHat2Teams.splice(availableHat2Teams.indexOf(opponent), 1);
    } else {
      return null; // Ako ne možemo naći valjanog protivnika, vratiti null
    }
  }

  return pairs;
}

function createSemiFinalPairs(quarterFinalPairs1, quarterFinalPairs2) {
  const semiFinalPairs = [];
  shuffleArray(quarterFinalPairs1);
  shuffleArray(quarterFinalPairs2);

  for (let i = 0; i < quarterFinalPairs1.length; i++) {
    semiFinalPairs.push({
      match: `${quarterFinalPairs1[i].pair} vs ${quarterFinalPairs2[i].pair}`,
    });
  }

  return semiFinalPairs;
}

// Generisanje grupnih matchupa dinamički iz grupnih podataka
function generateGroupMatchups(groups) {
  const matchups = [];
  for (const group in groups) {
    const teams = groups[group];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matchups.push([teams[i].Team, teams[j].Team]);
      }
    }
  }
  return matchups;
}

// Generisanje grupnih matchupa na osnovu grupnih podataka
const groupMatchups = generateGroupMatchups(groups);

// Kreiranje šešira na osnovu rangiranja
const hatD = advancingTeams.slice(0, 2);
const hatE = advancingTeams.slice(2, 4);
const hatF = advancingTeams.slice(4, 6);
const hatG = advancingTeams.slice(6, 8);

// Prikaz šešira
console.log("Šeširi:");
console.log("    Šešir D");
hatD.forEach((team) => console.log(`        ${team.Team}`));
console.log("    Šešir E");
hatE.forEach((team) => console.log(`        ${team.Team}`));
console.log("    Šešir F");
hatF.forEach((team) => console.log(`        ${team.Team}`));
console.log("    Šešir G");
hatG.forEach((team) => console.log(`        ${team.Team}`));

// Kreiranje parova četvrtfinala sa proverom da se timovi nisu ranije susreli
let quarterFinalPairs1 = createQuarterFinalPairs(hatD, hatG, groupMatchups);
let quarterFinalPairs2 = createQuarterFinalPairs(hatE, hatF, groupMatchups);

// Ako ne možemo validno ukrstiti parove zbog restrikcija, ponavljamo proces
while (!quarterFinalPairs1 || !quarterFinalPairs2) {
  shuffleArray(hatD);
  shuffleArray(hatE);
  shuffleArray(hatF);
  shuffleArray(hatG);
  quarterFinalPairs1 = createQuarterFinalPairs(hatD, hatG, groupMatchups);
  quarterFinalPairs2 = createQuarterFinalPairs(hatE, hatF, groupMatchups);
}

// Prikaz parova za četvrtfinale
console.log("\nEliminaciona faza:");
quarterFinalPairs1.forEach((pair) => {
  console.log(`    ${pair.pair}`);
});
quarterFinalPairs2.forEach((pair) => {
  console.log(`    ${pair.pair}`);
});

// Kreiranje parova polufinala
let semiFinalPairs = createSemiFinalPairs(
  quarterFinalPairs1,
  quarterFinalPairs2
);

console.log("\nParovi za polufinale:");
semiFinalPairs.forEach((match, index) => {
  console.log(`Par ${index + 1}: ${match.match}`);
});

console.log(
  "\n---------------------------- ELIMINACIONA FAZA ------------------------------\n"
);

// Definišemo funkciju playEliminationRound pre nego što je koristimo
function playEliminationRound(pairs) {
  const results = [];
  const nextRoundTeams = [];

  pairs.forEach((pair) => {
    const matchResult = simulateMatch(pair.teams[0], pair.teams[1]);
    results.push(matchResult);
    const winner = matchResult.includes(pair.teams[0].Team)
      ? pair.teams[0]
      : pair.teams[1];
    nextRoundTeams.push(winner);
  });

  return { results, nextRoundTeams };
}

function playBronzeMatch(team1, team2) {
  return simulateMatch(team1, team2);
}

// Simulacija četvrtfinala
console.log("\nČetvrtfinale:");
const quarterFinalResults1 = playEliminationRound(quarterFinalPairs1);
const quarterFinalResults2 = playEliminationRound(quarterFinalPairs2);
quarterFinalResults1.results
  .concat(quarterFinalResults2.results)
  .forEach((result) => console.log(`    ${result}`));

// Priprema za polufinale
const semiFinalTeams = quarterFinalResults1.nextRoundTeams.concat(
  quarterFinalResults2.nextRoundTeams
);

// Simulacija polufinala
console.log("\nPolufinale:");
semiFinalPairs = [
  { teams: [semiFinalTeams[0], semiFinalTeams[1]] },
  { teams: [semiFinalTeams[2], semiFinalTeams[3]] },
];
const semiFinalResults = playEliminationRound(semiFinalPairs);
semiFinalResults.results.forEach((result) => console.log(`    ${result}`));

// Prepoznavanje pobednika i gubitnika polufinala
const finalists = semiFinalResults.nextRoundTeams;
const bronzeMatchTeams = semiFinalTeams.filter(
  (team) => !finalists.includes(team)
);

// Simulacija utakmice za treće mesto
console.log("\nUtakmica za treće mesto:");
const bronzeMatchResult = playBronzeMatch(
  bronzeMatchTeams[0],
  bronzeMatchTeams[1]
);
console.log(`    ${bronzeMatchResult}`);

// Simulacija finala
console.log("\nFinale:");
const finalResult = simulateMatch(finalists[0], finalists[1]);
console.log(`    ${finalResult}`);

// Prikaz osvojenih medalja
console.log("\nMedalje:");
const finalWinner = finalResult.includes(finalists[0].Team)
  ? finalists[0].Team
  : finalists[1].Team;
const finalLoser = finalResult.includes(finalists[0].Team)
  ? finalists[1].Team
  : finalists[0].Team;
const bronzeWinner = bronzeMatchResult.includes(bronzeMatchTeams[0].Team)
  ? bronzeMatchTeams[0].Team
  : bronzeMatchTeams[1].Team;

console.log(`    1. ${finalWinner}`);
console.log(`    2. ${finalLoser}`);
console.log(`    3. ${bronzeWinner}`);

console.log("\n\n----------------KRAJ TURNIRA----------------");
console.log("----------------KRAJ TURNIRA----------------");
console.log("----------------KRAJ TURNIRA----------------");
console.log("----------------KRAJ TURNIRA----------------");
