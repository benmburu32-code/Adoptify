import { useState } from 'react'

const EMPTY_FORM = { name: '', breed: '', age: '', photo: '', description: '' }

function PetForm({ initialValues = EMPTY_FORM, onSubmit, submitLabel, submitting }) {
  const [form, setForm] = useState(initialValues)

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit({
      name: form.name.trim(),
      breed: form.breed.trim(),
      age: Number(form.age),
      photo: form.photo.trim(),
      description: form.description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-stone-700">Name</label>
        <input id="name" name="name" type="text" required value={form.name} onChange={updateField}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" />
      </div>
      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-stone-700">Breed</label>
        <input id="breed" name="breed" type="text" required value={form.breed} onChange={updateField}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" />
      </div>
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-stone-700">Age (years)</label>
        <input id="age" name="age" type="number" min="0" max="30" required value={form.age} onChange={updateField}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" />
      </div>
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-stone-700">Photo URL <span className="text-stone-400">(optional)</span></label>
        <input id="photo" name="photo" type="url" value={form.photo} onChange={updateField}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-stone-700">Description</label>
        <textarea id="description" name="description" rows="4" required value={form.description} onChange={updateField}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-teal-600 focus:outline-none"></textarea>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

export default PetForm