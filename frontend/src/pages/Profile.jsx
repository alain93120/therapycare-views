import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    description: '',
    phone: '',
    schedule: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.get(`${API}/practitioner/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        full_name: response.data.full_name || '',
        specialty: response.data.specialty || '',
        description: response.data.description || '',
        phone: response.data.phone || '',
        schedule: response.data.schedule || '',
        address: response.data.address || '',
        city: response.data.city || ''
      });
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.put(`${API}/practitioner/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local storage
      const user = JSON.parse(localStorage.getItem('therapycare_user'));
      localStorage.setItem('therapycare_user', JSON.stringify({ ...user, ...response.data }));

      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl" data-testid="profile-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600 mt-1">Modifiez vos informations professionnelles visibles publiquement</p>
      </div>

      <Card className="shadow-md border-0">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700">Nom complet *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  data-testid="profile-name-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Dr. Marie Dupont"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-gray-700">Spécialité *</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  data-testid="profile-specialty-input"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Psychologue"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Description professionnelle</Label>
              <Textarea
                id="description"
                name="description"
                data-testid="profile-description-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Présentez votre parcours, vos méthodes de travail, vos spécialités..."
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  data-testid="profile-phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule" className="text-gray-700">Horaires</Label>
                <Input
                  id="schedule"
                  name="schedule"
                  data-testid="profile-schedule-input"
                  value={formData.schedule}
                  onChange={handleChange}
                  placeholder="Lun-Ven 9h-18h"
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  data-testid="profile-address-input"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Rue de la Santé"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-gray-700">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  data-testid="profile-city-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                data-testid="save-profile-button"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 rounded-lg font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;