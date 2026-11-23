import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePets } from '../usePets.js'

describe('usePets', () => {
  it('loads pets from Firestore', async () => {
    globalThis.fb.getDocs.mockResolvedValue({
      docs: [
        { id: '1', data: () => ({ name: 'Luna', breed: 'Lab' }) },
        { id: '2', data: () => ({ name: 'Milo', breed: 'Cat' }) },
      ],
    })
    const { result } = renderHook(() => usePets())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pets).toHaveLength(2)
    expect(result.current.pets[0].name).toBe('Luna')
    expect(result.current.error).toBeNull()
  })

  it('sets an error when Firestore fails', async () => {
    globalThis.fb.getDocs.mockRejectedValue(new Error('network down'))
    const { result } = renderHook(() => usePets())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('network down')
    expect(result.current.pets).toEqual([])
  })
})
