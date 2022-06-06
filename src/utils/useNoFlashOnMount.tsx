import { useEffect, useState } from 'react'

const useNoFlashOnMount = () => {
  const [preventFlash, setPreventFlash] = useState(true)

  useEffect(() => {
    let timer = setTimeout(() => {
      setPreventFlash(false)
    }, 650) // The timeout cannot be shorter than the flash or else the flash will still be visible.

    return () => clearTimeout(timer)
  }, [])

  return preventFlash ? 0 : 0.5
}

// A wrapper that shows a yellow flash when the element wrapped in it appears.
// const preventFlashOnMount = useNoFlashOnMount() has to be initialized in the given component for it to work.
const Flasher = ({
  preventFlashOnMount,
  children,
}: {
  preventFlashOnMount: number
  children: JSX.Element
}) => (
  <>
    <style type='text/css'>
      {`.flash {
            border-radius: 4px;
            animation: yellow-fade ${preventFlashOnMount}s ease-in-out 0s;
          }`}
    </style>
    {children}
  </>
)

export { useNoFlashOnMount, Flasher }
