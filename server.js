const express = require("express");
const {
  groups,
  simulateGroup,
  rankTeams,
  rankOverall,
  playEliminationRound,
  createQuarterFinalPairs,
  createSemiFinalPairs,
  generateGroupMatchups,
  playBronzeMatch,
  simulateMatch,
} = require("./index");

const app = express();
const PORT = process.env.PORT || 3000;

// API get all groups
app.get("/groups", (req, res) => {
  res.json(groups);
});

// API endpoint simulate matches in group
app.get("/simulate-group/:groupId", (req, res) => {
  const groupId = req.params.groupId.toUpperCase();
  const group = groups[groupId];
  if (group) {
    const results = simulateGroup(group);
    res.json(results);
  } else {
    res.status(404).json({ error: "Group not found" });
  }
});

// API endpoint get ranking within a group
app.get("/rank-group/:groupId", (req, res) => {
  const groupId = req.params.groupId.toUpperCase();
  const group = groups[groupId];
  if (group) {
    const rankedTeams = rankTeams(group);
    res.json(rankedTeams);
  } else {
    res.status(404).json({ error: "Group not found" });
  }
});

app.get("/simulate-tournament", (req, res) => {
  // Step 1: Simulate group stage and collect match results
  let groupResults = "";
  for (let group in groups) {
    groupResults += `Grupa ${group}:\n`;
    const results = simulateGroup(groups[group]);
    results.forEach((result) => {
      groupResults += ` ${result}\n`;
    });
    groupResults += `\n-----------\n\n`;
  }

  // Step 2: Rank teams within each group
  const firstPlaced = [];
  const secondPlaced = [];
  const thirdPlaced = [];
  let rankingResults = "------------ RANGIRANJE U GRUPAMA ------------\n\n";

  for (let group in groups) {
    const rankedTeams = rankTeams(groups[group]);
    rankingResults += `\nKonačno rangiranje u Grupi ${group}:\n`;
    rankedTeams.forEach((team, index) => {
      rankingResults += `${index + 1}. ${team.Team} - Pobede: ${
        team.wins
      } / Porazi: ${team.defeats} / Bodovi: ${
        team.points
      } / Postignuti kosevi: ${team.scored} / Primljeni kosevi: ${
        team.conceded
      } / Plus-Minus: ${team["plus-minus"]}\n`;
    });

    firstPlaced.push(rankedTeams[0]);
    secondPlaced.push(rankedTeams[1]);
    thirdPlaced.push(rankedTeams[2]);
  }

  const rankedFirstPlaced = rankOverall(firstPlaced);
  const rankedSecondPlaced = rankOverall(secondPlaced);
  const rankedThirdPlaced = rankOverall(thirdPlaced);
  const overallRanking = [
    ...rankedFirstPlaced,
    ...rankedSecondPlaced,
    ...rankedThirdPlaced,
  ];

  let finalRanking = "\n------------ KONAČNO RANGIRANJE ------------\n\n";
  overallRanking.forEach((team, index) => {
    finalRanking += `${index + 1}. ${team.Team} - Rang: ${index + 1}\n`;
  });

  const advancingTeams = overallRanking.slice(0, 8);
  const eliminatedTeam = overallRanking[8];

  let advancingTeamsResult =
    "\n------------ TIMOVI KOJI PROLAZE U ELIMINACIONU FAZU ------------\n\n";
  advancingTeams.forEach((team, index) => {
    advancingTeamsResult += `${index + 1}. ${team.Team}\n`;
  });

  advancingTeamsResult += `\nEkipa koja ne nastavlja takmičenje: ${eliminatedTeam.Team}\n`;

  const groupMatchups = generateGroupMatchups(groups);

  const hatD = advancingTeams.slice(0, 2);
  const hatE = advancingTeams.slice(2, 4);
  const hatF = advancingTeams.slice(4, 6);
  const hatG = advancingTeams.slice(6, 8);

  let quarterFinalPairs1 = createQuarterFinalPairs(hatD, hatG, groupMatchups);
  let quarterFinalPairs2 = createQuarterFinalPairs(hatE, hatF, groupMatchups);

  while (!quarterFinalPairs1 || !quarterFinalPairs2) {
    quarterFinalPairs1 = createQuarterFinalPairs(hatD, hatG, groupMatchups);
    quarterFinalPairs2 = createQuarterFinalPairs(hatE, hatF, groupMatchups);
  }

  let drawResult =
    "\n---------------------------- ŽREB ------------------------------\n\n";

  drawResult += "Šeširi:\n";
  drawResult += "    Šešir D\n";
  hatD.forEach((team) => (drawResult += `        ${team.Team}\n`));
  drawResult += "    Šešir E\n";
  hatE.forEach((team) => (drawResult += `        ${team.Team}\n`));
  drawResult += "    Šešir F\n";
  hatF.forEach((team) => (drawResult += `        ${team.Team}\n`));
  drawResult += "    Šešir G\n";
  hatG.forEach((team) => (drawResult += `        ${team.Team}\n`));

  drawResult += "\nEliminaciona faza:\n";
  quarterFinalPairs1.forEach((pair) => {
    drawResult += `    ${pair.pair}\n`;
  });
  quarterFinalPairs2.forEach((pair) => {
    drawResult += `    ${pair.pair}\n`;
  });

  let eliminationResults =
    "\n---------------------------- ELIMINACIONA FAZA ------------------------------\n\n";

  eliminationResults += "Četvrtfinale:\n";
  const quarterFinalResults1 = playEliminationRound(quarterFinalPairs1);
  const quarterFinalResults2 = playEliminationRound(quarterFinalPairs2);
  const semiFinalTeams = [
    ...quarterFinalResults1.nextRoundTeams,
    ...quarterFinalResults2.nextRoundTeams,
  ];

  quarterFinalResults1.results
    .concat(quarterFinalResults2.results)
    .forEach((result) => (eliminationResults += `    ${result}\n`));

  const semiFinalPairs = [
    { teams: [semiFinalTeams[0], semiFinalTeams[1]] },
    { teams: [semiFinalTeams[2], semiFinalTeams[3]] },
  ];
  const semiFinalResults = playEliminationRound(semiFinalPairs);

  eliminationResults += "\nPolufinale:\n";
  semiFinalResults.results.forEach((result) => {
    eliminationResults += `    ${result}\n`;
  });

  const finalists = semiFinalResults.nextRoundTeams;
  const bronzeMatchTeams = semiFinalTeams.filter(
    (team) => !finalists.includes(team)
  );

  eliminationResults += "\nUtakmica za treće mesto:\n";
  const bronzeMatchResult = playBronzeMatch(
    bronzeMatchTeams[0],
    bronzeMatchTeams[1]
  );
  eliminationResults += `    ${bronzeMatchResult}\n`;

  eliminationResults += "\nFinale:\n";
  const finalResult = simulateMatch(finalists[0], finalists[1]);
  eliminationResults += `    ${finalResult}\n`;

  let medalResults = "\nMedalje:\n";

  const finalScores = finalResult.match(/\((\d+):(\d+)\)$/);
  const finalScoreTeam1 = parseInt(finalScores[1]);
  const finalScoreTeam2 = parseInt(finalScores[2]);

  const bronzeScores = bronzeMatchResult.match(/\((\d+):(\d+)\)$/);
  const bronzeScoreTeam1 = parseInt(bronzeScores[1]);
  const bronzeScoreTeam2 = parseInt(bronzeScores[2]);

  const goldMedalist =
    finalScoreTeam1 > finalScoreTeam2 ? finalists[0].Team : finalists[1].Team;
  const silverMedalist =
    finalScoreTeam1 > finalScoreTeam2 ? finalists[1].Team : finalists[0].Team;
  const bronzeMedalist =
    bronzeScoreTeam1 > bronzeScoreTeam2
      ? bronzeMatchTeams[0].Team
      : bronzeMatchTeams[1].Team;

  medalResults += `    1. ${goldMedalist}\n`;
  medalResults += `    2. ${silverMedalist}\n`;
  medalResults += `    3. ${bronzeMedalist}\n`;

  const finalResults =
    groupResults +
    rankingResults +
    finalRanking +
    advancingTeamsResult +
    drawResult +
    eliminationResults +
    medalResults;
  res.setHeader("Content-Type", "text/plain");
  res.send(finalResults);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
