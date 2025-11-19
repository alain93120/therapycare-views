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
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    notes: ''
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

  return (
    <div className="max-w-6xl" data-testid="patients-page">
      <div className="flex justify-between items-center mb-6">
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
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Téléphone</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
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