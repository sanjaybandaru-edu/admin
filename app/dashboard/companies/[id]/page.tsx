'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getCompany, getCompanyReports, createReport } from '@/lib/db';
import { generateReport } from '@/lib/grok';
import type { Report, ReportType, Company } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, LineChart, Rocket, Users } from 'lucide-react';

const reportTypes = [
  {
    id: 'business-overview' as ReportType,
    title: 'Business Overview',
    icon: FileText,
    description: 'Viability, monetization, and risks analysis'
  },
  {
    id: 'market-research' as ReportType,
    title: 'Market Research',
    icon: Users,
    description: 'Market trends and competition analysis'
  },
  {
    id: 'launch-strategy' as ReportType,
    title: 'Launch Strategy',
    icon: Rocket,
    description: 'MVP and go-to-market planning'
  },
  {
    id: 'capital-raising' as ReportType,
    title: 'Capital Raising',
    icon: LineChart,
    description: 'Funding strategy and investor materials'
  },
  {
    id: 'entreprenuer-learning' as ReportType,
    title: 'Entreprenuer Learning',
    icon: LineChart,
    description: 'Things you will learn from Doing it'
  }
];

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, [params.id]);

  async function loadCompanyData() {
    try {
      const companyData = await getCompany(params.id as string);
      if (!companyData) {
        toast({
          title: 'Error',
          description: 'Company not found',
          variant: 'destructive'
        });
        router.push('/dashboard');
        return;
      }
      setCompany(companyData);
      const reportsData = await getCompanyReports(params.id as string);
      setReports(reportsData);
      if (reportsData.length > 0) {
        setSelectedReport(reportsData[0]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load company data',
        variant: 'destructive'
      });
    }
  }

  const handleGenerateReport = async (type: ReportType) => {
    if (!company) return;

    setGenerating(true);
    try {
      const existingReport = reports.find(r => r.type === type);
      if (existingReport) {
        setSelectedReport(existingReport);
        toast({
          title: 'Info',
          description: 'Loading existing report'
        });
        return;
      }

      const content = await generateReport(company, type);
      const newReport = await createReport({
        companyId: company.id,
        type,
        content,
        generatedBy: 'AI',
        cached: true
      });
      await loadCompanyData();
      setSelectedReport(newReport);
      toast({
        title: 'Success',
        description: 'Report generated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
        <p className="text-muted-foreground">{company.industry}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{company.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Target Market</h3>
                <p className="text-sm text-muted-foreground">{company.targetMarket}</p>
              </div>
              <div>
                <h3 className="font-medium">Marketing Strategy</h3>
                <p className="text-sm text-muted-foreground">{company.marketingStrategy}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {reportTypes.map((type) => {
                  const existingReport = reports.find(r => r.type === type.id);
                  return (
                    <Button
                      key={type.id}
                      variant={existingReport ? (selectedReport?.type === type.id ? "default" : "secondary") : "outline"}
                      className="justify-start"
                      onClick={() => existingReport ? setSelectedReport(existingReport) : handleGenerateReport(type.id)}
                      disabled={generating}
                    >
                      <type.icon className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div>{type.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {existingReport ? 'View Report' : type.description}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {generating ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ) : selectedReport ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {reportTypes.find(t => t.id === selectedReport.type)?.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generated on {new Date(selectedReport.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedReport.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Select a report type to generate or view a report
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}