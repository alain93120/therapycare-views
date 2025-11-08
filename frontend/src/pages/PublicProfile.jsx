import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Praticien non trouvé</p>
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #F1F5F9 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-2xl" data-testid="public-profile-card">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-blue-100">
                <AvatarFallback className="bg-blue-500 text-white text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="practitioner-name">
                {practitioner.full_name}
              </h1>
              <p className="text-xl text-blue-600 font-medium" data-testid="practitioner-specialty">
                {practitioner.specialty}
              </p>
            </div>

            <div className="space-y-6">
              {practitioner.description && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">À propos</h2>
                  <p className="text-gray-700 leading-relaxed" data-testid="practitioner-description">
                    {practitioner.description}
                  </p>
                </div>
              )}

              {practitioner.schedule && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Horaires
                  </h2>
                  <p className="text-gray-700" data-testid="practitioner-schedule">
                    {practitioner.schedule}
                  </p>
                </div>
              )}

              {practitioner.phone && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact
                  </h2>
                  <p className="text-gray-700" data-testid="practitioner-phone">
                    {practitioner.phone}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                data-testid="book-appointment-button"
                className="flex-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => toast.info('Fonctionnalité de prise de rendez-vous à venir')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prendre rendez-vous
              </Button>
              {practitioner.phone && (
                <Button
                  data-testid="contact-button"
                  variant="outline"
                  className="flex-1 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-medium py-6 transition-all duration-200"
                  onClick={() => window.location.href = `tel:${practitioner.phone}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contacter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfile;