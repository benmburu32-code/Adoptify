import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Shared Firebase mocks
// ---------------------------------------------------------------------------
// The real app talks to Firebase (auth + Firestore). In tests we NEVER want to
// hit the real network, so we replace the three Firebase modules with fakes.
//
// `vi.hoisted` runs BEFORE any imports, so the `fb` object exists by the time
// the vi.mock factories below run. We then expose `fb` on `globalThis` so any
// test file can drive the fakes (e.g. "make signInWithPopup succeed" or
// "pretend this user is logged in").
const fb = vi.hoisted(() => ({
  // a fake auth instance — setting `currentUser` simulates a logged-in user
  auth: { currentUser: null },

  // ---- firebase/auth fakes ----
  onAuthStateChanged: vi.fn(),
  setPersistence: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),

  // ---- firebase/firestore fakes ----
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  serverTimestamp: vi.fn(),
}))

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: 'mock-app' })),
}))

vi.mock('firebase/auth', () => ({
  getAuth: () => fb.auth,
  GoogleAuthProvider: function GoogleAuthProvider() {},
  onAuthStateChanged: fb.onAuthStateChanged,
  setPersistence: fb.setPersistence,
  browserLocalPersistence: 'LOCAL',
  signInWithEmailAndPassword: fb.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: fb.createUserWithEmailAndPassword,
  updateProfile: fb.updateProfile,
  signOut: fb.signOut,
  signInWithPopup: fb.signInWithPopup,
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: () => ({}),
  addDoc: fb.addDoc,
  updateDoc: fb.updateDoc,
  deleteDoc: fb.deleteDoc,
  getDoc: fb.getDoc,
  getDocs: fb.getDocs,
  doc: fb.doc,
  collection: fb.collection,
  serverTimestamp: fb.serverTimestamp,
}))

// Expose the fakes so test files can control Firebase's behaviour.
globalThis.fb = fb

// Reset every fake back to a sensible default before each test, so tests stay
// independent of one another.
beforeEach(() => {
  fb.auth.currentUser = null

  // wipe any per-test configuration
  for (const key of Object.keys(fb)) {
    const spy = fb[key]
    if (spy && typeof spy.mockReset === 'function') spy.mockReset()
  }

  // re-establish the defaults the app relies on
  fb.setPersistence.mockResolvedValue(undefined)
  fb.signOut.mockResolvedValue(undefined)
  fb.deleteDoc.mockResolvedValue(undefined)
  fb.doc.mockImplementation((db, col, id) => ({ id }))
  fb.collection.mockImplementation((db, col) => ({ col }))
  fb.serverTimestamp.mockReturnValue('SERVER_TIMESTAMP')
  // By default Firebase fires the auth listener immediately with the current
  // user (null), then returns an unsubscribe function — just like the real API.
  fb.onAuthStateChanged.mockImplementation((auth, cb) => {
    cb(fb.auth.currentUser)
    return () => {}
  })
})
