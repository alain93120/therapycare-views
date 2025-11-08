import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
    schedule: ''
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
        schedule: response.data.schedule || ''
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
    <div className="max-w-3xl mx-auto" data-testid="profile-page">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Mon Profil</CardTitle>
          <CardDescription>Modifiez vos informations publiques</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  data-testid="profile-name-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Dr. Marie Dupont"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Spécialité</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  data-testid="profile-specialty-input"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Psychologue"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                data-testid="profile-description-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Parlez de votre parcours, vos méthodes de travail..."
                rows={5}
                className="rounded-lg resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  data-testid="profile-phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Horaires</Label>
                <Input
                  id="schedule"
                  name="schedule"
                  data-testid="profile-schedule-input"
                  value={formData.schedule}
                  onChange={handleChange}
                  placeholder="Lun-Ven 9h-18h"
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                data-testid="save-profile-button"
                disabled={loading}
                className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {loading ? 'Enregistrement...' : '💾 Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;