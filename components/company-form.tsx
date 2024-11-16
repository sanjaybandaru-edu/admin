'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Company } from '@/types';

interface CompanyFormProps {
  initialData?: Partial<Company>;
  onSubmit: (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export default function CompanyForm({ initialData, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    industry: initialData?.industry || '',
    description: initialData?.description || '',
    website: initialData?.website || '',
    marketingStrategy: initialData?.marketingStrategy || '',
    pricingModel: initialData?.pricingModel || '',
    customerAcquisition: initialData?.customerAcquisition || '',
    targetMarket: initialData?.targetMarket || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market</Label>
        <Textarea
          id="targetMarket"
          value={formData.targetMarket}
          onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
          required
          placeholder="Describe your target market and customer segments"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marketingStrategy">Marketing Strategy</Label>
        <Textarea
          id="marketingStrategy"
          value={formData.marketingStrategy}
          onChange={(e) => setFormData({ ...formData, marketingStrategy: e.target.value })}
          required
          placeholder="Outline your marketing and growth strategies"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pricingModel">Pricing Model</Label>
        <Textarea
          id="pricingModel"
          value={formData.pricingModel}
          onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
          required
          placeholder="Describe your pricing strategy and revenue model"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerAcquisition">Customer Acquisition Strategy</Label>
        <Textarea
          id="customerAcquisition"
          value={formData.customerAcquisition}
          onChange={(e) => setFormData({ ...formData, customerAcquisition: e.target.value })}
          required
          placeholder="Detail your customer acquisition tactics and channels"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full">
        Save Company
      </Button>
    </form>
  );
}