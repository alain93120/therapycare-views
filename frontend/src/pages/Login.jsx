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

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      
      localStorage.setItem('therapycare_token', response.data.token);
      localStorage.setItem('therapycare_user', JSON.stringify(response.data.practitioner));
      
      toast.success('Connexion réussie!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #F1F5F9 100%)' }}>
      <Card className="w-full max-w-md shadow-xl" data-testid="login-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">TherapyCare</CardTitle>
          <CardDescription className="text-gray-600">Connectez-vous à votre espace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              data-testid="submit-login-button"
              disabled={loading}
              className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-6 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" data-testid="register-link" className="text-blue-500 hover:text-blue-600 font-medium">
                Créer un compte
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;