import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Search, MapPin, Star, Video, Home, Building2, 
  CheckCircle, MessageCircle, Calendar, Phone
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FindPractitioner = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('city') || '');

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/public/practitioners`, {
        params: {
          specialty: searchTerm || undefined,
          city: location || undefined
        }
      });
      
      // Filter based on search terms if provided
      let filtered = response.data;
      if (searchTerm) {
        filtered = filtered.filter(p => 
          p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (location) {
        filtered = filtered.filter(p => 
          p.city && p.city.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      setPractitioners(filtered);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPractitioners();
  };

  // Mock data pour enrichir les praticiens (à remplacer par vraies données API)
  const enrichPractitioner = (practitioner) => ({
    ...practitioner,
    verified: true,
    rating: practitioner.rating || 4.8,
    reviewCount: practitioner.reviews_count || 127,
    distance: '2.3 km',
    availability: {
      online: true,
      office: true,
      home: false,
      video: true
    },
    specialtyTags: practitioner.category ? [practitioner.category] : ['Bien-être'],
    nextAvailable: 'Demain 14h30'
  });

  const getSpecialtyColor = (category) => {
    const colors = {
      'psychologie': 'bg-blue-100 text-blue-700 border-blue-200',
      'hypnose': 'bg-purple-100 text-purple-700 border-purple-200',
      'medecines-douces': 'bg-green-100 text-green-700 border-green-200',
      'default': 'bg-teal-100 text-teal-700 border-teal-200'
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Therapy
                </span>
                <span className="text-2xl font-bold text-gray-900">Care</span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Accueil</Link>
              <Link to="/specialites" className="text-gray-700 hover:text-blue-600 font-medium transition">Spécialités</Link>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">Connexion</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Spécialité Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Spécialité, praticien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Localisation */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Ville, code postal..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-14 px-8 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-lg shadow-teal-500/30 transition-all"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {practitioners.length} praticien(s) disponible(s)
          </h1>
          <p className="text-gray-600">
            {location && `près de ${location}`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-gray-200 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun praticien trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setLocation('');
                fetchPractitioners();
              }}
              variant="outline"
              className="border-gray-300"
            >
              Réinitialiser la recherche
            </Button>
          </div>
        ) : (
          /* Practitioners Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practitioners.map((practitioner) => {
              const enriched = enrichPractitioner(practitioner);
              return (
                <Card 
                  key={practitioner.id} 
                  className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-teal-200 rounded-3xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Profile Section */}
                    <div className="flex items-start space-x-4 mb-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                          {practitioner.full_name.charAt(0)}
                        </div>
                        {enriched.verified && (
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle className="w-5 h-5 text-teal-500" />
                          </div>
                        )}
                      </div>

                      {/* Name & Rating */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                          {practitioner.full_name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-teal-500 fill-teal-500" />
                            <span className="text-sm font-semibold text-gray-900 ml-1">
                              {enriched.rating}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              ({enriched.reviewCount})
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                          {practitioner.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Specialty Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {enriched.specialtyTags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className={`${getSpecialtyColor(tag)} border rounded-full px-3 py-1 text-xs font-medium`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{practitioner.city || 'Paris'}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-teal-600 font-medium">{enriched.distance}</span>
                    </div>

                    {/* Availability Icons */}
                    <div className="flex items-center space-x-3 mb-4 py-3 px-4 bg-gray-50 rounded-2xl">
                      {enriched.availability.online && (
                        <div className="flex items-center text-xs text-gray-600" title="Disponible en ligne">
                          <Video className="w-4 h-4 text-teal-500 mr-1" />
                          <span className="hidden lg:inline">Vidéo</span>
                        </div>
                      )}
                      {enriched.availability.office && (
                        <div className="flex items-center text-xs text-gray-600" title="Consultations au cabinet">
                          <Building2 className="w-4 h-4 text-teal-500 mr-1" />
                          <span className="hidden lg:inline">Cabinet</span>
                        </div>
                      )}
                      {enriched.availability.home && (
                        <div className="flex items-center text-xs text-gray-600" title="Visites à domicile">
                          <Home className="w-4 h-4 text-teal-500 mr-1" />
                          <span className="hidden lg:inline">Domicile</span>
                        </div>
                      )}
                    </div>

                    {/* Next Available */}
                    <div className="mb-4 py-2 px-3 bg-teal-50 rounded-xl border border-teal-100">
                      <p className="text-xs text-gray-600">Prochaine disponibilité</p>
                      <p className="text-sm font-semibold text-teal-700">{enriched.nextAvailable}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        onClick={() => navigate(`/praticien/${practitioner.id}`)}
                        className="w-full h-12 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-md shadow-teal-500/20 transition-all"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Prendre rendez-vous
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full h-12 border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 text-gray-700 hover:text-teal-700 rounded-xl font-semibold transition-all"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Poser une question
                      </Button>
                    </div>

                    {/* Contact Info (subtle) */}
                    {practitioner.phone && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center text-xs text-gray-500">
                          <Phone className="w-3 h-3 mr-2" />
                          {practitioner.phone}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPractitioner;
