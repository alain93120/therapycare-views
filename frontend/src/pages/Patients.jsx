import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: ''
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
      await axios.post(`${API}/patients`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Patient ajouté avec succès!');
      setDialogOpen(false);
      setFormData({ full_name: '', email: '', phone: '' });
      fetchPatients();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto" data-testid="patients-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-testid="add-patient-button"
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un patient
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau patient</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  data-testid="patient-name-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jean Martin"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  data-testid="patient-email-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.martin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  data-testid="patient-phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+33 6 12 34 56 78"
                  required
                />
              </div>
              <Button
                type="submit"
                data-testid="submit-patient-button"
                disabled={loading}
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {patients.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">Aucun patient pour le moment</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="shadow-md hover:shadow-lg transition-shadow" data-testid={`patient-card-${patient.id}`}>
              <CardHeader>
                <CardTitle className="text-xl">{patient.full_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {patient.email}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {patient.phone}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;