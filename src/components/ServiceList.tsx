import { useState } from 'react';
import { motion } from 'motion/react';
import { Service } from '../types/service';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Package
} from 'lucide-react';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export function ServiceList({ services, onEdit, onDelete, onCreate }: ServiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const filteredServices = services.filter(
    (service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceClass.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === 'all' || service.serviceClass === selectedClass;
      
      return matchesSearch && matchesClass;
    }
  );

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const stats = [
    {
      label: 'Total de Serviços',
      value: services.length,
      icon: Package,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Valor Médio',
      value: formatCurrency(
        services.reduce((acc, s) => acc + (s.value || 0), 0) / services.length
      ),
      icon: DollarSign,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
    },
    {
      label: 'Com Radiação',
      value: services.filter((s) => s.radiationExposure).length,
      icon: AlertTriangle,
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
    },
  ];

  const serviceClasses = ['all', ...Array.from(new Set(services.map(s => s.serviceClass)))];

  return (
    <>
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600">{stat.label}</p>
                      <p className="text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg shadow-slate-200/50">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedClass === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedClass('all')}
                  className={selectedClass === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  size="sm"
                >
                  Todos
                </Button>
                {serviceClasses.filter(c => c !== 'all').map(cls => (
                  <Button
                    key={cls}
                    variant={selectedClass === cls ? 'default' : 'outline'}
                    onClick={() => setSelectedClass(cls)}
                    className={selectedClass === cls ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                    size="sm"
                  >
                    {cls}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="border-0 shadow-lg shadow-slate-200/50">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-slate-100 p-6 rounded-full">
                      <Package className="w-12 h-12 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 mb-2">Nenhum serviço encontrado</h3>
                      <p className="text-slate-500">
                        Tente ajustar os filtros ou criar um novo serviço
                      </p>
                    </div>
                    <Button 
                      onClick={onCreate}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                    >
                      Criar Primeiro Serviço
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-slate-900">{service.name}</h3>
                          {service.radiationExposure && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Radiação
                            </Badge>
                          )}
                        </div>
                        {service.abbreviation && (
                          <p className="text-slate-500">{service.abbreviation}</p>
                        )}
                        <Badge variant="outline" className="mt-2">
                          {service.serviceClass}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>Duração</span>
                        </div>
                        <p className="text-slate-900">
                          {service.duration || '-'} {service.timeUnit}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span>Valor</span>
                        </div>
                        <p className="text-slate-900">{formatCurrency(service.value)}</p>
                      </div>
                    </div>

                    {/* Costs */}
                    <div className="space-y-2 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Custo de Processos</span>
                        <span className="text-slate-900">{formatCurrency(service.processCost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Custo de Materiais</span>
                        <span className="text-slate-900">{formatCurrency(service.materialCost)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="text-slate-900">Custo Total</span>
                        <span className="text-slate-900">{formatCurrency(service.totalCost)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEdit(service)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(service.id)}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Se o serviço possuir vínculos operacionais, ele será inativado ao invés de
                  excluído.
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
