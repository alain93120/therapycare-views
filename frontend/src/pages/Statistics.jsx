import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, TrendingUp, Clock, BarChart3 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // week, month, year

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('therapycare_token');
      const response = await axios.get(`${API}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des statistiques...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Aucune donnée disponible</div>
      </div>
    );
  }

  const getCurrentPeriodCount = () => {
    switch (period) {
      case 'week':
        return stats.appointments_this_week;
      case 'month':
        return stats.appointments_this_month;
      case 'year':
        return stats.appointments_this_year;
      default:
        return stats.appointments_this_week;
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'week':
        return 'Cette semaine';
      case 'month':
        return 'Ce mois';
      case 'year':
        return 'Cette année';
      default:
        return 'Cette semaine';
    }
  };

  // Calculate max for chart scaling
  const maxCount = Math.max(...stats.appointments_by_day.map(d => d.count), 1);

  return (
    <div className="max-w-7xl" data-testid="statistics-page">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rendez-vous</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_appointments}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#3FA9F5] to-[#6FD0C5] rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_patients}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">À venir</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcoming_appointments}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{getPeriodLabel()}</p>
                <p className="text-3xl font-bold text-gray-900">{getCurrentPeriodCount()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Activité par période</h2>
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-l-xl font-medium transition-colors ${
              period === 'week'
                ? 'bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 font-medium transition-colors border-x border-gray-200 ${
              period === 'month'
                ? 'bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-r-xl font-medium transition-colors ${
              period === 'year'
                ? 'bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Année
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Chart Card */}
        <Card className="shadow-lg border-0 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#3FA9F5]" />
              Tendance des 30 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.appointments_by_day.length === 0 ? (
                <p className="text-gray-500 text-center py-12">Aucune donnée à afficher</p>
              ) : (
                <div className="space-y-2">
                  {stats.appointments_by_day.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-xs text-gray-600 w-20">
                        {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#3FA9F5] to-[#6FD0C5] rounded-full flex items-center justify-end pr-3 transition-all duration-300"
                          style={{ width: `${(day.count / maxCount) * 100}%` }}
                        >
                          {day.count > 0 && (
                            <span className="text-xs font-bold text-white">{day.count}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#3FA9F5]" />
              Derniers RDV
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent_appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun rendez-vous</p>
            ) : (
              <div className="space-y-3">
                {stats.recent_appointments.map((apt) => (
                  <div key={apt.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-900 text-sm truncate">{apt.patient_name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-600">
                        {new Date(apt.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-xs text-[#3FA9F5] font-medium">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#3FA9F5]" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.appointments_this_week}</p>
              <p className="text-sm text-gray-600">Rendez-vous cette semaine</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.appointments_this_month}</p>
              <p className="text-sm text-gray-600">Rendez-vous ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stats.appointments_this_year}</p>
              <p className="text-sm text-gray-600">Rendez-vous cette année</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
