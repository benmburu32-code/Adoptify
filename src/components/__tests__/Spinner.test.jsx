import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Spinner from '../Spinner.jsx'

describe('Spinner', () => {
  it('renders an accessible spinning indicator', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })
})
