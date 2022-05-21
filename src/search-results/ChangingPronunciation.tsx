import { calculateOpacity } from '../utils/appearance-utils'
import { ConcurrentPronunciation } from '../types'

const ChangingPronunciation = ({
  main,
  newPron,
  oldPron,
  year,
}: {
  main?: Partial<ConcurrentPronunciation>
  newPron?: ConcurrentPronunciation[]
  oldPron?: ConcurrentPronunciation[]
  year: number
}) => (
  <>
    •&nbsp;
    {oldPron &&
      oldPron.map((p, index) => (
        <span
          key={index}
          style={{
            color: `rgba(0, 0, 0, ${calculateOpacity(p, year)}`,
          }}
        >
          {p.old}&nbsp;&gt;&nbsp;
        </span>
      ))}
    {main && (
      <span
        style={{
          color: `rgba(0, 0, 0, ${calculateOpacity(main, year)}`,
        }}
      >
        {main.main}
      </span>
    )}
    {newPron &&
      newPron.map((p, index) => (
        <span
          key={index}
          style={{
            color: `rgba(0, 0, 0, ${calculateOpacity(p, year)}`,
          }}
        >
          &nbsp;&gt;&nbsp;{p.new}
        </span>
      ))}
  </>
)

export default ChangingPronunciation
