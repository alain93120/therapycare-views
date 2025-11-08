import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Agenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    date: '',
    time: '',
    duration: 60,
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.get(`${API}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rendez-vous');
    }
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.get(`${API}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Erreur chargement patients');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patient_id: patientId,
      patient_name: patient?.full_name || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('therapycare_token');
      await axios.post(`${API}/appointments`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Rendez-vous ajouté!');
      setDialogOpen(false);
      setFormData({ patient_id: '', patient_name: '', date: '', time: '', duration: 60, notes: '' });
      fetchAppointments();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Supprimer ce rendez-vous ?')) return;

    try {
      const token = localStorage.getItem('therapycare_token');
      await axios.delete(`${API}/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Rendez-vous supprimé');
      fetchAppointments();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {});

  const sortedDates = Object.keys(appointmentsByDate).sort();

  return (
    <div className="max-w-6xl mx-auto" data-testid="agenda-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-testid="add-appointment-button"
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter un rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient</Label>
                {patients.length > 0 ? (
                  <Select onValueChange={handlePatientSelect} value={formData.patient_id}>
                    <SelectTrigger data-testid="patient-select">
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-500">Aucun patient. Ajoutez-en un d'abord.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    data-testid="appointment-date-input"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    data-testid="appointment-time-input"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  data-testid="appointment-duration-input"
                  value={formData.duration}
                  onChange={handleChange}
                  min="15"
                  step="15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Input
                  id="notes"
                  name="notes"
                  data-testid="appointment-notes-input"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notes..."
                />
              </div>
              <Button
                type="submit"
                data-testid="submit-appointment-button"
                disabled={loading || !formData.patient_id}
                className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="text-center p-12">
          <p className="text-gray-500">Aucun rendez-vous prévu</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <Card key={date} className="shadow-md">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg text-blue-700">
                  {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {appointmentsByDate[date]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((apt) => (
                      <div
                        key={apt.id}
                        data-testid={`appointment-${apt.id}`}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-blue-600">{apt.time}</span>
                            <span className="text-gray-800 font-medium">{apt.patient_name}</span>
                            <span className="text-sm text-gray-500">({apt.duration} min)</span>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-gray-600 mt-1">{apt.notes}</p>
                          )}
                        </div>
                        <Button
                          data-testid={`delete-appointment-${apt.id}`}
                          onClick={() => handleDelete(apt.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agenda;