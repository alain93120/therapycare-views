import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowRight, Search } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SpecialtiesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoriesDetails, setCategoriesDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all categories
      const categoriesResponse = await axios.get(`${API}/categories`);
      setCategories(categoriesResponse.data);

      // Fetch details for each category
      const details = {};
      for (const category of categoriesResponse.data) {
        const categoryDetail = await axios.get(`${API}/categories/${category.slug}`);
        details[category.slug] = categoryDetail.data;
      }
      setCategoriesDetails(details);
    } catch (error) {
      console.error('Erreur chargement spécialités');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyClick = (specialty) => {
    navigate(`/recherche?specialty=${encodeURIComponent(specialty)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Chargement des spécialités...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] bg-clip-text text-transparent">
                  Therapy
                </span>
                <span className="text-2xl font-bold text-gray-900">Care</span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] rounded-full"></div>
              </div>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#3FA9F5] font-medium transition">Accueil</Link>
              <Link to="/specialites" className="text-[#3FA9F5] font-medium">Spécialités</Link>
              <Link to="/recherche" className="text-gray-700 hover:text-[#3FA9F5] font-medium transition">Rechercher</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-[#3FA9F5]">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl">Inscription</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Toutes nos Spécialités
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez nos {categories.reduce((sum, cat) => sum + cat.specialties_count, 0)} spécialités 
            réparties en {categories.length} catégories
          </p>
          <Link to="/recherche">
            <Button className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl text-lg px-8 py-6">
              <Search className="w-5 h-5 mr-2" />
              Rechercher un praticien
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories & Specialties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {categories.map((category, index) => {
            const details = categoriesDetails[category.slug];
            if (!details) return null;

            return (
              <Card key={category.slug} className="shadow-lg border-0" data-testid={`category-${category.slug}`}>
                <CardHeader className="bg-gradient-to-r from-[#3FA9F5]/10 to-[#6FD0C5]/10 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] rounded-xl flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-2xl">{details.name}</CardTitle>
                      </div>
                      <p className="text-gray-600 text-sm ml-13">{details.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                        <span className="text-2xl font-bold text-[#3FA9F5]">{details.specialties.length}</span>
                        <span className="text-sm text-gray-600 ml-1">spécialités</span>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {details.specialties.map((specialty) => (
                      <Link
                        key={specialty}
                        to={`/specialite/${encodeURIComponent(specialty)}`}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gradient-to-r hover:from-[#3FA9F5]/10 hover:to-[#6FD0C5]/10 rounded-xl transition-all group border border-transparent hover:border-[#3FA9F5]/30"
                        data-testid={`specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <span className="text-gray-900 font-medium text-left">{specialty}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3FA9F5] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Bottom */}
        <div className="mt-12 text-center">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Vous êtes praticien ?</h2>
              <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
                Rejoignez TherapyCare et bénéficiez d'une visibilité optimale auprès de milliers de patients
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-[#3FA9F5] hover:bg-gray-100 rounded-xl text-lg px-8 py-6">
                  Créer mon profil professionnel
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="relative mb-4">
                <span className="text-lg font-bold bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] bg-clip-text text-transparent">
                  Therapy
                </span>
                <span className="text-lg font-bold text-gray-900">Care</span>
                <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] rounded-full"></div>
              </div>
              <p className="text-gray-600 text-sm">La plateforme de prise de rendez-vous pour professionnels de santé</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-[#3FA9F5]">Accueil</Link></li>
                <li><Link to="/specialites" className="hover:text-[#3FA9F5]">Spécialités</Link></li>
                <li><Link to="/recherche" className="hover:text-[#3FA9F5]">Rechercher</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Professionnels</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/register" className="hover:text-[#3FA9F5]">Inscription</Link></li>
                <li><Link to="/login" className="hover:text-[#3FA9F5]">Connexion</Link></li>
                <li><Link to="/app/tarifs" className="hover:text-[#3FA9F5]">Tarifs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/a-propos" className="hover:text-[#3FA9F5]">Qui sommes-nous</Link></li>
                <li><Link to="/a-propos#cgu" className="hover:text-[#3FA9F5]">CGU</Link></li>
                <li><Link to="/a-propos#contact" className="hover:text-[#3FA9F5]">Contact</Link></li>
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

export default SpecialtiesPage;
