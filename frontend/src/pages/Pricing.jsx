import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Fonctionnalité à venir - Système d\'abonnement en cours de développement');
      setLoading(false);
    }, 1000);
  };

  const features = [
    'Gestion complète des rendez-vous',
    'Fiche publique personnalisée',
    'Gestion simple des patients',
    'Calendrier intuitif',
    'Support email inclus',
    'Accès illimité 24/7',
    'Mises à jour gratuites',
    'Aucune commission sur les consultations'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" data-testid="pricing-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Formule TherapyCare Pro</h1>
          <p className="text-lg text-gray-600">Simple, transparent, et abordable</p>
        </div>

        {/* Pricing Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] p-8 text-center text-white">
            <div className="mb-6">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
                <span className="text-sm font-medium">Une seule formule</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-6xl font-bold">15€</span>
                <span className="text-2xl text-white/80">/mois</span>
              </div>
              <p className="text-white/90 mt-2">Sans engagement • Annulation à tout moment</p>
            </div>
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tout ce dont vous avez besoin :</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#3FA9F5]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#3FA9F5]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                data-testid="subscribe-button"
                className="w-full bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white h-14 rounded-xl text-lg font-medium shadow-lg transition-all duration-200"
              >
                {loading ? 'Chargement...' : 'Essai gratuit 1 mois'}
              </Button>
              <Button
                variant="outline"
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full border-2 border-[#3FA9F5] text-[#3FA9F5] hover:bg-[#3FA9F5]/5 h-14 rounded-xl text-lg font-medium transition-all duration-200"
              >
                Choisir cette formule
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#3FA9F5] mb-2">50%</div>
                  <p className="text-sm text-gray-600">moins cher que la concurrence</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#6FD0C5] mb-2">2x</div>
                  <p className="text-sm text-gray-600">plus simple à utiliser</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#3FA9F5] mb-2">0€</div>
                  <p className="text-sm text-gray-600">de frais cachés</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              <strong>Note :</strong> Annulation possible à tout moment en un clic depuis votre espace professionnel.
            </p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je annuler à tout moment ?</h3>
                <p className="text-gray-600">Oui, sans préavis ni justification. Votre abonnement sera simplement arrêté à la fin du mois en cours.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Y a-t-il des frais supplémentaires ?</h3>
                <p className="text-gray-600">Non, aucun. 15€/mois, c'est tout. Pas de commission, pas de frais cachés, pas de surprise.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">L'essai gratuit est-il vraiment gratuit ?</h3>
                <p className="text-gray-600">Oui, 100% gratuit pendant 1 mois. Aucune carte bancaire demandée pour commencer.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;