import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from '../NotFoundPage.jsx'

describe('NotFoundPage', () => {
  it('renders a link back home', () => {
    render(<MemoryRouter><NotFoundPage /></MemoryRouter>)
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Go back home/i })).toHaveAttribute('href', '/')
  })
})
