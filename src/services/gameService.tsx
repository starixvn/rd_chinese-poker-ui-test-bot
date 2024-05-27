import { fetchWrapper } from "@/helpers/fetchWrapper";
import { MatchData } from "../interfaces";
import { NewMatchData } from "@/interfaces/NewMatchData";
import { SettleResult, SettleResultMap } from "@/interfaces/SettleResult";

export const gameService = {
  getHandCards,
  getBotArrangement,
  getSettlement,
  getBotSuggestion,
  getNewSettlement,
};

function getHandCards(data: any): Promise<any> {
  return fetchWrapper.post(
    "https://bots.lumigame.com/chinese-poker-game-service/play",
    data
  );
}

function getBotArrangement(data: any, botArr: string): Promise<any> {
  let body = {
    private: {
      player_id: "string",
      arrangement_id: "string",
      input_hash: 0,
      input: [0],
      output: {
        segment_1: [0],
        segment_2: [0],
        segment_3: [0],
      },
    },
    shared: {
      match: {
        id: "string",
        hash_slot_1: 0,
        hash_slot_2: 0,
        hash_slot_3: 0,
        hash_slot_4: 0,
      },
      is_have_output: [],
    },
  };

  body.private.input = data;
  return fetchWrapper.post(botArr + "/move", body);
}

function getBotSuggestion(data: any, botArr: string): Promise<any> {
  let body = {
    private: {
      player_id: "string",
      arrangement_id: "string",
      input_hash: 0,
      input: [0],
      output: {
        segment_1: [0],
        segment_2: [0],
        segment_3: [0],
      },
    },
    shared: {
      match: {
        id: "string",
        hash_slot_1: 0,
        hash_slot_2: 0,
        hash_slot_3: 0,
        hash_slot_4: 0,
      },
      is_have_output: [],
    },
  };

  body.private.input = data;
  return fetchWrapper.post(botArr + "/suggest", body);
}
function getSettlement(data: MatchData): Promise<any> {
  let body = {
    match_id: data.matchId,
    slot_1: {
      arrangement_id: "string",
      player_id: "1",
      hash: data.slot1.hash,
      cards: {
        segment_1: data.slot1.hand1,
        segment_2: data.slot1.hand2,
        segment_3: data.slot1.hand3,
      },
      match_id: data.matchId,
    },
    slot_2: {
      arrangement_id: "string",
      player_id: "2",
      hash: data.slot2.hash,
      cards: {
        segment_1: data.slot2.hand1,
        segment_2: data.slot2.hand2,
        segment_3: data.slot2.hand3,
      },
      match_id: data.matchId,
    },
    slot_3: {
      arrangement_id: "string",
      player_id: "3",
      hash: data.slot3.hash,
      cards: {
        segment_1: data.slot3.hand1,
        segment_2: data.slot3.hand2,
        segment_3: data.slot3.hand3,
      },
      match_id: data.matchId,
    },
    slot_4: {
      arrangement_id: "string",
      player_id: "4",
      hash: data.slot4.hash,
      cards: {
        segment_1: data.slot4.hand1,
        segment_2: data.slot4.hand2,
        segment_3: data.slot4.hand3,
      },
      match_id: data.matchId,
    },
  };

  return fetchWrapper.post(
    "https://bots.lumigame.com/chinese-poker-game-service/settle-game-client",
    body
  );
}

function getNewSettlement(data: NewMatchData): Promise<SettleResultMap> {
  return fetchWrapper.post(
    "https://bots.lumigame.com/chinese-poker-service-rust/settle-game-client",
    data
  );
}
