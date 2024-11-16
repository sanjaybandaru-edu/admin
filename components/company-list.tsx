'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { deleteCompany, updateCompany } from '@/lib/db';
import type { Company } from '@/types';
import CompanyForm from './company-form';
import Link from 'next/link';

interface CompanyListProps {
  companies: Company[];
  onUpdate: () => void;
}

export default function CompanyList({ companies, onUpdate }: CompanyListProps) {
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany(id);
        onUpdate();
        toast({
          title: 'Success',
          description: 'Company deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete company',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="grid gap-4">
      {companies.map((company) => (
        <Card key={company.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{company.name}</CardTitle>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditCompany(company)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(company.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Industry: {company.industry}</p>
              <p className="text-sm text-muted-foreground">{company.description}</p>
              {company.website && (
                <p className="text-sm">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </p>
              )}
              <div className="pt-4">
                <Link href={`/dashboard/companies/${company.id}/reports`}>
                  <Button variant="secondary">View Reports</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editCompany} onOpenChange={() => setEditCompany(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editCompany && (
            <CompanyForm
              initialData={editCompany}
              onSubmit={async (data) => {
                try {
                  await updateCompany(editCompany.id, data);
                  onUpdate();
                  setEditCompany(null);
                  toast({
                    title: 'Success',
                    description: 'Company updated successfully',
                  });
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to update company',
                    variant: 'destructive',
                  });
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}