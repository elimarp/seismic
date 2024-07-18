import { type CloseMatchProtocol } from '../../protocols'
import { ExitOrShutdownEventHandler } from './exit-shutdown'

class MatchRepositoryStub implements CloseMatchProtocol {
  closeLastMatch (serverTime: string, reason?: string): void {}
}
const makeSut = () => {
  const matchRepositoryStub = new MatchRepositoryStub()
  return {
    sut: new ExitOrShutdownEventHandler(matchRepositoryStub),
    matchRepositoryStub
  }
}

describe('Exit/Shutdown Event Handler', () => {
  test('close open game successfully', () => {
    const { sut, matchRepositoryStub } = makeSut()
    const input = 'reason'
    const serverTime = '1:00'

    const spied = jest.spyOn(matchRepositoryStub, 'closeLastMatch')
    sut.handle(serverTime, input)

    expect(spied).toHaveBeenCalledTimes(1)
    expect(spied).toHaveBeenCalledWith(serverTime, input)
  })
})
