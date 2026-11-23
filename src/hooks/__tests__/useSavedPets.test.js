import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSavedPets } from '../useSavedPets.js'

const PET = { id: 1, name: 'Buddy', breed: 'Lab', age: 'Adult' }

describe('useSavedPets', () => {
  beforeEach(() => localStorage.clear())

  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useSavedPets())
    expect(result.current.saved).toEqual([])
    expect(result.current.isSaved(1)).toBe(false)
  })

  it('rehydrates from localStorage on init', () => {
    localStorage.setItem('adoptify:savedPets', JSON.stringify([PET]))
    const { result } = renderHook(() => useSavedPets())
    expect(result.current.saved).toHaveLength(1)
    expect(result.current.isSaved(1)).toBe(true)
  })

  it('savePet adds a pet and marks it saved', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet(PET))
    expect(result.current.saved).toHaveLength(1)
    expect(result.current.isSaved(1)).toBe(true)
  })

  it('does not duplicate a pet that is already saved', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet(PET))
    act(() => result.current.savePet(PET))
    expect(result.current.saved).toHaveLength(1)
  })

  it('toggleSave adds then removes a pet', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.toggleSave(PET))
    expect(result.current.isSaved(1)).toBe(true)
    act(() => result.current.toggleSave(PET))
    expect(result.current.isSaved(1)).toBe(false)
    expect(result.current.saved).toEqual([])
  })

  it('removePet removes a pet by id', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet(PET))
    act(() => result.current.removePet(1))
    expect(result.current.saved).toEqual([])
  })

  it('persists changes to localStorage', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet(PET))
    expect(JSON.parse(localStorage.getItem('adoptify:savedPets'))).toHaveLength(1)
  })

  it('clearAll empties the list', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet(PET))
    act(() => result.current.clearAll())
    expect(result.current.saved).toEqual([])
  })

  it('compares ids as strings so 7 and "7" match', () => {
    const { result } = renderHook(() => useSavedPets())
    act(() => result.current.savePet({ id: 7, name: 'Rex' }))
    expect(result.current.isSaved('7')).toBe(true)
  })
})
