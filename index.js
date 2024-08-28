const groups = require("./groups.json");

console.log("Olimpijske igre - Košarkaški Turnir");
console.log("Grupe i timovi:");
console.log(groups);

function simulateGame(team1, team2) {
  const rankingDifference = team1.FIBARanking - team2.FIBARanking;

  let probabilityTeam1Wins = 0.5 + rankingDifference / 100;

  probabilityTeam1Wins = Math.max(0, Math.min(1, probabilityTeam1Wins));

  const randomOutcome = Math.random();

  const team1Wins = randomOutcome < probabilityTeam1Wins;

  // rez izmedju 80 i 109
  const scoreTeam1 = Math.floor(Math.random() * 30) + 80;
  const scoreTeam2 = Math.floor(Math.random() * 30) + 80;

  return team1Wins
    ? {
        winner: team1.Team,
        loser: team2.Team,
        score: `${scoreTeam1}:${scoreTeam2}`,
      }
    : {
        winner: team2.Team,
        loser: team1.Team,
        score: `${scoreTeam2}:${scoreTeam1}`,
      };
}

function simulateGroupStage(groups) {
  let groupStandings = {};
  for (let group in groups) {
    console.log(`Simulacija utakmica za grupu ${group}:`);

    const teams = groups[group];
    groupStandings[group] = teams.map((team) => ({
      team: team.Team,
      wins: 0,
      losses: 0,
      points: 0,
      pointsScored: 0,
      pointsAgainst: 0,
    }));

    console.log(`Grupna faza - Simulacija utakmica za grupu ${group}:`);
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const gameResult = simulateGame(teams[i], teams[j]);
        console.log(
          `${gameResult.winner} pobedio ${gameResult.loser} (${gameResult.score})`
        );

        const winner = groupStandings[group].find(
          (t) => t.team === gameResult.winner
        );
        const loser = groupStandings[group].find(
          (t) => t.team === gameResult.loser
        );

        if (winner && loser) {
          winner.wins++;
          loser.losses++;
          winner.points += 2;
          loser.points += 1;

          //kosevi
          const [winnerScore, loserScore] = gameResult.score
            .split(":")
            .map(Number);
          winner.pointsScored += winnerScore;
          winner.pointsAgainst += loserScore;
          loser.pointsScored += loserScore;
          loser.pointsAgainst += winnerScore;
        }
      }
    }
    console.log("\n");
  }
  return groupStandings;
}
const finalStandings = simulateGroupStage(groups);

function displayStandings(groupStandings) {
  console.log("Konačan plasman u grupama:");
  for (let group in groupStandings) {
    const standings = groupStandings[group];
    standings.sort((a, b) => {
      //sortiranje po bodovima
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.pointsScored - a.pointsAgainst;
      const diffB = b.pointsScored - b.pointsAgainst;
      if (diffB !== diffA) return diffB - diffA;
      return b.pointsScored - a.pointsScored;
    });
    console.log(`Grupa ${group}:`);
    standings.forEach((team, index) => {
      const diff = team.pointsScored - team.pointsAgainst;
      console.log(
        `${index + 1}. ${team.team} (${team.wins}/${team.losses}) - ${
          team.points
        } bodova, koš razlika: ${diff}`
      );
    });
    console.log("\n");
  }
}

displayStandings(finalStandings);
