import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Calendar, Phone, MapPin, Clock, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PublicProfile = () => {
  const { id } = useParams();
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        const response = await axios.get(`${API}/public/practitioner/${id}`);
        setPractitioner(response.data);
      } catch (error) {
        toast.error('Praticien non trouvé');
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8">
          <p className="text-gray-600">Praticien non trouvé</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Retour à l'accueil</Link>
        </Card>
      </div>
    );
  }

  const initials = practitioner.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-md border-0" data-testid="public-profile-card">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-24 h-24 border-2 border-blue-100">
                    <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="practitioner-name">
                      {practitioner.full_name}
                    </h1>
                    <p className="text-lg text-blue-600 font-medium mb-4" data-testid="practitioner-specialty">
                      {practitioner.specialty}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {practitioner.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span data-testid="practitioner-phone">{practitioner.phone}</span>
                        </div>
                      )}
                      {practitioner.city && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{practitioner.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            {practitioner.description && (
              <Card className="shadow-md border-0">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line" data-testid="practitioner-description">
                    {practitioner.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Location Map Placeholder */}
            {practitioner.address && (
              <Card className="shadow-md border-0">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Localisation
                  </h2>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center border border-gray-200">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">{practitioner.address}</p>
                      <p className="text-sm mt-1">{practitioner.city}</p>
                      <p className="text-xs mt-2 text-gray-400">Carte Google Maps à intégrer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Schedule */}
            {practitioner.schedule && (
              <Card className="shadow-md border-0 sticky top-4">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Horaires
                    </h3>
                    <p className="text-gray-700" data-testid="practitioner-schedule">
                      {practitioner.schedule}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      data-testid="book-appointment-button"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg font-medium"
                      onClick={() => toast.info('Fonctionnalité de prise de rendez-vous à venir')}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Prendre rendez-vous
                    </Button>
                    
                    {practitioner.phone && (
                      <Button
                        data-testid="contact-button"
                        variant="outline"
                        className="w-full border-2 border-gray-300 hover:bg-gray-50 h-12 rounded-lg font-medium"
                        onClick={() => window.location.href = `tel:${practitioner.phone}`}
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        Contacter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;