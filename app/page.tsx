import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText, LineChart, Rocket, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Business Report Generator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive business reports powered by AI. From market research to launch strategies, get insights that matter.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="mr-4">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Business Overview</CardTitle>
              <CardDescription>
                Analyze viability, monetization strategies, and potential risks
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Market Research</CardTitle>
              <CardDescription>
                Explore market trends, competition analysis, and target audience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Rocket className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Launch Strategy</CardTitle>
              <CardDescription>
                Plan your MVP, tech stack, and go-to-market approach
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Capital Raising</CardTitle>
              <CardDescription>
                Create pitch decks, valuations, and funding strategies
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Entreprenuer Learning</CardTitle>
              <CardDescription>
              Things you will learn from Doing it
                            </CardDescription>
            </CardHeader>
          </Card>


          
        </div>
      </div>
    </div>
  );
}