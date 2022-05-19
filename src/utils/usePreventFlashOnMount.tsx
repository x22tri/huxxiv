import { useEffect, useState } from 'react'

const usePreventFlashOnMount = () => {
  const [preventFlash, setPreventFlash] = useState(true)

  useEffect(() => {
    let timer = setTimeout(() => {
      setPreventFlash(false)
    }, 500) // The timeout cannot be shorter than the flash or else the flash will still be visible.

    return () => clearTimeout(timer)
  }, [])

  return preventFlash ? 0 : 0.5
}

// A dynamic style attribute that shows a yellow flash when an element appears.
// Has to be placed next to the element (which should have the className "flash"), at the same level.
const Flash = ({ preventFlashOnMount }: { preventFlashOnMount: number }) => (
  <style type='text/css'>
    {`.flash {
            border-radius: 4px;
            animation: yellow-fade ${preventFlashOnMount}s ease-in-out 0s;
          }`}
  </style>
)

export { usePreventFlashOnMount, Flash }
