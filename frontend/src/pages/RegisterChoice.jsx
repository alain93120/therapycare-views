import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { UserCircle, Stethoscope, ArrowLeft, Check } from 'lucide-react';

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <div className="relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  Therapy
                </span>
                <span className="text-2xl font-bold text-gray-900">Care</span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
              </div>
            </Link>
            
            <Link to="/">
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Créer mon compte
          </h1>
          <p className="text-lg text-gray-600">
            Choisissez le type de compte que vous souhaitez créer
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option Client */}
          <Card className="border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate('/register/client')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Je suis un client</CardTitle>
              <CardDescription className="text-base mt-2">
                Je cherche un praticien pour mes besoins de santé et bien-être
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Rechercher et contacter des praticiens</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Prendre rendez-vous en ligne</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gérer mes consultations</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Laisser des avis</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/register/client');
                }}
              >
                M'inscrire comme client
              </Button>
            </CardContent>
          </Card>

          {/* Option Praticien */}
          <Card className="border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => navigate('/register/practitioner')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Je suis un praticien</CardTitle>
              <CardDescription className="text-base mt-2">
                Je suis un professionnel de santé et je veux être visible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Créer mon profil professionnel</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gérer mon agenda en ligne</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Recevoir des demandes de rendez-vous</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suivre mes statistiques</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/register/practitioner');
                }}
              >
                M'inscrire comme praticien
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Already have an account */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
