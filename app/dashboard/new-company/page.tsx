'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createCompany } from '@/lib/db';

export default function NewCompanyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    targetMarket: '',
    marketingStrategy: '',
    pricingModel: '',
    customerAcquisition: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const company = await createCompany(formData);
      toast({
        title: 'Success',
        description: 'Company created successfully'
      });
      router.push(`/dashboard/companies/${company.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create company',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                required
                value={formData.targetMarket}
                onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                placeholder="Describe your target market and customer segments"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketingStrategy">Marketing Strategy</Label>
              <Textarea
                id="marketingStrategy"
                required
                value={formData.marketingStrategy}
                onChange={(e) => setFormData({ ...formData, marketingStrategy: e.target.value })}
                placeholder="Outline your marketing and growth strategies"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricingModel">Pricing Model</Label>
              <Textarea
                id="pricingModel"
                required
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                placeholder="Describe your pricing strategy and revenue model"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerAcquisition">Customer Acquisition Strategy</Label>
              <Textarea
                id="customerAcquisition"
                required
                value={formData.customerAcquisition}
                onChange={(e) => setFormData({ ...formData, customerAcquisition: e.target.value })}
                placeholder="Detail your customer acquisition tactics and channels"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Company</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}