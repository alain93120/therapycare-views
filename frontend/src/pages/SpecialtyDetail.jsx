import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Search, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SpecialtyDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [practitioners, setPractitioners] = useState([]);

  useEffect(() => {
    fetchSpecialtyDetail();
    fetchPractitioners();
  }, [name]);

  const fetchSpecialtyDetail = async () => {
    try {
      const response = await axios.get(`${API}/specialties/${encodeURIComponent(name)}`);
      setSpecialty(response.data);
    } catch (error) {
      console.error('Erreur chargement spécialité');
    } finally {
      setLoading(false);
    }
  };

  const fetchPractitioners = async () => {
    try {
      const response = await axios.get(`${API}/public/practitioners?specialty=${encodeURIComponent(name)}`);
      setPractitioners(response.data);
    } catch (error) {
      console.error('Erreur chargement praticiens');
    }
  };

  const handleSearch = () => {
    navigate(`/recherche?specialty=${encodeURIComponent(name)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <Card className="p-8 shadow-lg border-0">
          <p className="text-gray-600 mb-4">Spécialité non trouvée</p>
          <Link to="/specialites">
            <Button className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl">
              Retour aux spécialités
            </Button>
          </Link>
        </Card>
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

            <div className="flex items-center space-x-4">
              <Link to="/specialites">
                <Button variant="ghost" className="text-gray-700 hover:text-[#3FA9F5]">Spécialités</Button>
              </Link>
              <Link to="/recherche">
                <Button variant="ghost" className="text-gray-700 hover:text-[#3FA9F5]">Rechercher</Button>
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl">Connexion</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/specialites" className="inline-flex items-center text-gray-600 hover:text-[#3FA9F5] mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux spécialités
        </Link>

        {/* Main Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="p-8 md:p-12">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{specialty.name}</h1>
              {specialty.short_description && (
                <p className="text-xl text-gray-600">{specialty.short_description}</p>
              )}
            </div>

            {/* Description */}
            {specialty.full_description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {specialty.full_description}
                  </p>
                </div>
              </div>
            )}

            {/* Indications */}
            {specialty.indications && specialty.indications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indications</h2>
                <div className="flex flex-wrap gap-2">
                  {specialty.indications.map((indication, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-[#3FA9F5] hover:bg-blue-200 px-4 py-2 text-sm font-medium"
                    >
                      {indication}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Methods */}
            {specialty.methods && specialty.methods.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Méthodes utilisées</h2>
                <div className="flex flex-wrap gap-2">
                  {specialty.methods.map((method, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 text-sm font-medium"
                    >
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-200">
              <Button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl h-14 text-lg font-medium shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Trouver un praticien {specialty.name}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Practitioners count */}
        {practitioners.length > 0 && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-[#3FA9F5]/10 to-[#6FD0C5]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-semibold">
                    {practitioners.length} praticien{practitioners.length > 1 ? 's' : ''} disponible{practitioners.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Trouvez le professionnel qui vous correspond
                  </p>
                </div>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="border-2 border-[#3FA9F5] text-[#3FA9F5] hover:bg-[#3FA9F5]/10 rounded-xl"
                >
                  Voir tous les praticiens
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SpecialtyDetail;
