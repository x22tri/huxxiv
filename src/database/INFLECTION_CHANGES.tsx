import { InflectionChange } from '../types'

const STEM = '%STEM%'
const PLURAL_STEM = '%PLURAL_STEM%'

const INFLECTION_CHANGES: InflectionChange[] = [
  {
    id: 1,
    targetForm: 'dat_sg',
    change: `${STEM} számára`,
    appears: [2001, 2050],
  },
  {
    id: 2,
    targetForm: 'dat_pl',
    change: `${PLURAL_STEM} számára`,
    appears: [2001, 2050],
  },
]

export default INFLECTION_CHANGES
