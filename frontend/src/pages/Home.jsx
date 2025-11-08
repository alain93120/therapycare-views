import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Calendar, UserCheck, Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = () => {
    // Navigate to search results (could be implemented later)
    console.log('Searching for:', { specialty, city });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TherapyCare</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Accueil</Link>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 font-medium transition">Comment ça marche</a>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium transition">Professionnels</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" data-testid="header-login-btn" className="text-gray-700 hover:text-blue-600">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button data-testid="header-register-btn" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Inscription praticien</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Trouvez votre praticien en quelques clics
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-10">
              Réservez un rendez-vous avec un professionnel de santé près de chez vous
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-left">Spécialité</label>
                  <Select onValueChange={setSpecialty}>
                    <SelectTrigger data-testid="specialty-select" className="bg-gray-50">
                      <SelectValue placeholder="Psychologue, Psychiatre..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="psychologue">Psychologue</SelectItem>
                      <SelectItem value="psychiatre">Psychiatre</SelectItem>
                      <SelectItem value="therapie-familiale">Thérapeute familial</SelectItem>
                      <SelectItem value="sophrologue">Sophrologue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 block text-left">Ville</label>
                  <Input
                    data-testid="city-input"
                    placeholder="Paris, Lyon, Marseille..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    data-testid="search-btn"
                    onClick={handleSearch}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600">Prenez rendez-vous en 3 étapes simples</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Recherchez</h3>
              <p className="text-gray-600">Trouvez un praticien selon votre spécialité et votre localisation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Consultez</h3>
              <p className="text-gray-600">Découvrez le profil, les horaires et les disponibilités du praticien</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Réservez</h3>
              <p className="text-gray-600">Prenez rendez-vous en ligne en quelques clics seulement</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Vous êtes praticien ?</h2>
          <p className="text-blue-100 text-lg mb-8">Rejoignez TherapyCare et gérez vos rendez-vous facilement</p>
          <Link to="/register">
            <Button data-testid="cta-register-btn" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg text-lg px-8 py-6">
              Créer mon compte professionnel
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">TherapyCare</span>
              </div>
              <p className="text-gray-600 text-sm">La plateforme de prise de rendez-vous pour professionnels de santé</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Patients</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Trouver un praticien</a></li>
                <li><a href="#" className="hover:text-blue-600">Spécialités</a></li>
                <li><a href="#" className="hover:text-blue-600">Comment ça marche</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Professionnels</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/register" className="hover:text-blue-600">Inscription</Link></li>
                <li><Link to="/login" className="hover:text-blue-600">Connexion</Link></li>
                <li><a href="#" className="hover:text-blue-600">Tarifs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/a-propos" className="hover:text-blue-600">Qui sommes-nous</Link></li>
                <li><Link to="/a-propos#cgu" className="hover:text-blue-600">CGU</Link></li>
                <li><Link to="/a-propos#contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 TherapyCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;