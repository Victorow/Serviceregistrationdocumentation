import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceList } from './components/ServiceList';
import { ServiceForm } from './components/ServiceForm';
import { Service } from './types/service';
import { mockServices } from './data/mockData';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'form'>('list');

  const handleCreateService = () => {
    setSelectedService(null);
    setActiveView('form');
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setActiveView('form');
  };

  const handleSaveService = (service: Service) => {
    if (selectedService) {
      setServices(services.map(s => s.id === service.id ? service : s));
    } else {
      setServices([...services, { ...service, id: Date.now().toString() }]);
    }
    setActiveView('list');
    setSelectedService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleCancel = () => {
    setSelectedService(null);
    setActiveView('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Toaster position="top-right" />

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4 lg:px-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {activeView === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceList
                services={services}
                onEdit={handleEditService}
                onDelete={handleDeleteService}
                onCreate={handleCreateService}
              />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ServiceForm
                service={selectedService}
                onSave={handleSaveService}
                onCancel={handleCancel}
                allServices={services}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}