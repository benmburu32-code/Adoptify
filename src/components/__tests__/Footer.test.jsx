import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Footer from '../Footer.jsx'

describe('Footer', () => {
  it('shows the brand line and copyright year', () => {
    const { getByText } = render(<Footer />)
    expect(getByText(/find your new best friend/i)).toBeInTheDocument()
    expect(getByText(/2026/)).toBeInTheDocument()
  })
})
