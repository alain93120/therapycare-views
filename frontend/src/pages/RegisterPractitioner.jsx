import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    specialty: '',
    password: '',
    phone: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error('Veuillez accepter les conditions générales');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/register`, {
        full_name: formData.full_name,
        email: formData.email,
        specialty: formData.specialty,
        password: formData.password,
        phone: formData.phone
      });

      localStorage.setItem('therapycare_token', response.data.token);
      localStorage.setItem('therapycare_user', JSON.stringify(response.data.practitioner));
      
      toast.success('Compte créé avec succès!');
      setTimeout(() => navigate('/app'), 500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="shadow-xl border-0" data-testid="register-card">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Créer mon compte praticien</CardTitle>
            <p className="text-gray-600 text-sm mt-2">Rejoignez TherapyCare et gérez vos rendez-vous facilement</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700">Nom complet *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  data-testid="full-name-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Dr. Marie Dupont"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email professionnel *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-testid="email-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="marie.dupont@example.com"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-gray-700">Spécialité *</Label>
                <Input
                  id="specialty"
                  name="specialty"
                  data-testid="specialty-input"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Psychologue, Psychiatre..."
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  data-testid="phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Mot de passe *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  data-testid="password-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-11"
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  data-testid="accept-terms-checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer font-normal">
                  J'accepte les <a href="#" className="text-blue-600 hover:underline">conditions générales d'utilisation</a> et la <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>
                </Label>
              </div>

              <Button
                type="submit"
                data-testid="submit-register-button"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg font-medium mt-6"
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà inscrit ?{' '}
                <Link to="/login" data-testid="login-link" className="text-blue-600 hover:text-blue-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;