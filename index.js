// const groups = require('./data/groups.json');

// prosiliral sam json objekat
const groups = {
  A: [
    {
      Team: "Kanada",
      ISOCode: "CAN",
      FIBARanking: 7,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Australija",
      ISOCode: "AUS",
      FIBARanking: 5,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Grčka",
      ISOCode: "GRE",
      FIBARanking: 14,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Španija",
      ISOCode: "ESP",
      FIBARanking: 2,
      points: 0,
      scored: 0,
      conceded: 0,
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
    },
    {
      Team: "Francuska",
      ISOCode: "FRA",
      FIBARanking: 9,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Brazil",
      ISOCode: "BRA",
      FIBARanking: 12,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Japan",
      ISOCode: "JPN",
      FIBARanking: 26,
      points: 0,
      scored: 0,
      conceded: 0,
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
    },
    {
      Team: "Srbija",
      ISOCode: "SRB",
      FIBARanking: 4,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Južni Sudan",
      ISOCode: "SSD",
      FIBARanking: 34,
      points: 0,
      scored: 0,
      conceded: 0,
    },
    {
      Team: "Puerto Riko",
      ISOCode: "PRI",
      FIBARanking: 16,
      points: 0,
      scored: 0,
      conceded: 0,
    },
  ],
};

// Funkcija za simulaciju meča
function simulateMatch(team1, team2) {
  const rankDiff = team2.FIBARanking - team1.FIBARanking;
  const team1Advantage = Math.random() * rankDiff;
  const team1Score = Math.floor(Math.random() * 50 + 75 + team1Advantage);
  const team2Score = Math.floor(Math.random() * 50 + 75 - team1Advantage);

  team1.scored += team1Score;
  team1.conceded += team2Score;
  team2.scored += team2Score;
  team2.conceded += team1Score;

  if (team1Score > team2Score) {
    team1.points += 2;
    team2.points += 1;
  } else {
    team1.points += 1;
    team2.points += 2;
  }

  return `${team1.Team} ${team1Score}:${team2Score} ${team2.Team}`;
}

console.log("\n----------------GRUPNA FAZA----------------\n");

// Funkcija za simulaciju svih mečeva u grupi
function simulateGroup(group) {
  const results = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      results.push(simulateMatch(group[i], group[j]));
    }
  }
  return results;
}

// Funkcija za rangiranje timova unutar grupe
function rankTeams(group) {
  return group.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDifferenceA = a.scored - a.conceded;
    const goalDifferenceB = b.scored - b.conceded;
    if (goalDifferenceB !== goalDifferenceA)
      return goalDifferenceB - goalDifferenceA;
    return b.scored - a.scored;
  });
}

/// ------------- GRUPNA FAZA ------------- ///

// Simuliraj sve grupe i rangiraj timove
const firstPlaced = [];
const secondPlaced = [];
const thirdPlaced = [];

for (let group in groups) {
  console.log(`Grupa ${group}:`);
  const results = simulateGroup(groups[group]);
  results.forEach((result) => console.log(` ${result}`));

  const rankedTeams = rankTeams(groups[group]);

  console.log(`\nKonačno rangiranje u Grupi ${group}:`);
  rankedTeams.forEach((team, index) => {
    console.log(
      `${index + 1}. ${team.Team} - Bodovi: ${team.points}, Dato: ${
        team.scored
      }, Primljeno: ${team.conceded}`
    );
  });

  console.log("\n--------------------------------------\n");

  // Čuvanje timova na osnovu njihove pozicije
  firstPlaced.push(rankedTeams[0]);
  secondPlaced.push(rankedTeams[1]);
  thirdPlaced.push(rankedTeams[2]);
}

// Funkcija za rangiranje timova iz svih grupa
function rankAcrossGroups(teams) {
  return teams.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDifferenceA = a.scored - a.conceded;
    const goalDifferenceB = b.scored - b.conceded;
    if (goalDifferenceB !== goalDifferenceA)
      return goalDifferenceB - goalDifferenceA;
    return b.scored - a.scored;
  });
}

// Rangiraj prvoplasirane, drugoplasirane i trećeplasirane timove globalno
const rankedFirstPlaced = rankAcrossGroups(firstPlaced);
const rankedSecondPlaced = rankAcrossGroups(secondPlaced);
const rankedThirdPlaced = rankAcrossGroups(thirdPlaced);

// Kombinuj sve rangirane timove u konačno globalno rangiranje
const finalRanking = [
  ...rankedFirstPlaced,
  ...rankedSecondPlaced,
  ...rankedThirdPlaced,
];

console.log(
  "\n----------------KONAČNO GLOBALNO RANGIRANJE TIMOVA----------------\n"
);

// Prikaz konačnog globalnog rangiranja
console.log("\nKonačno Globalno Rangiranje (1-9):");
finalRanking.forEach((team, index) => {
  console.log(
    `${index + 1}. ${team.Team} - Bodovi: ${team.points}, Dato: ${
      team.scored
    }, Primljeno: ${team.conceded}`
  );
});

console.log("\n\n----------------8 NAJBOLJIH TIMOVA----------------\n\n");

// Prvih 8 timova prolaze u eliminacionu fazu
const top8Teams = finalRanking.slice(0, 8);
console.log("\nTimovi koji prolaze u eliminacionu fazu:");
top8Teams.forEach((team, index) => {
  console.log(`${index + 1}. ${team.Team}`);
});

////// ------------------ ELIMINACIONA FAZA ------------------ //////

/// Četvrtfinala ///
