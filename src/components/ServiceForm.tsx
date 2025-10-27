import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Service, TimeUnit } from '../types/service';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ProcessesTab } from './ProcessesTab';
import { MaterialsTab } from './MaterialsTab';
import { serviceClasses } from '../data/mockData';
import { 
  AlertTriangle, 
  Save, 
  X, 
  Info, 
  FileText, 
  Settings2, 
  Boxes, 
  Package,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceFormProps {
  service: Service | null;
  onSave: (service: Service) => void;
  onCancel: () => void;
  allServices: Service[];
}

export function ServiceForm({ service, onSave, onCancel, allServices }: ServiceFormProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    abbreviation: '',
    serviceClass: '',
    control: '',
    timeUnit: 'Minutos',
    duration: undefined,
    durationForecast: undefined,
    deliveryDays: 0,
    standardQuantity: 1,
    radiationExposure: false,
    value: undefined,
    processes: [],
    materials: [],
    processCost: 0,
    materialCost: 0,
    totalCost: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('identification');

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        abbreviation: '',
        serviceClass: '',
        control: '',
        timeUnit: 'Minutos',
        duration: undefined,
        durationForecast: undefined,
        deliveryDays: 0,
        standardQuantity: 1,
        radiationExposure: false,
        value: undefined,
        processes: [],
        materials: [],
        processCost: 0,
        materialCost: 0,
        totalCost: 0,
      });
    }
  }, [service]);

  // Recalculate costs when processes or materials change
  useEffect(() => {
    const processCost = (formData.processes || []).reduce(
      (sum, p) => sum + p.totalCost,
      0
    );
    const materialCost = (formData.materials || []).reduce(
      (sum, m) => sum + m.totalCost,
      0
    );
    const totalCost = processCost + materialCost;

    setFormData((prev) => ({
      ...prev,
      processCost,
      materialCost,
      totalCost,
    }));
  }, [formData.processes, formData.materials]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'Nome do serviço é obrigatório e deve ter pelo menos 3 caracteres';
    }

    if (!formData.serviceClass) {
      newErrors.serviceClass = 'Selecione uma classe de serviço';
    }

    if (!formData.timeUnit) {
      newErrors.timeUnit = 'Unidade de tempo é obrigatória';
    }

    if (formData.duration !== undefined && formData.duration < 0) {
      newErrors.duration = 'Duração deve ser maior ou igual a zero';
    }

    if (formData.durationForecast !== undefined && formData.durationForecast < 0) {
      newErrors.durationForecast = 'Previsão deve ser maior ou igual a zero';
    }

    if (formData.deliveryDays === undefined || formData.deliveryDays < 0) {
      newErrors.deliveryDays = 'Prazo de entrega é obrigatório e deve ser maior ou igual a zero';
    }

    if (formData.standardQuantity !== undefined && formData.standardQuantity < 0) {
      newErrors.standardQuantity = 'Quantidade padrão deve ser maior ou igual a zero';
    }

    if (formData.value !== undefined && formData.value < 0) {
      newErrors.value = 'Valor deve ser maior ou igual a zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    const serviceToSave: Service = {
      id: service?.id || Date.now().toString(),
      name: formData.name!,
      abbreviation: formData.abbreviation,
      serviceClass: formData.serviceClass!,
      control: formData.control,
      timeUnit: formData.timeUnit!,
      duration: formData.duration,
      durationForecast: formData.durationForecast,
      deliveryDays: formData.deliveryDays!,
      standardQuantity: formData.standardQuantity,
      radiationExposure: formData.radiationExposure!,
      value: formData.value,
      processes: formData.processes || [],
      materials: formData.materials || [],
      processCost: formData.processCost!,
      materialCost: formData.materialCost!,
      totalCost: formData.totalCost!,
      createdAt: service?.createdAt || new Date().toISOString(),
      createdBy: service?.createdBy || 'current.user@empresa.com',
    };

    onSave(serviceToSave);
    toast.success(service ? 'Serviço editado com sucesso' : 'Serviço criado com sucesso');
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const tabs = [
    { id: 'identification', label: 'Identificação', icon: FileText },
    { id: 'operation', label: 'Operação', icon: Settings2 },
    { id: 'processes', label: 'Processos', icon: Boxes },
    { id: 'materials', label: 'Materiais', icon: Package },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="hover:bg-white/50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-slate-900">
                  {service ? 'Editar Serviço' : 'Novo Serviço'}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1 bg-slate-100">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Identification Tab */}
              <TabsContent value="identification" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Serviço <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`h-11 ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                      placeholder="Ex: Limpeza Dentária"
                    />
                    {errors.name && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="abbreviation" className="text-slate-700">Abreviatura</Label>
                    <Input
                      id="abbreviation"
                      value={formData.abbreviation}
                      onChange={(e) =>
                        setFormData({ ...formData, abbreviation: e.target.value })
                      }
                      maxLength={10}
                      className="h-11 border-slate-200 focus:border-blue-500"
                      placeholder="Ex: LIM"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceClass" className="text-slate-700">
                      Classe <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.serviceClass}
                      onValueChange={(value) =>
                        setFormData({ ...formData, serviceClass: value })
                      }
                    >
                      <SelectTrigger className={`h-11 ${errors.serviceClass ? 'border-red-500' : 'border-slate-200'}`}>
                        <SelectValue placeholder="Selecione uma classe" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceClasses.map((sc) => (
                          <SelectItem key={sc.id} value={sc.name}>
                            {sc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.serviceClass && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.serviceClass}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="control" className="text-slate-700">Controle</Label>
                    <Input
                      id="control"
                      value={formData.control}
                      onChange={(e) =>
                        setFormData({ ...formData, control: e.target.value })
                      }
                      className="h-11 border-slate-200 focus:border-blue-500"
                      placeholder="Ex: SRV-001"
                    />
                  </div>
                </motion.div>
              </TabsContent>

              {/* Operation Tab */}
              <TabsContent value="operation" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timeUnit" className="text-slate-700">
                        Unidade de Tempo <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.timeUnit}
                        onValueChange={(value) =>
                          setFormData({ ...formData, timeUnit: value as TimeUnit })
                        }
                      >
                        <SelectTrigger className="h-11 border-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Minutos">Minutos</SelectItem>
                          <SelectItem value="Horas">Horas</SelectItem>
                          <SelectItem value="Dias">Dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-slate-700">Duração</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.duration || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        className={`h-11 ${errors.duration ? 'border-red-500' : 'border-slate-200'}`}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="durationForecast" className="text-slate-700">Previsão (Duração)</Label>
                      <Input
                        id="durationForecast"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.durationForecast || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            durationForecast: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        className="h-11 border-slate-200 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryDays" className="text-slate-700">
                        Prev. Entrega (Dias) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="deliveryDays"
                        type="number"
                        min="0"
                        value={formData.deliveryDays ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryDays: e.target.value ? parseInt(e.target.value) : 0,
                          })
                        }
                        className={`h-11 ${errors.deliveryDays ? 'border-red-500' : 'border-slate-200'}`}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="standardQuantity" className="text-slate-700">Quantidade Padrão</Label>
                      <Input
                        id="standardQuantity"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.standardQuantity || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            standardQuantity: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        className="h-11 border-slate-200 focus:border-blue-500"
                        placeholder="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-slate-700">Valor (R$)</Label>
                      <Input
                        id="value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.value || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            value: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                        className="h-11 border-slate-200 focus:border-blue-500"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <Switch
                      id="radiationExposure"
                      checked={formData.radiationExposure}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, radiationExposure: checked })
                      }
                      className="data-[state=checked]:bg-orange-600"
                    />
                    <Label htmlFor="radiationExposure" className="cursor-pointer text-slate-900">
                      Exposição à Radiação?
                    </Label>
                  </div>

                  {formData.radiationExposure && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-900">
                          Atenção: Serviço com exposição à radiação. Regras de segurança serão aplicadas
                          durante agendamento e execução.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  {/* Cost Summary */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl space-y-3">
                    <h4 className="text-slate-900 flex items-center gap-2 mb-4">
                      💰 Resumo de Custos
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Custo de Processos:</span>
                      <span className="text-slate-900">
                        {formatCurrency(formData.processCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Custo de Materiais:</span>
                      <span className="text-slate-900">
                        {formatCurrency(formData.materialCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200">
                      <span className="text-slate-900">Custo Total:</span>
                      <span className="text-slate-900">
                        {formatCurrency(formData.totalCost)}
                      </span>
                    </div>
                  </div>

                  {formData.value !== undefined && formData.totalCost > formData.value && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Info className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-900">
                        O custo total (
                        {formatCurrency(formData.totalCost)}) é maior que o valor do serviço (
                        {formatCurrency(formData.value)}). Revise os valores.
                      </AlertDescription>
                    </Alert>
                  )}
                </motion.div>
              </TabsContent>

              {/* Processes Tab */}
              <TabsContent value="processes">
                <ProcessesTab
                  processes={formData.processes || []}
                  onChange={(processes) => setFormData({ ...formData, processes })}
                />
              </TabsContent>

              {/* Materials Tab */}
              <TabsContent value="materials">
                <MaterialsTab
                  materials={formData.materials || []}
                  onChange={(materials) => setFormData({ ...formData, materials })}
                />
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="h-11 border-slate-200 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </motion.div>
  );
}