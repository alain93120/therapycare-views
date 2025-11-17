import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h to 20h

const AgendaCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
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

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate) {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function formatDateDisplay(date) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  const weekDays = getWeekDays(currentWeekStart);

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

  const getAppointmentsForSlot = (date, hour) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.time.split(':')[0]);
      const aptMinutes = parseInt(apt.time.split(':')[1]);
      const slotStart = hour;
      const slotEnd = hour + 1;
      const aptStart = aptHour + (aptMinutes / 60);
      return aptStart >= slotStart && aptStart < slotEnd;
    });
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  return (
    <div className="max-w-full" data-testid="agenda-page">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Agenda</h1>
            <p className="text-gray-600 mt-1">{appointments.length} rendez-vous enregistré(s)</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200">
              <Button
                onClick={goToPreviousWeek}
                variant="ghost"
                size="sm"
                className="rounded-l-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={goToToday}
                variant="ghost"
                size="sm"
                className="font-medium px-4"
              >
                Aujourd'hui
              </Button>
              <Button
                onClick={goToNextWeek}
                variant="ghost"
                size="sm"
                className="rounded-r-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              data-testid="add-appointment-button"
              className="bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[#3FA9F5]/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau rendez-vous
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                <div className="p-4 text-sm font-medium text-gray-500">Heure</div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-4 text-center border-l border-gray-200 ${
                      isToday(day) ? 'bg-gradient-to-br from-[#3FA9F5]/10 to-[#6FD0C5]/10' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium ${isToday(day) ? 'text-[#3FA9F5]' : 'text-gray-900'}`}>
                      {formatDateDisplay(day).split(' ')[0]}
                    </div>
                    <div className={`text-xs mt-1 ${isToday(day) ? 'text-[#3FA9F5] font-bold' : 'text-gray-600'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
                  <div className="p-4 text-sm text-gray-600 font-medium border-r border-gray-200 bg-gray-50">
                    {`${hour}:00`}
                  </div>
                  {weekDays.map((day, dayIndex) => {
                    const slotAppointments = getAppointmentsForSlot(day, hour);
                    return (
                      <div
                        key={dayIndex}
                        className={`p-2 border-l border-gray-200 min-h-[80px] ${
                          isToday(day) ? 'bg-[#3FA9F5]/5' : ''
                        }`}
                      >
                        {slotAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            data-testid={`appointment-${apt.id}`}
                            className="bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] text-white rounded-lg p-2 mb-1 shadow-md hover:shadow-lg transition-shadow group relative"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold truncate">{apt.time}</div>
                                <div className="text-sm font-medium truncate mt-0.5">{apt.patient_name}</div>
                                <div className="text-xs opacity-90 mt-0.5">{apt.duration} min</div>
                              </div>
                              <button
                                onClick={() => handleDelete(apt.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 p-1 hover:bg-white/20 rounded"
                                data-testid={`delete-appointment-${apt.id}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            {apt.notes && (
                              <div className="text-xs opacity-80 mt-1 truncate">{apt.notes}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Appointment Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  Aucun patient. <a href="/app/patients" className="text-[#3FA9F5] hover:underline">Ajoutez-en un d'abord</a>
                </p>
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
              <Label htmlFor="duration">Durée *</Label>
              <Select 
                onValueChange={(val) => setFormData(prev => ({ ...prev, duration: parseInt(val) }))} 
                value={formData.duration.toString()}
              >
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
              className="w-full bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] hover:opacity-90 text-white h-11 rounded-xl"
            >
              {loading ? 'Ajout...' : 'Ajouter le rendez-vous'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaCalendar;
