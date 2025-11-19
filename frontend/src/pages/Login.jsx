import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
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
      setTimeout(() => navigate('/app'), 500);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion');
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

        <Card className="shadow-xl border-0" data-testid="login-card">
          <CardHeader className="text-center pb-6 pt-8">
            <div className="mx-auto mb-4">
              <div className="relative inline-block">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Therapy
                </span>
                <span className="text-3xl font-bold text-gray-900">Care</span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Connexion</CardTitle>
            <p className="text-gray-600 text-sm mt-2">Accédez à votre espace</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Mot de passe oublié ?</a>
                </div>
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

              <Button
                type="submit"
                data-testid="submit-login-button"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg font-medium mt-6"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/register" data-testid="register-link" className="text-blue-600 hover:text-blue-700 font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;