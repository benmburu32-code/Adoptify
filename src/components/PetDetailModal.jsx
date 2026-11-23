import { useEffect } from 'react'

const PLACEHOLDER = (name) =>
  `https://placehold.co/600x400/f0fdfa/0f766e?text=${encodeURIComponent(name || 'Pet')}`

/**
 * A modal that shows the full details of a single pet, with an "Adopt" link
 * (opens the real Petfinder listing in a new tab) and a "Save for later"
 * button that toggles whether the pet is saved.
 *
 * Props:
 *   pet            - the normalized pet to show, or null to render nothing
 *   isSaved        - boolean: is THIS pet currently saved?
 *   onToggleSave   - called with `pet` when the save/remove button is clicked
 *   onClose        - called when the user closes the modal (Close button,
 *                    backdrop click, or Escape key)
 */
function PetDetailModal({ pet, isSaved, onToggleSave, onClose }) {
  // Close on Escape. The listener is only attached while a pet is open.
  useEffect(() => {
    if (!pet) return
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [pet, onClose])

  if (!pet) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${pet.name}`}
    >
      {/* stopPropagation so clicking inside the card does NOT close the modal */}
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={pet.photo || PLACEHOLDER(pet.name)}
          alt={`Photo of ${pet.name}`}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="p-6">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl font-bold text-stone-800">{pet.name}</h2>
            {pet._source === 'demo' && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Demo profile
              </span>
            )}
          </div>

          <p className="text-stone-600 mt-1">{pet.breed}</p>
          <p className="text-stone-600">{pet.age} · {pet.gender}</p>
          {pet.city && (
            <p className="text-stone-600 mt-1">📍 {pet.city}, {pet.state}</p>
          )}
          {pet.description && (
            <p className="text-stone-700 mt-4 leading-relaxed">{pet.description}</p>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {pet.url && (
              <a
                href={pet.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-lg"
              >
                Adopt {pet.name} ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => onToggleSave(pet)}
              className={`flex-1 font-semibold px-4 py-2.5 rounded-lg ${
                isSaved
                  ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isSaved ? '✓ Saved — click to remove' : '♡ Save for later'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2.5 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PetDetailModal
