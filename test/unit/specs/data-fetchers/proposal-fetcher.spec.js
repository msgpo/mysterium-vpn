/* eslint no-unused-expressions: 0 */
import {describe, it, expect} from '../../../helpers/dependencies'
import lolex from 'lolex'
import ProposalFetcher from '../../../../src/app/data-fetchers/proposal-fetcher'
import {nextTick} from '../../../helpers/utils'
import ProposalDTO from '../../../../src/libraries/api/client/dto/proposal'

describe('DataFetchers', () => {
  describe('ProposalFetcher', () => {
    let clock

    before(() => {
      clock = lolex.install()
    })

    after(() => {
      clock.uninstall()
    })

    async function tickWithDelay (duration) {
      clock.tick(duration)
      await nextTick()
    }

    function mockTequilapi (proposals: Array<ProposalDTO>) {
      return {
        findProposals: () => Promise.resolve(proposals)
      }
    }

    const tequilapi = mockTequilapi([
      {id: '0x1'},
      {id: '0x2'}
    ])

    describe('.run', () => {
      it('triggers subscriber callbacks', async () => {
        const fetcher = new ProposalFetcher(tequilapi)
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.run(1001)

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await tickWithDelay(1000)
        expect(counter).to.equal(2)
      })

      it('triggers subscriber callbacks with proposals', async () => {
        const fetcher = new ProposalFetcher(tequilapi)
        let proposals = []

        fetcher.subscribe((fetchedProposals) => {
          proposals = fetchedProposals
        })

        fetcher.run(1001)

        await tickWithDelay(1000)

        expect(proposals[0]).to.deep.equal({id: '0x1'})
        expect(proposals[1]).to.deep.equal({id: '0x2'})
        expect(proposals.length).to.equal(2)
      })

      it('stops', async () => {
        const fetcher = new ProposalFetcher(tequilapi)
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.run(1001)

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await fetcher.stop()

        await tickWithDelay(1000)

        expect(counter).to.equal(1)
      })
    })

    describe('.fetch', () => {
      it('returns proposals', async () => {
        const fetcher = new ProposalFetcher(new TequilApi(adapter))
        const proposals = await fetcher.fetch()

        expect(proposals[0]).to.deep.equal({id: '0x1'})
        expect(proposals[1]).to.deep.equal({id: '0x2'})
        expect(proposals.length).to.equal(2)
      })
    })
  })
})
