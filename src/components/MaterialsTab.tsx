import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ServiceMaterial } from '../types/service';
import { materials } from '../data/mockData';
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
import { Plus, Save, X, Trash2, Edit, Package } from 'lucide-react';
import { Badge } from './ui/badge';

interface MaterialsTabProps {
  materials: ServiceMaterial[];
  onChange: (materials: ServiceMaterial[]) => void;
}

export function MaterialsTab({ materials: serviceMaterials, onChange }: MaterialsTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    materialId: '',
    quantity: 1,
    price: 0,
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
      materialId: '',
      quantity: 1,
      price: 0,
    });
  };

  const handleEdit = (material: ServiceMaterial) => {
    setEditingId(material.id);
    setFormData({
      materialId: material.materialId,
      quantity: material.quantity,
      price: material.price,
    });
  };

  const handleSave = () => {
    if (!formData.materialId) return;

    const selectedMaterial = materials.find((m) => m.id === formData.materialId);
    const materialName = selectedMaterial?.name || '';

    const newMaterial: ServiceMaterial = {
      id: editingId || Date.now().toString(),
      materialId: formData.materialId,
      materialName,
      quantity: formData.quantity,
      price: formData.price,
      totalCost: formData.quantity * formData.price,
    };

    if (editingId) {
      onChange(serviceMaterials.map((m) => (m.id === editingId ? newMaterial : m)));
    } else {
      onChange([...serviceMaterials, newMaterial]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onChange(serviceMaterials.filter((m) => m.id !== id));
  };

  const handleMaterialChange = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    setFormData({
      materialId,
      quantity: 1,
      price: material?.basePrice || 0,
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
            <Package className="w-5 h-5" />
            Materiais do Serviço
          </h3>
          <p className="text-slate-600 mt-1">
            Adicione os materiais necessários para execução do serviço
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
            <Card className="border-2 border-purple-200 shadow-lg shadow-purple-100/50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Material <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={formData.materialId}
                      onValueChange={handleMaterialChange}
                    >
                      <SelectTrigger className="h-11 border-slate-200">
                        <SelectValue placeholder="Selecione um material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
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
                    <Label className="text-slate-700">Preço (R$)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-700">Custo Total</Label>
                    <div className="flex items-center h-11 px-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-lg text-slate-900">
                      {formatCurrency(formData.quantity * formData.price)}
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
                    disabled={!formData.materialId}
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

      {/* Materials List */}
      {serviceMaterials.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {serviceMaterials.map((material, index) => (
            <motion.div
              key={material.id}
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
                        <p className="text-slate-600 mb-1">Material</p>
                        <p className="text-slate-900">{material.materialName}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Quantidade</p>
                        <Badge variant="outline">{material.quantity}</Badge>
                      </div>
                      <div>
                        <p className="text-slate-600 mb-1">Preço</p>
                        <p className="text-slate-900">{formatCurrency(material.price)}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center gap-2">
                      <div className="flex-1 sm:flex-none text-right">
                        <p className="text-slate-600 mb-1">Custo Total</p>
                        <p className="text-slate-900">{formatCurrency(material.totalCost)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(material)}
                          className="hover:bg-purple-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
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
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <div>
                <h4 className="text-slate-900 mb-1">Nenhum material adicionado</h4>
                <p className="text-slate-500">Clique em "Adicionar" para incluir materiais</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
