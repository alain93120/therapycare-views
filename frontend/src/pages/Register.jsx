import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
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
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #F1F5F9 100%)' }}>
      <Card className="w-full max-w-md shadow-xl" data-testid="register-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">TherapyCare</CardTitle>
          <CardDescription className="text-gray-600">Créez votre compte praticien</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                name="full_name"
                data-testid="full-name-input"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Dr. Marie Dupont"
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                data-testid="email-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="marie.dupont@example.com"
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Spécialité</Label>
              <Input
                id="specialty"
                name="specialty"
                data-testid="specialty-input"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Psychologue"
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                data-testid="password-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="rounded-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone (facultatif)</Label>
              <Input
                id="phone"
                name="phone"
                data-testid="phone-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
                className="rounded-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                data-testid="accept-terms-checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
                J'accepte les conditions générales d'utilisation
              </Label>
            </div>

            <Button
              type="submit"
              data-testid="submit-register-button"
              disabled={loading}
              className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" data-testid="login-link" className="text-blue-500 hover:text-blue-600 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;