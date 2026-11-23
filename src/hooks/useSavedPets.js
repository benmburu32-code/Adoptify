import { useState, useEffect, useCallback } from 'react'

// Where saved pets live in the browser. localStorage keeps them around after a
// refresh and even after closing the tab (unlike useState, which resets).
const STORAGE_KEY = 'adoptify:savedPets'

function readSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupt JSON or storage disabled (private mode) -> start clean.
    return []
  }
}

function writeSaved(pets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pets))
  } catch {
    // Ignore quota / privacy-mode errors — saving in-memory still works.
  }
}

// Compare two values by id as a string. Each argument may be a pet object
// ({ id }) OR a raw id (number/string), so the same helper works whether we
// pass two pets or a pet + an id. Petfinder numeric ids (7) and dog.ceo
// string ids ("ceo-0-123") therefore never collide.
const sameId = (a, b) => String(a?.id ?? a) === String(b?.id ?? b)

/**
 * Saved-pets state backed by localStorage.
 *
 * Returns:
 *   saved       - array of pet objects currently saved
 *   isSaved(id) - boolean
 *   savePet(pet)       - add a pet (no-op if already saved)
 *   removePet(id)      - remove a pet by id
 *   toggleSave(pet)    - add if not saved, remove if saved
 *   clearAll()         - empty the list
 *
 * Every component that uses this hook shares the same localStorage key and
 * stays in sync across tabs via the `storage` event.
 */
export function useSavedPets() {
  // Lazy initial state: read from localStorage once on first render.
  const [saved, setSaved] = useState(readSaved)

  // Persist whenever the list changes (also writes the initial value back
  // once on mount, which is harmless).
  useEffect(() => {
    writeSaved(saved)
  }, [saved])

  // Keep multiple tabs / hook instances in sync: if another tab changes the
  // list, this one picks it up.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY) setSaved(readSaved())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isSaved = useCallback((id) => saved.some((pet) => sameId(pet, id)), [saved])

  const savePet = useCallback((pet) => {
    setSaved((prev) => (prev.some((p) => sameId(p, pet)) ? prev : [pet, ...prev]))
  }, [])

  const removePet = useCallback((id) => {
    setSaved((prev) => prev.filter((pet) => !sameId(pet, id)))
  }, [])

  const toggleSave = useCallback((pet) => {
    setSaved((prev) =>
      prev.some((p) => sameId(p, pet)) ? prev.filter((p) => !sameId(p, pet)) : [pet, ...prev]
    )
  }, [])

  const clearAll = useCallback(() => setSaved([]), [])

  return { saved, isSaved, savePet, removePet, toggleSave, clearAll }
}
