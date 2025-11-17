import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search, MapPin, Star, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchPractitioners = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [practitioners, setPractitioners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: searchParams.get('specialty') || '',
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    sort_by: 'rating'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    searchPractitioners();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur chargement cat\u00e9gories');
    }
  };

  const searchPractitioners = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.city) params.append('city', filters.city);
      if (filters.category) params.append('category', filters.category);
      params.append('sort_by', filters.sort_by);

      const response = await axios.get(`${API}/public/practitioners?${params}`);
      setPractitioners(response.data);
    } catch (error) {
      console.error('Erreur recherche praticiens');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.specialty) params.set('specialty', newFilters.specialty);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.category) params.set('category', newFilters.category);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPractitioners();
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-[#3FA9F5]">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl">Inscription praticien</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sp\u00e9cialit\u00e9</label>
                <Input
                  placeholder="Psychologue, Coach..."
                  value={filters.specialty}
                  onChange={(e) => handleFilterChange('specialty', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ville</label>
                <Input
                  placeholder="Paris, Lyon..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cat\u00e9gorie</label>
                <Select value={filters.category} onValueChange={(val) => handleFilterChange('category', val)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Toutes les cat\u00e9gories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les cat\u00e9gories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white h-11 rounded-xl"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filters & Sort */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            <strong>{practitioners.length}</strong> praticien(s) trouv\u00e9(s)
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Trier par:</span>
            <Select value={filters.sort_by} onValueChange={(val) => handleFilterChange('sort_by', val)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Mieux not\u00e9s</SelectItem>
                <SelectItem value="reviews">Plus d'avis</SelectItem>
                <SelectItem value="name">Nom (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : practitioners.length === 0 ? (
          <Card className="text-center py-12 shadow-md border-0">
            <p className="text-gray-600">Aucun praticien trouv\u00e9</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practitioners.map((practitioner) => (
              <Link key={practitioner.id} to={`/praticien/${practitioner.id}`}>
                <Card className="shadow-md border-0 hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <Avatar className="w-16 h-16 border-2 border-gray-100">
                        {practitioner.photo_url ? (
                          <AvatarImage src={practitioner.photo_url} alt={practitioner.full_name} />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white font-bold">
                            {getInitials(practitioner.full_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{practitioner.full_name}</h3>
                        <p className="text-sm text-[#3FA9F5] font-medium">{practitioner.specialty}</p>
                      </div>
                    </div>

                    {practitioner.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{practitioner.description}</p>
                    )}

                    <div className="space-y-2 text-sm">
                      {practitioner.city && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          {practitioner.city}
                        </div>
                      )}

                      {practitioner.rating > 0 && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-gray-900">{practitioner.rating.toFixed(1)}</span>
                          <span className="text-gray-500 ml-1">({practitioner.reviews_count} avis)</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl">
                      <Calendar className="w-4 h-4 mr-2" />
                      Prendre RDV
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPractitioners;
