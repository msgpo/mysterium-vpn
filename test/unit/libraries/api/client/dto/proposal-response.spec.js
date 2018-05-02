import {expect} from 'chai'
import ProposalsResponseDTO from '../../../../../../src/libraries/api/client/dto/proposals-response'

describe('TequilApi client DTO', () => {
  describe('ProposalResponseDto', () => {
    it('sets properties with full structure', async () => {
      const response = new ProposalsResponseDTO({
        proposals: [{id: 100}]
      })

      expect(response.proposals).to.have.lengthOf(1)
      expect(response.proposals[0].id).to.equal(100)
    })

    it('sets empty properties structure', async () => {
      const response = new ProposalsResponseDTO({})

      expect(response.proposals).to.be.undefined
    })

    it('sets wrong properties structure', async () => {
      const response = new ProposalsResponseDTO('I am wrong')

      expect(response.proposals).to.be.undefined
    })
  })
})
