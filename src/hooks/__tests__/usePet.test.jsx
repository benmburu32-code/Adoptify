import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePet } from '../usePet.js'

describe('usePet', () => {
  it('loads a single pet by id', async () => {
    globalThis.fb.getDoc.mockResolvedValue({
      exists: () => true,
      id: '1',
      data: () => ({ name: 'Luna', breed: 'Lab', ownerId: 'u1' }),
    })
    const { result } = renderHook(() => usePet('1'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pet.name).toBe('Luna')
    expect(result.current.notFound).toBe(false)
  })

  it('sets notFound when the pet does not exist', async () => {
    globalThis.fb.getDoc.mockResolvedValue({ exists: () => false })
    const { result } = renderHook(() => usePet('missing'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.notFound).toBe(true)
    expect(result.current.pet).toBeNull()
  })

  it('does nothing when no id is given', async () => {
    const { result } = renderHook(() => usePet(undefined))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pet).toBeNull()
  })
})
