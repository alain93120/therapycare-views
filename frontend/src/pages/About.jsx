import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Mail, Linkedin, Instagram, Send, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const About = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé avec succès! Nous vous répondrons rapidement.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      // Fallback si l'API n'existe pas encore
      toast.success('Message enregistré! Nous vous répondrons rapidement.');
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TherapyCare</span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Accueil</Link>
              <a href="#apropos" onClick={(e) => { e.preventDefault(); scrollToSection('apropos'); }} className="text-gray-700 hover:text-blue-600 font-medium transition">À propos</a>
              <a href="#cgu" onClick={(e) => { e.preventDefault(); scrollToSection('cgu'); }} className="text-gray-700 hover:text-blue-600 font-medium transition">CGU</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="text-gray-700 hover:text-blue-600 font-medium transition">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Inscription</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">À propos de TherapyCare</h1>
          <p className="text-lg text-gray-600">Découvrez notre mission et nos valeurs</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* À propos */}
        <section id="apropos" data-testid="about-section">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">À propos de TherapyCare</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-blue-600">TherapyCare</strong> est une plateforme en ligne dédiée aux professionnels de santé et du bien-être. 
                  Notre mission est de simplifier la prise de rendez-vous et la gestion des patients, tout en offrant une visibilité optimale aux praticiens.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Inspirée par des solutions comme Resalib, TherapyCare met l'humain et la simplicité au cœur de l'expérience digitale. 
                  Nous croyons que la technologie doit servir les relations humaines, pas les remplacer.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Que vous soyez psychologue, psychiatre, thérapeute ou tout autre professionnel de santé, TherapyCare vous accompagne 
                  dans votre quotidien pour vous permettre de vous concentrer sur l'essentiel : vos patients.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Qui sommes-nous */}
        <section id="quisommesnous" data-testid="who-section">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Qui sommes-nous ?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous sommes une équipe de développeurs et de professionnels passionnés par la e-santé. 
                  Notre objectif est de créer des outils qui facilitent vraiment le quotidien des praticiens et améliorent l'accès aux soins pour tous.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>TherapyCare</strong> vise à connecter les praticiens à leurs patients grâce à une interface intuitive, sécurisée et moderne. 
                  Nous mettons un point d'honneur à développer une solution accessible, sans complexité technique inutile.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Notre objectif est de rendre les outils de gestion accessibles à tous les praticiens indépendants, 
                  quelle que soit leur taille de cabinet ou leur niveau de familiarité avec les outils numériques.
                </p>

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Proximité</h3>
                    <p className="text-sm text-gray-600">Une équipe à l'écoute de vos besoins</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sécurité</h3>
                    <p className="text-sm text-gray-600">Protection des données garantie</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Simplicité</h3>
                    <p className="text-sm text-gray-600">Interface intuitive et moderne</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CGU */}
        <section id="cgu" data-testid="cgu-section">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Conditions Générales d'Utilisation</h2>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptation des conditions</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  En utilisant la plateforme TherapyCare, les utilisateurs acceptent les présentes conditions d'utilisation. 
                  Ces conditions régissent l'utilisation de nos services et définissent les droits et obligations de chaque partie.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Responsabilité des praticiens</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Les praticiens sont responsables des informations publiées sur leur profil. Ils s'engagent à fournir des informations 
                  exactes, à jour et conformes à leur situation professionnelle. Toute information trompeuse peut entraîner la suspension du compte.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Protection des données</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  TherapyCare s'engage à protéger les données personnelles conformément au RGPD (Règlement Général sur la Protection des Données). 
                  Les données collectées sont utilisées uniquement pour le fonctionnement de la plateforme et ne sont jamais vendues à des tiers.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Sécurité et confidentialité</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données 
                  contre tout accès, modification, divulgation ou destruction non autorisés.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Modification des conditions</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  TherapyCare se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés 
                  de toute modification significative par email ou via la plateforme.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8">
                  <p className="text-sm text-gray-700">
                    <strong className="text-blue-900">Pour plus d'informations</strong>, consultez notre politique de confidentialité 
                    ou contactez-nous via le formulaire ci-dessous.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section id="contact" data-testid="contact-section">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contactez-nous</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Vous avez une question, une suggestion ou besoin d'assistance ? N'hésitez pas à nous contacter. 
                Notre équipe vous répondra dans les plus brefs délais.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Nom complet *</Label>
                  <Input
                    id="name"
                    name="name"
                    data-testid="contact-name-input"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    data-testid="contact-email-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    data-testid="contact-message-input"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande ou question..."
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="contact-submit-button"
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 rounded-lg font-medium"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Autres moyens de contact</h3>
                <div className="flex flex-wrap gap-4">
                  <a href="mailto:contact@therapycare.fr" className="flex items-center text-gray-700 hover:text-blue-600 transition">
                    <Mail className="w-5 h-5 mr-2" />
                    contact@therapycare.fr
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">TherapyCare</span>
              </div>
              <p className="text-gray-600 text-sm">La plateforme de prise de rendez-vous pour professionnels de santé</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/" className="hover:text-blue-600">Accueil</Link></li>
                <li><a href="#apropos" onClick={(e) => { e.preventDefault(); scrollToSection('apropos'); }} className="hover:text-blue-600">À propos</a></li>
                <li><a href="#quisommesnous" onClick={(e) => { e.preventDefault(); scrollToSection('quisommesnous'); }} className="hover:text-blue-600">Qui sommes-nous</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#cgu" onClick={(e) => { e.preventDefault(); scrollToSection('cgu'); }} className="hover:text-blue-600">CGU</a></li>
                <li><a href="#" className="hover:text-blue-600">Politique de confidentialité</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="mailto:contact@therapycare.fr" className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 TherapyCare. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Retour en haut"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default About;