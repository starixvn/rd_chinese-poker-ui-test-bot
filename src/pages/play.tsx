import Head from "next/head";
import { Box, Button, CircularProgress, Container, Grid } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Slot } from "../components/Slot";
import { gameService } from "@/services/gameService";
import { CheckCircle, KeyboardReturn } from "@mui/icons-material";
import { initialMatchData, initialMatchResult } from "../interfaces";
import { GameResult } from "@/components/GameResult";

export default function Home() {
  const [bot1, setBot1] = useState([] as number[]);
  const [bot2, setBot2] = useState([] as number[]);
  const [bot3, setBot3] = useState([] as number[]);
  const [player, setPlayer] = useState([] as number[]);
  const [playerSlot1, setPlayerSlot1] = useState([] as number[]);
  const [playerSlot2, setPlayerSlot2] = useState([] as number[]);
  const [playerSlot3, setPlayerSlot3] = useState([] as number[]);
  const [activeSlot, setActiveSlot] = useState(1);
  const [gameData, setGameData] = useState(initialMatchData);
  const [gameResult, setGameResult] = useState(initialMatchResult);
  const [isLoadingBot1, setIsLoadingBot1] = useState(true);
  const [isLoadingBot2, setIsLoadingBot2] = useState(true);
  const [isLoadingBot3, setIsLoadingBot3] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettled, setIsSettled] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  async function getData() {
    const body = ["1", "2", "3", "4"];
    let data = await gameService.getHandCards(body);
    if (data) {
      setPlayer(data.player_input["1"].input);
      setBot1(data.player_input["2"].input);
      setBot2(data.player_input["3"].input);
      setBot3(data.player_input["4"].input);
      gameData.matchId = data.match_id;
      gameData.slot1.hash = data.player_input["1"].hash;
      gameData.slot2.hash = data.player_input["2"].hash;
      gameData.slot3.hash = data.player_input["3"].hash;
      gameData.slot4.hash = data.player_input["4"].hash;

      setIsLoading(false);
    }
  }

  async function getBotArrangement(bot: string, data: number[]) {
    if (data.length == 13) {
      let result = await gameService.getBotArrangement(data);
      if (result) {
        switch (bot) {
          case "bot1":
            gameData.slot2.hand1 = result.output.segment_1;
            gameData.slot2.hand2 = result.output.segment_2;
            gameData.slot2.hand3 = result.output.segment_3;
            setIsLoadingBot1(false);
            break;
          case "bot2":
            gameData.slot3.hand1 = result.output.segment_1;
            gameData.slot3.hand2 = result.output.segment_2;
            gameData.slot3.hand3 = result.output.segment_3;
            setIsLoadingBot2(false);
            break;
          case "bot3":
            gameData.slot4.hand1 = result.output.segment_1;
            gameData.slot4.hand2 = result.output.segment_2;
            gameData.slot4.hand3 = result.output.segment_3;
            setIsLoadingBot3(false);
            break;
        }
      }
    }
  }

  useEffect(() => {
    if (isLoading) {
      getData();
    }
    getBotArrangement("bot1", bot1);
    getBotArrangement("bot2", bot2);
    getBotArrangement("bot3", bot3);
  }, [bot1, bot2, bot3]);

  const handleOnClickCard = (slot: string, card: number) => {
    if (slot != "Player Cards") {
      player.push(card);
      setPlayer([...player]);
      switch (slot) {
        case "Back Hand":
          setActiveSlot(1);
          removeCardFromSlot(playerSlot1, card, setPlayerSlot1);
          break;
        case "Middle Hand":
          setActiveSlot(2);
          removeCardFromSlot(playerSlot2, card, setPlayerSlot2);
          break;
        case "Front Hand":
          setActiveSlot(3);
          removeCardFromSlot(playerSlot3, card, setPlayerSlot3);
          break;
      }
    } else {
      switch (activeSlot) {
        case 1:
          if (playerSlot1.length < 5) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot1, card, setPlayerSlot1);
          }
          break;
        case 2:
          if (playerSlot2.length < 5) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot2, card, setPlayerSlot2);
          }
          break;
        case 3:
          if (playerSlot3.length < 3) {
            removeCardFromSlot(player, card, setPlayer);
            addCardToSlot(playerSlot3, card, setPlayerSlot3);
          }
          break;
      }
    }
  };

  const removeCardFromSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    let index = data.indexOf(card);
    data.splice(index, 1);
    setSlot([...data]);
  };

  const addCardToSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    data.push(card);
    setSlot([...data]);
  };

  const handleOnClickSlot = (slot: string) => {
    switch (slot) {
      case "Back Hand":
        setActiveSlot(1);
        break;
      case "Middle Hand":
        setActiveSlot(2);
        break;
      case "Front Hand":
        setActiveSlot(3);
        break;
    }
  };

  const handleSwitch = () => {
    let tmp = playerSlot1;
    setPlayerSlot1([...playerSlot2]);
    setPlayerSlot2([...tmp]);
  };

  const handleSubmitHandCard = async () => {
    if (
      player.length == 0 &&
      !isLoadingBot1 &&
      !isLoadingBot2 &&
      !isLoadingBot3
    ) {
      gameData.slot1.hand1 = playerSlot1;
      gameData.slot1.hand2 = playerSlot2;
      gameData.slot1.hand3 = playerSlot3;
      let result = await gameService.getSettlement(gameData);
      setIsSettled(true);
      setIsReturn(false);
      setGameResult({
        slot1: {
          hand1: result["1"].scores.segment_1,
          hand2: result["1"].scores.segment_2,
          hand3: result["1"].scores.segment_3,
          sum: result["1"].scores_sum,
        },
        slot2: {
          hand1: result["2"].scores.segment_1,
          hand2: result["2"].scores.segment_2,
          hand3: result["2"].scores.segment_3,
          sum: result["2"].scores_sum,
        },
        slot3: {
          hand1: result["3"].scores.segment_1,
          hand2: result["3"].scores.segment_2,
          hand3: result["3"].scores.segment_3,
          sum: result["3"].scores_sum,
        },
        slot4: {
          hand1: result["4"].scores.segment_1,
          hand2: result["4"].scores.segment_2,
          hand3: result["4"].scores.segment_3,
          sum: result["4"].scores_sum,
        },
      });
    }
  };

  const handleSortCards = () => {
    const sortedCards = player.toSorted((a, b) => a - b);
    setPlayer(sortedCards);
  };

  const handlePushCards = () => {
    setPlayerSlot3(player.slice(0, 3));
    setPlayerSlot2(player.slice(3, 8));
    setPlayerSlot1(player.slice(8, 13));
    setPlayer([]);
  };

  return isSettled && !isReturn ? (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Button
              onClick={() => {
                setIsReturn(true);
              }}
            >
              <KeyboardReturn /> Return
            </Button>
            <GameResult matchData={gameData} matchResult={gameResult} />
          </Box>
        </Container>
      </Box>
    </>
  ) : (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box>Bot 1</Box>
                {isLoadingBot1 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}
              </Grid>
              <Grid item xs={4}>
                <Box>Bot 2</Box>
                {isLoadingBot2 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}{" "}
              </Grid>
              <Grid item xs={4}>
                <Box>Bot 3</Box>
                {isLoadingBot3 ? (
                  <CircularProgress />
                ) : (
                  <CheckCircle color="secondary" fontSize="large" />
                )}{" "}
              </Grid>
              <Grid item xs={12}>
                <Slot
                  name="Front Hand"
                  cards={playerSlot3}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 3}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Slot
                  name="Middle Hand"
                  cards={playerSlot2}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 2}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Button onClick={handleSwitch}>switch</Button>
                <Slot
                  name="Back Hand"
                  cards={playerSlot1}
                  handleOnClickCard={handleOnClickCard}
                  active={activeSlot === 1}
                  handleOnClickSlot={handleOnClickSlot}
                />
                <Slot
                  name="Player Cards"
                  cards={player}
                  handleOnClickCard={handleOnClickCard}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 3, mx: 5 }}
                  onClick={handleSortCards}
                >
                  Sort Cards
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 3, mr: 5 }}
                  onClick={handlePushCards}
                >
                  Push
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleSubmitHandCard}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
