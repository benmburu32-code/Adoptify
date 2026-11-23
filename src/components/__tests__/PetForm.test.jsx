import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PetForm from '../PetForm.jsx'

describe('PetForm', () => {
  it('calls onSubmit with trimmed values and a numeric age', () => {
    const onSubmit = vi.fn()
    render(<PetForm onSubmit={onSubmit} submitLabel="Add pet" />)
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: '  Luna  ' } })
    fireEvent.change(screen.getByLabelText(/Breed/), { target: { value: 'Labrador' } })
    fireEvent.change(screen.getByLabelText(/Age/), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'A lovely dog' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add pet' }))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Luna', breed: 'Labrador', age: 2, photo: '', description: 'A lovely dog',
    })
  })

  it('disables the button and shows "Saving…" while submitting', () => {
    const onSubmit = vi.fn()
    render(<PetForm onSubmit={onSubmit} submitLabel="Save" submitting />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent('Saving…')
  })

  it('prefills the fields when initialValues are given', () => {
    render(
      <PetForm
        onSubmit={() => {}}
        submitLabel="Save changes"
        initialValues={{ name: 'Luna', breed: 'Lab', age: 2, photo: '', description: 'Nice' }}
      />
    )
    expect(screen.getByLabelText(/Name/)).toHaveValue('Luna')
    expect(screen.getByLabelText(/Age/)).toHaveValue(2)
  })
})
