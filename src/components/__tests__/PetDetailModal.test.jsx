import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PetDetailModal from '../PetDetailModal.jsx'

const PET = {
  id: 1,
  name: 'Buddy',
  photo: 'b.jpg',
  breed: 'Labrador',
  age: 'Young',
  gender: 'Male',
  city: 'New York',
  state: 'NY',
  description: 'A good boy.',
  url: 'https://www.petfinder.com/dog/1',
}
const DEMO_PET = { ...PET, _source: 'demo' }

function renderModal(overrides = {}) {
  const props = {
    pet: PET,
    isSaved: false,
    onToggleSave: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  }
  return { ...render(<PetDetailModal {...props} />), props }
}

describe('PetDetailModal', () => {
  it('renders nothing when pet is null', () => {
    const { container } = render(<PetDetailModal pet={null} isSaved={false} onToggleSave={() => {}} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the pet details and an Adopt link', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: 'Buddy', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Labrador')).toBeInTheDocument()
    expect(screen.getByText(/New York, NY/)).toBeInTheDocument()
    expect(screen.getByText('A good boy.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Adopt/ })).toHaveAttribute(
      'href',
      'https://www.petfinder.com/dog/1'
    )
    expect(screen.getByRole('button', { name: /Save for later/ })).toBeInTheDocument()
  })

  it('shows a Demo profile badge for demo pets', () => {
    renderModal({ pet: DEMO_PET })
    expect(screen.getByText('Demo profile')).toBeInTheDocument()
  })

  it('calls onToggleSave with the pet when Save is clicked', () => {
    const onToggleSave = vi.fn()
    renderModal({ onToggleSave })
    fireEvent.click(screen.getByRole('button', { name: /Save for later/ }))
    expect(onToggleSave).toHaveBeenCalledWith(PET)
  })

  it('shows the remove button when the pet is already saved', () => {
    renderModal({ isSaved: true })
    expect(screen.getByRole('button', { name: /click to remove/ })).toBeInTheDocument()
  })

  it('calls onClose when Close is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does NOT close when clicking inside the card', () => {
    const onClose = vi.fn()
    renderModal({ onClose })
    fireEvent.click(screen.getByText('A good boy.'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
