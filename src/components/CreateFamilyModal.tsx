import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plan } from '../types/family';
import { getPlans } from '../app/actions';

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (familyName: string, description: string, planId: number) => void;
}

export default function CreateFamilyModal({ isOpen, onClose, onSubmit }: CreateFamilyModalProps) {
  const [familyName, setFamilyName] = useState('');
  const [description, setDescription] = useState('');
  const [planId, setPlanId] = useState<number | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    async function loadPlans() {
      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
        if (fetchedPlans.length > 0) {
          setPlanId(fetchedPlans[0].id);
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
      }
    }
    loadPlans();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planId !== null) {
      onSubmit(familyName, description, planId);
    }
    setFamilyName('');
    setDescription('');
    setPlanId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Family</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="familyName">Family Name</Label>
            <Input
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="plan">Plan</Label>
            <Select value={planId?.toString()} onValueChange={(value) => setPlanId(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id.toString()}>
                    {plan.name} - ${plan.price} (Max {plan.max_users} users)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Family
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

