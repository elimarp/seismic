import { makeNewGameMatch, makeNewPlayer } from '../../test/utils/factories'
import { Match, MEANS_OF_DEATH } from '../domain/models'
import { GAME_TYPES, TEAMS, WORLD_ID } from '../util/constants'
import { MatchRepository } from './match-repository'

const makeSut = () => ({
  sut: new MatchRepository()
})

describe('Match Repository', () => {
  describe('createMatch method', () => {
    test('create first match successfully', () => {
      const { sut } = makeSut()

      const expected = makeNewGameMatch()

      sut.createMatch(expected.createdAt, expected.settings)
      expect(sut.matches.length).toBe(1)
      expect(sut.matches[0]).toBeInstanceOf(Match)
      expect(sut.matches[0]).toStrictEqual(expected)
    })
    test("create match successfully if it's NOT the first", () => {
      const { sut } = makeSut()

      const firstMatch = makeNewGameMatch()
      sut.matches.push(firstMatch)

      const expected = makeNewGameMatch()

      sut.createMatch(expected.createdAt, expected.settings)
      expect(sut.matches.length).toBe(2)
      expect(sut.matches[0]).toBeInstanceOf(Match)
      expect(sut.matches[0]).toStrictEqual(firstMatch)
      expect(sut.matches[1]).toBeInstanceOf(Match)
      expect(sut.matches[1]).toStrictEqual(expected)
    })
  })
  describe('closeLastMatch method', () => {
    test("skip if there's no matches", () => {
      const { sut } = makeSut()

      const serverTime = '7:00'
      const reason = 'any reason'
      sut.closeLastMatch(serverTime, reason)

      expect(sut.matches.length).toBe(0)
    })

    test('close last match successfully', () => {
      const { sut } = makeSut()

      const expected = makeNewGameMatch()
      sut.matches.push(expected)

      const serverTime = '7:00'
      const reason = 'any reason'
      sut.closeLastMatch(serverTime, reason)

      expect(sut.matches.length).toBe(1)
      expect(sut.matches[0]).toEqual({
        ...expected,
        isOpen: false,
        endedAt: serverTime,
        endReason: reason
      })
    })
  })
  describe('getOpenMatch method', () => {
    test("return null if there's no matches", () => {
      const { sut } = makeSut()

      const actual = sut.getOpenMatch()

      expect(sut.matches.length).toBe(0)
      expect(actual).toBe(null)
    })

    test('return null if last match is not open', () => {
      const { sut } = makeSut()

      const lastMatch = makeNewGameMatch()
      lastMatch.isOpen = false
      sut.matches.push(lastMatch)

      const actual = sut.getOpenMatch()

      expect(sut.matches.length).toBe(1)
      expect(sut.matches[0].isOpen).toBe(false)
      expect(actual).toBe(null)
    })

    test('return open match successfully', () => {
      const { sut } = makeSut()

      const openMatch = makeNewGameMatch()
      sut.matches.push(openMatch)

      const actual = sut.getOpenMatch()

      expect(sut.matches.length).toBe(1)
      expect(actual).toEqual(openMatch)
    })
  })

  describe('getPlayer method', () => {
    test("return null if can't find player", () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      match.players.push(makeNewPlayer(2))
      sut.matches.push(match)

      const actual = sut.getPlayer(3)
      const expected = null

      expect(sut.matches[0].players.length).toBe(1)
      expect(actual).toBe(expected)
    })

    test('return player successfully', () => {
      const { sut } = makeSut()

      const expected = makeNewPlayer(2)

      const match = makeNewGameMatch()
      match.players.push(expected)
      sut.matches.push(match)

      const actual = sut.getPlayer(2)

      expect(sut.matches[0].players.length).toBe(1)
      expect(actual).toEqual(expected)
    })
  })

  describe('addPlayer method', () => {
    test("skip if there's no matches", () => {
      const { sut } = makeSut()

      const player = makeNewPlayer(2)
      sut.addPlayer(2, {
        nickname: player.nickname,
        team: TEAMS.TEAM_FREE
      })

      expect(sut.matches.length).toBe(0)
    })

    test("add player successfully if it's the first", () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      sut.matches.push(match)

      const player = makeNewPlayer(2)

      sut.addPlayer(player.inGameId, {
        nickname: player.nickname,
        team: player.team
      })

      expect(sut.matches[0].players.length).toBe(1)
      expect(sut.matches[0].players[0]).toEqual(player)
    })

    test("add player successfully if it's NOT the first", () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      match.players.push(makeNewPlayer(2))
      sut.matches.push(match)

      const player = makeNewPlayer(3)

      sut.addPlayer(player.inGameId, {
        nickname: player.nickname,
        team: player.team
      })

      expect(sut.matches[0].players.length).toBe(2)
      expect(sut.matches[0].players[1]).toEqual(player)
    })
  })

  describe('updatePlayer method', () => {
    test('update player successfully when it finished joining match', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      const player = makeNewPlayer(2)
      match.players.push(player)
      sut.matches.push(match)

      const serverTime = '1:11'
      sut.updatePlayer(player.inGameId, { joinedAt: serverTime })

      expect(sut.matches[0].players[0]).toEqual({
        ...player,
        joinedAt: serverTime
      })
    })

    test('update player successfully when nickname changed', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      const player = makeNewPlayer(2)
      match.players.push(player)
      sut.matches.push(match)

      sut.updatePlayer(player.inGameId, { nickname: 'new-nickname' })

      expect(sut.matches[0].players[0]).toEqual({
        ...player,
        nickname: 'new-nickname'
      })
    })

    test('update player successfully when switched teams', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch({ gameType: GAME_TYPES.CaptureTheFlag })
      const player = makeNewPlayer(2, TEAMS.TEAM_BLUE)
      match.players.push(player)
      sut.matches.push(match)

      sut.updatePlayer(player.inGameId, { team: TEAMS.TEAM_RED })

      expect(sut.matches[0].players[0]).toEqual({
        ...player,
        team: TEAMS.TEAM_RED
      })
    })
  })

  describe('addKill method', () => {
    test('add kill to player successfully', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      const killer = makeNewPlayer(2)
      const victim = makeNewPlayer(3)
      const mod = MEANS_OF_DEATH.MOD_SHOTGUN

      match.players.push(killer, victim)
      sut.matches.push(match)

      sut.addKill(killer.inGameId, victim.inGameId, mod)

      expect(match.totalKills).toBe(1)
      expect(killer.kills).toEqual([
        [victim.inGameId, mod]
      ])
    })
  })

  describe('addSuicide method', () => {
    test('add suicide to player successfully when killed by world', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      const victim = makeNewPlayer(2)
      const mod = MEANS_OF_DEATH.MOD_FALLING

      match.players.push(victim)
      sut.matches.push(match)

      sut.addSuicide(victim.inGameId, WORLD_ID, mod)

      expect(match.totalKills).toBe(1)
      expect(victim.kills.length).toBe(0)
      expect(victim.suicides).toEqual([
        [WORLD_ID, mod]
      ])
    })
    test('add suicide to player successfully when killed itself', () => {
      const { sut } = makeSut()

      const match = makeNewGameMatch()
      const victim = makeNewPlayer(2)
      const mod = MEANS_OF_DEATH.MOD_ROCKET_SPLASH

      match.players.push(victim)
      sut.matches.push(match)

      sut.addSuicide(victim.inGameId, victim.inGameId, mod)

      expect(match.totalKills).toBe(1)
      expect(victim.kills.length).toBe(0)
      expect(victim.suicides).toEqual([
        [victim.inGameId, mod]
      ])
    })
  })
})
