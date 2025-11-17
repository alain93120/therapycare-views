import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Save, Camera, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    description: '',
    phone: '',
    schedule: '',
    address: '',
    city: '',
    photo_url: ''
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
        city: response.data.city || '',
        photo_url: response.data.photo_url || ''
      });
    } catch (error) {
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2 MB');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    setUploadingPhoto(true);

    try {
      // Convertir en base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        setFormData(prev => ({ ...prev, photo_url: base64Image }));
        toast.success('Photo chargée! N\'oubliez pas de sauvegarder.');
        setUploadingPhoto(false);
      };
      reader.onerror = () => {
        toast.error('Erreur lors du chargement de l\'image');
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erreur lors du chargement de la photo');
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo_url: '' }));
    toast.info('Photo supprimée. N\'oubliez pas de sauvegarder.');
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
      const updatedUser = { ...user, ...response.data };
      localStorage.setItem('therapycare_user', JSON.stringify(updatedUser));

      toast.success('Profil mis à jour avec succès!');
      
      // Reload page to update sidebar avatar
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    return formData.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <div className="max-w-4xl" data-testid="profile-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600 mt-1">Modifiez vos informations professionnelles visibles publiquement</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Photo Profile Card */}
        <Card className="shadow-md border-0 md:col-span-1">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-32 h-32 border-4 border-gray-100">
                  {formData.photo_url ? (
                    <AvatarImage src={formData.photo_url} alt={formData.full_name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white text-3xl font-bold">
                      {getInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {formData.photo_url && (
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                    title="Supprimer la photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">{formData.full_name || 'Votre nom'}</h3>
                <p className="text-sm text-gray-600">{formData.specialty || 'Spécialité'}</p>

                <div className="pt-4">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl font-medium cursor-pointer transition-all ${
                      uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {uploadingPhoto ? 'Chargement...' : 'Changer la photo'}
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    JPG, PNG ou GIF
                    <br />
                    Maximum 2 MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="shadow-md border-0 md:col-span-2">
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
                  className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white px-8 h-11 rounded-xl font-medium shadow-lg shadow-[#3FA9F5]/30"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
