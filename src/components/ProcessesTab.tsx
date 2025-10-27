import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceProcess } from '../types/service';
import { processes } from '../data/mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent } from './ui/card';
import { Plus, Save, X, Trash2, Edit, Boxes } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProcessesTabProps {
  processes: ServiceProcess[];
  onChange: (processes: ServiceProcess[]) => void;
}

export function ProcessesTab({ processes: serviceProcesses, onChange }: ProcessesTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    processId: '',
    quantity: 1,
    cost: 0,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      processId: '',
      quantity: 1,
      cost: 0,
    });
  };

  const handleEdit = (process: ServiceProcess) => {
    setEditingId(process.id);
    setFormData({
      processId: process.processId,
      quantity: process.quantity,
      cost: process.cost,
    });
  };

  const handleSave = () => {
    if (!formData.processId) return;

    const selectedProcess = processes.find((p) => p.id === formData.processId);
    const processName = selectedProcess?.name || '';

    const newProcess: ServiceProcess = {
      id: editingId || Date.now().toString(),
      processId: formData.processId,
      processName,
      quantity: formData.quantity,
      cost: formData.cost,
      totalCost: formData.quantity * formData.cost,
    };

    if (editingId) {
      onChange(serviceProcesses.map((p) => (p.id === editingId ? newProcess : p)));
    } else {
      onChange([...serviceProcesses, newProcess]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onChange(serviceProcesses.filter((p) => p.id !== id));
  };

  const handleProcessChange = (processId: string) => {
    const process = processes.find((p) => p.id === processId);
    setFormData({
      processId,
      quantity: 1,
      cost: process?.baseCost || 0,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5" />
            Processos do Serviço
          </h3>
          <p className="text-slate-600 mt-1">
            Adicione os processos necessários para execução do serviço
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button 
            onClick={handleAdd} 
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-2 border-blue-200 shadow-lg shadow-blue-100/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Processo <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.processId}
                      onValueChange={handleProcessChange}
                    >
                      <SelectTrigger className="h-11 border-slate-200">
                        <SelectValue placeholder="Selecione um processo" />
                      </SelectTrigger>
                      <SelectContent>
                        {processes.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Quantidade</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Custo (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Custo Total</Label>
                    <div className="flex items-center h-11 px-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 rounded-lg text-slate-900">
                      {formatCurrency(formData.quantity * formData.cost)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button type="button" variant="outline" onClick={handleCancel} size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={!formData.processId}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processes List */}
      {serviceProcesses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {serviceProcesses.map((process, index) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-slate-600 mb-1">Processo</p>
                        <p className="text-slate-900">{process.processName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Quantidade</p>
                        <Badge variant="outline">{process.quantity}</Badge>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Custo</p>
                        <p className="text-slate-900">{formatCurrency(process.cost)}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center gap-2">
                      <div className="flex-1 sm:flex-none text-right">
                        <p className="text-slate-600 mb-1">Custo Total</p>
                        <p className="text-slate-900">{formatCurrency(process.totalCost)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(process)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(process.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <Boxes className="w-12 h-12 text-slate-400" />
              </div>
              <div>
                <h4 className="text-slate-900 mb-1">Nenhum processo adicionado</h4>
                <p className="text-slate-500">Clique em "Adicionar" para incluir processos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
