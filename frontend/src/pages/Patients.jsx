import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Plus, Mail, Phone, Edit, Trash2, Search, Calendar, FileText, Euro, Clock, Eye, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  // Données mock pour l'historique (à remplacer par vraies données API)
  const [patientHistory, setPatientHistory] = useState({
    appointments: [],
    notes: [],
    payments: [],
    documents: []
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.get(`${API}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des patients');
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
      
      if (editingPatient) {
        await axios.put(`${API}/patients/${editingPatient.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient modifié avec succès!');
      } else {
        await axios.post(`${API}/patients`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient ajouté avec succès!');
      }

      setDialogOpen(false);
      setEditingPatient(null);
      setFormData({ full_name: '', email: '', phone: '', notes: '' });
      fetchPatients();
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      full_name: patient.full_name,
      email: patient.email,
      phone: patient.phone,
      notes: patient.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('Supprimer ce patient ?')) return;

    try {
      const token = localStorage.getItem('therapycare_token');
      await axios.delete(`${API}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Patient supprimé');
      fetchPatients();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNewPatient = () => {
    setEditingPatient(null);
    setFormData({ full_name: '', email: '', phone: '', notes: '' });
    setDialogOpen(true);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    // Générer des données mock pour l'historique (à remplacer par API)
    setPatientHistory({
      appointments: [
        { id: 1, date: '2024-01-15', time: '10:00', type: 'Consultation initiale', status: 'Terminé', notes: 'Première séance. Patient anxieux concernant stress professionnel.' },
        { id: 2, date: '2024-01-22', time: '14:30', type: 'Suivi', status: 'Terminé', notes: 'Amélioration notable. Exercices de respiration pratiqués.' },
        { id: 3, date: '2024-02-05', time: '10:00', type: 'Suivi', status: 'Terminé', notes: 'Patient plus serein. Discussion sur gestion du temps.' },
        { id: 4, date: '2024-02-19', time: '15:00', type: 'Suivi', status: 'À venir', notes: '' }
      ],
      notes: [
        { id: 1, date: '2024-01-15', title: 'Évaluation initiale', content: 'Troubles anxieux liés au travail. Antécédents familiaux de stress.', category: 'Diagnostic' },
        { id: 2, date: '2024-01-22', title: 'Observation séance 2', content: 'Bonne réceptivité aux techniques de relaxation. Sommeil amélioré.', category: 'Suivi' },
        { id: 3, date: '2024-02-05', title: 'Plan thérapeutique', content: 'Objectif : réduction stress sur 3 mois. Techniques TCC recommandées.', category: 'Plan' }
      ],
      payments: [
        { id: 1, date: '2024-01-15', amount: 60, method: 'Carte bancaire', status: 'Payé', invoice: 'INV-2024-001' },
        { id: 2, date: '2024-01-22', amount: 60, method: 'Espèces', status: 'Payé', invoice: 'INV-2024-012' },
        { id: 3, date: '2024-02-05', amount: 60, method: 'Carte bancaire', status: 'Payé', invoice: 'INV-2024-023' },
        { id: 4, date: '2024-02-19', amount: 60, method: '', status: 'En attente', invoice: '' }
      ],
      documents: [
        { id: 1, name: 'Ordonnance_15-01-2024.pdf', date: '2024-01-15', type: 'Ordonnance', size: '245 KB' },
        { id: 2, name: 'Bilan_psychologique.pdf', date: '2024-01-15', type: 'Bilan', size: '1.2 MB' },
        { id: 3, name: 'Consentement_traitement.pdf', date: '2024-01-15', type: 'Consentement', size: '180 KB' }
      ]
    });
    setPatientDetailsOpen(true);
  };

  // Filtrer les patients selon la recherche
  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Calculer les statistiques du patient sélectionné
  const getPatientStats = () => {
    if (!selectedPatient) return null;
    
    const completedAppointments = patientHistory.appointments.filter(a => a.status === 'Terminé').length;
    const totalPaid = patientHistory.payments
      .filter(p => p.status === 'Payé')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayment = patientHistory.payments
      .filter(p => p.status === 'En attente')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      completedAppointments,
      totalAppointments: patientHistory.appointments.length,
      totalPaid,
      pendingPayment,
      documentsCount: patientHistory.documents.length,
      notesCount: patientHistory.notes.length
    };
  };

  return (
    <div className="max-w-7xl" data-testid="patients-page">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">{patients.length} patient(s) enregistré(s)</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                data-testid="add-patient-button"
                onClick={handleNewPatient}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter un patient
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPatient ? 'Éditer le patient' : 'Nouveau patient'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  data-testid="patient-name-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jean Martin"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-testid="patient-email-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.martin@example.com"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  data-testid="patient-phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  data-testid="patient-notes-input"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informations complémentaires..."
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button
                type="submit"
                data-testid="submit-patient-button"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg"
              >
                {loading ? (editingPatient ? 'Modification...' : 'Ajout...') : (editingPatient ? 'Modifier' : 'Ajouter')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Barre de recherche */}
      {patients.length > 0 && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un patient (nom, email, téléphone)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>
      )}
      </div>

      {patients.length === 0 ? (
        <Card className="text-center py-16 shadow-md border-0">
          <p className="text-gray-500 mb-4">Aucun patient pour le moment</p>
          <Button
            onClick={handleNewPatient}
            variant="outline"
            className="border-gray-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter votre premier patient
          </Button>
        </Card>
      ) : (
        <Card className="shadow-md border-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Nom</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Dernière visite</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      data-testid={`patient-row-${patient.id}`}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === patients.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{patient.full_name}</p>
                        {patient.notes && (
                          <p className="text-sm text-gray-500 mt-1 truncate max-w-xs">{patient.notes}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {patient.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-gray-700">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {patient.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            data-testid={`edit-patient-${patient.id}`}
                            onClick={() => handleEdit(patient)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            data-testid={`delete-patient-${patient.id}`}
                            onClick={() => handleDelete(patient.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Patients;