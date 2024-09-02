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

console.log("\n--------------------------------------");

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
