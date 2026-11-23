import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import PetsPage from './pages/PetsPage.jsx'
import PetDetailPage from './pages/PetDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AddPetPage from './pages/AddPetPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EditPetPage from './pages/EditPetPage.jsx'
import DiscoverPetsPage from './pages/DiscoverPetsPage.jsx'
import AdoptablePage from './pages/AdoptablePage.jsx'
import SavedPetsPage from './pages/SavedPetsPage.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/add-pet" element={
          <ProtectedRoute><AddPetPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/pets/:id/edit" element={<ProtectedRoute><EditPetPage /></ProtectedRoute>} />
          <Route path="/discover" element={<DiscoverPetsPage />} />
          <Route path="/adoptable" element={<AdoptablePage />} />
          <Route path="/saved" element={<SavedPetsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App