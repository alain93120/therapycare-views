import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
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

  // Get upcoming appointments (next 7 days)
  const today = new Date().toISOString().split('T')[0];
  const upcomingDates = sortedDates.filter(date => date >= today).slice(0, 7);

  return (
    <div className="max-w-6xl" data-testid="agenda-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Agenda</h1>
          <p className="text-gray-600 mt-1">{appointments.length} rendez-vous enregistré(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              data-testid="add-appointment-button"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouveau rendez-vous</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient *</Label>
                {patients.length > 0 ? (
                  <Select onValueChange={handlePatientSelect} value={formData.patient_id}>
                    <SelectTrigger data-testid="patient-select" className="h-11">
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
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">Aucun patient. <a href="/app/patients" className="text-blue-600 hover:underline">Ajoutez-en un d'abord</a></p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    data-testid="appointment-date-input"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    data-testid="appointment-time-input"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <Select onValueChange={(val) => setFormData(prev => ({ ...prev, duration: parseInt(val) }))} value={formData.duration.toString()}>
                  <SelectTrigger data-testid="duration-select" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Input
                  id="notes"
                  name="notes"
                  data-testid="appointment-notes-input"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Première consultation, suivi..."
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                data-testid="submit-appointment-button"
                disabled={loading || !formData.patient_id}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg"
              >
                {loading ? 'Ajout...' : 'Ajouter le rendez-vous'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="text-center py-16 shadow-md border-0">
          <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Aucun rendez-vous programmé</p>
          <Button
            onClick={() => setDialogOpen(true)}
            variant="outline"
            className="border-gray-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Planifier votre premier rendez-vous
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aujourd'hui</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {appointmentsByDate[today]?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cette semaine</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {upcomingDates.reduce((sum, date) => sum + appointmentsByDate[date].length, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{appointments.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          {sortedDates.map((date) => (
            <Card key={date} className="shadow-md border-0">
              <CardHeader className="bg-gray-50 border-b border-gray-200 py-4">
                <CardTitle className="text-base font-semibold text-gray-900">
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
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg">
                              <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">{apt.time}</p>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-base font-semibold text-gray-900">{apt.patient_name}</p>
                              <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {apt.duration} min
                                </span>
                                {apt.notes && (
                                  <span className="text-gray-500">• {apt.notes}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          data-testid={`delete-appointment-${apt.id}`}
                          onClick={() => handleDelete(apt.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
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