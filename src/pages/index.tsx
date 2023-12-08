import Head from "next/head";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Grid,
} from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BackHand, Slot, StaticHand } from "../components/Slot";
import { gameService } from "@/services/gameService";
import { CheckCircle, ImportExport, Settings } from "@mui/icons-material";
import { isMobileOnly, isIOS } from "react-device-detect";
import { initialMatchData, initialMatchResult } from "../interfaces";
import { SlotResultShow } from "@/components/GameResult";
import { GameSettingsPopup } from "@/components/GameSettingsPopup";
import { DragDropContext, Droppable } from "@/utils/react-beautiful-dnd";
import { DragUpdate, DropResult } from "react-beautiful-dnd";
import { SuggestData } from "@/interfaces/SuggestData";
import { SuggestPopup } from "@/components/SuggestPopup";

export default function Home() {
  const [bot1, setBot1] = useState([] as number[]);
  const [bot2, setBot2] = useState([] as number[]);
  const [bot3, setBot3] = useState([] as number[]);
  const [playerData, setPlayerData] = useState([] as number[]);
  const [suggestData, setSuggestData] = useState([] as SuggestData[]);
  const [playerSlot1, setPlayerSlot1] = useState([] as number[]);
  const [playerSlot2, setPlayerSlot2] = useState([] as number[]);
  const [playerSlot3, setPlayerSlot3] = useState([] as number[]);
  const [gameData, setGameData] = useState(initialMatchData);
  const [gameResult, setGameResult] = useState(initialMatchResult);
  const [isLoadingBot1, setIsLoadingBot1] = useState(true);
  const [isLoadingBot2, setIsLoadingBot2] = useState(true);
  const [isLoadingBot3, setIsLoadingBot3] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettled, setIsSettled] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isSuggested, setIsSuggested] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openArrangement, setOpenArrangement] = useState(true);
  const [openSuggestion, setOpenSuggestion] = useState(false);
  const [startNewGame, setStartNewGame] = useState(0);
  const [dragOVerId, setDragOVerId] = useState<string | null>(null);

  async function getData() {
    const body = ["1", "2", "3", "4"];
    let data = await gameService.getHandCards(body);
    if (data) {
      setPlayerData(data.player_input["1"].input);
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

  async function getBotAddress(bot: string) {
    const item = localStorage.getItem("settings");
    let botArr = "";
    if (item) {
      const settings = JSON.parse(item);
      switch (bot) {
        case "bot1":
          botArr = settings.BotAddress1;
          break;
        case "bot2":
          botArr = settings.BotAddress2;
          break;
        case "bot3":
          botArr = settings.BotAddress3;
          break;
        case "bot4":
          botArr = settings.BotAddress4;
          break;
      }
    }

    return botArr.length > 0
      ? botArr
      : "https://bots.lumigame.com/chinese-poker-bot-combine";
  }

  async function getBotArrangement(bot: string, data: number[]) {
    let botArr = await getBotAddress(bot);
    if (data.length == 13) {
      let result = await gameService.getBotArrangement(data, botArr);
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
      setIsLoadingBot1(true);
      setIsLoadingBot2(true);
      setIsLoadingBot3(true);
      getData();
    }
    handlePushCards();
    getBotArrangement("bot1", bot1);
    getBotArrangement("bot2", bot2);
    getBotArrangement("bot3", bot3);
  }, [bot1, bot2, bot3, startNewGame]);

  const removeCardFromSlot = (
    data: number[],
    card: number,
    setSlot: Dispatch<SetStateAction<number[]>>
  ) => {
    let index = data.indexOf(card);
    data.splice(index, 1);
    setSlot([...data]);
  };

  const handleSwitch = () => {
    let tmp = playerSlot1;
    setPlayerSlot1([...playerSlot2]);
    setPlayerSlot2([...tmp]);
  };

  const handleSubmitHandCard = async () => {
    if (!isLoadingBot1 && !isLoadingBot2 && !isLoadingBot3) {
      gameData.slot1.hand1 = playerSlot1;
      gameData.slot1.hand2 = playerSlot2;
      gameData.slot1.hand3 = playerSlot3;
      let result = await gameService.getSettlement(gameData);
      setIsSettled(true);
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

  const handlePushCards = () => {
    if (playerData.length == 13) {
      setPlayerSlot3(playerData.slice(0, 3));
      setPlayerSlot2(playerData.slice(3, 8));
      setPlayerSlot1(playerData.slice(8, 13));
      setPlayerData([]);
    }
  };

  const handleSuggestCards = async () => {
    if (isSuggested) {
      setOpenSuggestion(true);
    } else {
      setIsSuggesting(true);
      let botArr = await getBotAddress("bot4");
      let data: number[] = [];

      data = [...playerSlot3, ...playerSlot2, ...playerSlot1];

      let result = await gameService.getBotSuggestion(data, botArr);

      if (result) {
        setIsSuggested(true);
        setIsSuggesting(false);
        setSuggestData(result.output);
        setOpenSuggestion(true);
      }
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, combine } = result;
    const card = Number(result.draggableId);
    setDragOVerId(null);
    if (destination) {
      if (destination.droppableId != source.droppableId) {
        let destinationCard = UpdateDestinationSlot(
          destination.index,
          card,
          destination.droppableId
        );

        UpdateSourceSlot(
          source.index,
          card,
          destinationCard,
          source.droppableId
        );
      } else {
        UpdateSameSlot(source.index, destination.index, source.droppableId);
      }
    } else if (combine) {
      let index = -1;
      switch (combine.droppableId) {
        case "DropSlot1":
          index = playerSlot1.indexOf(Number(combine.draggableId));
          break;
        case "DropSlot2":
          index = playerSlot2.indexOf(Number(combine.draggableId));
          break;
        case "DropSlot3":
          index = playerSlot3.indexOf(Number(combine.draggableId));
          break;
      }

      if (index > -1) {
        let destinationCard = UpdateDestinationSlot(
          index,
          card,
          combine.droppableId
        );
        UpdateSourceSlot(
          source.index,
          card,
          destinationCard,
          source.droppableId
        );
      }
    }
  };

  const handleOnDragUpdate = (update: DragUpdate) => {
    setDragOVerId(update.combine ? update.combine.draggableId : null);
  };

  const UpdateDestinationSlot = (
    index: number,
    card: number,
    droppableId: string
  ): number => {
    let destinationCard = -1;

    switch (droppableId) {
      case "DropSlot1":
        destinationCard = playerSlot1[index] ?? destinationCard;
        destinationCard = index == 5 ? playerSlot1[4] : destinationCard;
        addDraggedCardToSlot(playerSlot1, setPlayerSlot1, 5, card, index);
        break;
      case "DropSlot2":
        destinationCard = playerSlot2[index] ?? destinationCard;
        destinationCard = index == 5 ? playerSlot2[4] : destinationCard;
        addDraggedCardToSlot(playerSlot2, setPlayerSlot2, 5, card, index);
        break;
      case "DropSlot3":
        destinationCard = playerSlot3[index] ?? destinationCard;
        destinationCard = index == 3 ? playerSlot3[2] : destinationCard;
        addDraggedCardToSlot(playerSlot3, setPlayerSlot3, 3, card, index);
        break;
    }

    return destinationCard;
  };

  const UpdateSourceSlot = (
    index: number,
    card: number,
    destinationCard: number,
    droppableId: string
  ) => {
    switch (droppableId) {
      case "DropSlot1":
        if (destinationCard > -1) {
          playerSlot1[index] = destinationCard;
          setPlayerSlot1([...playerSlot1]);
        } else {
          removeCardFromSlot(playerSlot1, card, setPlayerSlot1);
        }
        break;
      case "DropSlot2":
        if (destinationCard > -1) {
          playerSlot2[index] = destinationCard;
          setPlayerSlot2([...playerSlot2]);
        } else {
          removeCardFromSlot(playerSlot2, card, setPlayerSlot2);
        }
        break;
      case "DropSlot3":
        if (destinationCard > -1) {
          playerSlot3[index] = destinationCard;
          setPlayerSlot3([...playerSlot3]);
        } else {
          removeCardFromSlot(playerSlot3, card, setPlayerSlot3);
        }
        break;
    }
  };

  const UpdateSameSlot = (
    sourceIndex: number,
    destinationIndex: number,
    droppableId: string
  ) => {
    let orderSlot = [] as number[];
    switch (droppableId) {
      case "DropSlot1":
        orderSlot = reorder(playerSlot1, sourceIndex, destinationIndex);
        setPlayerSlot1([...orderSlot]);
        break;
      case "DropSlot2":
        orderSlot = reorder(playerSlot2, sourceIndex, destinationIndex);
        setPlayerSlot2([...orderSlot]);
        break;
      case "DropSlot3":
        orderSlot = reorder(playerSlot3, sourceIndex, destinationIndex);
        setPlayerSlot3([...orderSlot]);
        break;
    }
  };

  const reorder = (
    arr: number[],
    startIndex: number,
    endIndex: number
  ): number[] => {
    const result = Array.from(arr);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const addDraggedCardToSlot = (
    slotData: number[],
    setSlot: Dispatch<SetStateAction<number[]>>,
    limit: number,
    card: number,
    index: number
  ) => {
    if (index < limit) {
      if (slotData.length > index) {
        slotData[index] = card;
      } else {
        slotData.push(card);
      }
    } else {
      slotData[limit - 1] = card;
    }
    setSlot([...slotData]);
  };

  const handleEditHandCard = () => {
    setIsSettled(false);
    setOpenArrangement(true);
  };

  const handleStartNewGame = () => {
    setStartNewGame(startNewGame + 1);
    setIsLoading(true);
    setIsSettled(false);
    setIsSuggesting(false);
    setIsSuggested(false);
  };

  const handleReady = () => {
    setOpenArrangement(false);
  };

  const handleCloseSuggestion = (item: number) => {
    setPlayerSlot1([...suggestData[item].segment_1]);
    setPlayerSlot2([...suggestData[item].segment_2]);
    setPlayerSlot3([...suggestData[item].segment_3]);
    setOpenSuggestion(false);
  };

  let deviceClass = "";
  if (isMobileOnly) {
    deviceClass = isIOS ? "ios-device" : "android-device";
  }

  return (
    <>
      <Head>
        <title>Chinese Poker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`main ${deviceClass}`}>
        <Button
          className="settings"
          color="primary"
          variant="contained"
          onClick={() => {
            setOpenSettings(true);
          }}
        >
          <Settings sx={{ marginRight: 1 }} /> Settings
        </Button>

        <div className="bot-container">
          <div className="bot-item bot-2">
            <div className="bot-info">
              <span className="bot-name">Bot 2</span>
              {isLoadingBot2 ? (
                <CircularProgress />
              ) : (
                <CheckCircle color="secondary" fontSize="large" />
              )}
            </div>
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot3}
                slotResult={gameResult.slot3}
              />
            ) : (
              <BackHand />
            )}
          </div>
          <div className="bot-item bot-1">
            <div className="bot-info">
              <span className="bot-name">Bot 1</span>
              {isLoadingBot1 ? (
                <CircularProgress />
              ) : (
                <CheckCircle color="secondary" fontSize="large" />
              )}
            </div>
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot2}
                slotResult={gameResult.slot2}
              />
            ) : (
              <BackHand />
            )}
          </div>
          <div className="bot-item bot-3">
            <div className="bot-info">
              <span className="bot-name">Bot 3</span>
              {isLoadingBot3 ? (
                <CircularProgress />
              ) : (
                <CheckCircle color="secondary" fontSize="large" />
              )}
            </div>
            {isSettled ? (
              <SlotResultShow
                slotData={gameData.slot4}
                slotResult={gameResult.slot4}
              />
            ) : (
              <BackHand />
            )}
          </div>
        </div>
        <Dialog open={openArrangement} maxWidth={false} fullWidth>
          <DialogContent className="popup-arrangement">
            <div className="drag-drop-container">
              <DragDropContext
                onDragEnd={handleOnDragEnd}
                onDragUpdate={handleOnDragUpdate}
              >
                <Droppable
                  droppableId="DropSlot3"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Front Hand"
                        cards={playerSlot3}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>
                <Droppable
                  droppableId="DropSlot2"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Middle Hand"
                        cards={playerSlot2}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>

                <Droppable
                  droppableId="DropSlot1"
                  direction="horizontal"
                  isCombineEnabled={true}
                >
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      <Slot
                        name="Back Hand"
                        cards={playerSlot1}
                        dragOverId={dragOVerId}
                      />
                    </Box>
                  )}
                </Droppable>
                <Button
                  style={{
                    display:
                      playerSlot2.length + playerSlot1.length > 0 ? "" : "none",
                  }}
                  variant="contained"
                  size="small"
                  className="btn-switch"
                >
                  <ImportExport onClick={handleSwitch} fontSize="large" />
                </Button>
              </DragDropContext>
            </div>
            <div className="btn-container">
              <Button
                size="large"
                variant="contained"
                color={isSuggesting ? "warning" : "success"}
                onClick={handleSuggestCards}
              >
                {isSuggesting ? "Waiting..." : "Suggest"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleReady}
                size="large"
              >
                Ready
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <SuggestPopup
          data={suggestData}
          openPopup={openSuggestion}
          handleClosePopup={handleCloseSuggestion}
        />

        <div className="main-player">
          {isSettled ? (
            <SlotResultShow
              slotData={gameData.slot1}
              slotResult={gameResult.slot1}
            />
          ) : (
            <StaticHand
              cards={[...playerSlot3, ...playerSlot2, ...playerSlot1]}
            />
          )}
          <div className="button-group">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitHandCard}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditHandCard}
            >
              Rearrange
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={handleStartNewGame}
            >
              New Game
            </Button>
          </div>
        </div>

        <GameSettingsPopup
          title="Settings"
          openPopup={openSettings}
          handleClosePopup={() => {
            setOpenSettings(false);
            setIsSuggested(false);
          }}
        />
      </div>
    </>
  );
}
