'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getCompanyReports, createReport, getReport, getCompany } from '@/lib/db';
import { generateReport } from '@/lib/grok';
import type { Report, ReportType, Company } from '@/types';
import ReactMarkdown from 'react-markdown';

const reportTypes: { id: ReportType; title: string; description: string }[] = [
  { 
    id: 'business-overview', 
    title: 'Business Overview',
    description: 'Analysis of business model, viability, and risks'
  },
  { 
    id: 'market-research', 
    title: 'Market Research',
    description: 'Industry analysis and market opportunity assessment'
  },
  { 
    id: 'launch-strategy', 
    title: 'Launch Strategy',
    description: 'MVP planning and go-to-market approach'
  },
  { 
    id: 'capital-raising', 
    title: 'Capital Raising',
    description: 'Funding strategy and investor materials'
  },
  { 
    id: 'entreprenuer-learning', 
    title: 'Entreprenuer Learning',
    description: 'Things you will learn from Doing it'
  }
  
];

export default function CompanyReportsPage() {
  const params = useParams();
  const companyId = params.id as string;
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCompanyAndReports();
  }, [companyId]);

  async function loadCompanyAndReports() {
    try {
      const [companyData, reportsData] = await Promise.all([
        getCompany(companyId),
        getCompanyReports(companyId)
      ]);
      
      if (companyData) {
        setCompany(companyData);
        setReports(reportsData);
      } else {
        toast({
          title: 'Error',
          description: 'Company not found',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load company data',
        variant: 'destructive',
      });
    }
  }

  async function handleGenerateReport(type: ReportType) {
    if (!company) {
      toast({
        title: 'Error',
        description: 'Company data not available',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    try {
      // Check if report already exists
      const existingReport = reports.find(r => r.type === type);
      if (existingReport && existingReport.cached) {
        toast({
          title: 'Info',
          description: 'Loading cached report',
        });
        return;
      }

      // Generate new report
      const content = await generateReport(company, type);
      await createReport({
        companyId,
        type,
        content,
        generatedBy: 'AI',
        cached: true
      });
      await loadCompanyAndReports();
      toast({
        title: 'Success',
        description: 'Report generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading company data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">{company.industry}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((type) => {
                const existingReport = reports.find(r => r.type === type.id);
                return (
                  <Button
                    key={type.id}
                    variant={existingReport ? "secondary" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleGenerateReport(type.id)}
                    disabled={generating}
                  >
                    <div className="text-left">
                      <div>{type.title}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>
                  {reportTypes.find((t) => t.id === report.type)?.title}
                </CardTitle>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Generated on {new Date(report.createdAt).toLocaleDateString()}</span>
                  {report.cached && <span className="text-primary">Cached</span>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{report.content}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}